import { startSession } from "mongoose";
import { videoReactionType } from "../../../Common/index.js";
import { uploadImageOnCloudinary, uploadVideoOnCloudinary } from "../../../Common/Services/cloudinary.service.js";
import { HistoryModel, NotificationModel, SubscriptionModel, VideoModel, VideoReactionModel, VideoViewModel } from "../../../DB/Models/index.js";
import { getIO } from "../../../Utils/index.js";



export const uploadVideo = async (req, res) => {
    const { files } = req
    const { title, description, category, visibility, commentsAllow } = req.body
    const { user: { _id } } = req.loggedInUser

    if (!files.video[0].mimetype.startsWith("video/")) return res.status(400).json({ message: "invalid video file" })
    if (!files.thumbnail[0].mimetype.startsWith("image/")) return res.status(400).json({ message: "invalid thumbnail file" })

    const uploadedVideo = await VideoModel.create({
        title,
        description,
        category,
        visibility,
        commentsAllow,
        owner: _id,
        status: "processing",
    });

    res.status(201).json({ message: "Video is processing...", uploadedVideo });

    processVideoUpload(uploadedVideo._id, files).catch(console.error);

    const users = await SubscriptionModel.find({
        channel: _id
    }).distinct("subscriber");

    const notificationDocs = users.map(subscriberId => ({
        recipient: subscriberId,
        sender: _id,
        type: "upload",
        video: uploadedVideo._id
    }));

    if (notificationDocs.length > 0) {
        await NotificationModel.insertMany(notificationDocs);
    }

    const uploaderName = req.loggedInUser.user.uniqueChannelName;
    users.forEach(subscriberId => {
        sendNotification(subscriberId, {
            message: `${uploaderName} uploaded a new video`,
            type: "upload",
            sender: uploaderName,
            video: uploadedVideo._id
        });
    });
}

const processVideoUpload = async (videoId, files) => {
    try {
        const videoUploadResult = await uploadVideoOnCloudinary(files.video[0]);
        const thumbnailUploadResult = await uploadImageOnCloudinary(files.thumbnail[0], "youtube-clone-thumbnails");

        const secureUrl = videoUploadResult?.secure_url;
        let hlsUrl = secureUrl;
        if (secureUrl) {
            hlsUrl = secureUrl.replace('/upload/', '/upload/sp_hd/');
            const extIndex = hlsUrl.lastIndexOf('.');
            if (extIndex !== -1) {
                hlsUrl = hlsUrl.substring(0, extIndex) + '.m3u8';
            } else {
                hlsUrl += '.m3u8';
            }
        }

        await VideoModel.findByIdAndUpdate(videoId, {
            videoUrl: hlsUrl,
            videoId: videoUploadResult?.public_id,
            thumbnailUrl: thumbnailUploadResult?.secure_url,
            thumbnailId: thumbnailUploadResult?.public_id,
            duration: videoUploadResult?.duration,
            status: "published"
        });
    } catch (err) {
        await VideoModel.findByIdAndUpdate(videoId, { status: "failed" });
    }
}


// export const getVideos = async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 12;
//     const search = req.query.search || '';
//     const skip = (page - 1) * limit;

//     const query = { status: "published" };
    
//     if (search) {
//         query.$text = { $search: search };
//     }

//     let videoQuery = VideoModel.find(query).populate("owner", "channelName logoUrl");

//     if (search) {
//         videoQuery = videoQuery.sort({ score: { $meta: "textScore" } });
//     } else {
//         videoQuery = videoQuery.sort({ createdAt: -1 });
//     }

//     const videos = await videoQuery.skip(skip).limit(limit);

//     const totalVideos = await VideoModel.countDocuments(query);
//     const hasNextPage = skip + videos.length < totalVideos;
//     const nextPage = hasNextPage ? page + 1 : null;

//     return res.status(200).json({ videos, nextPage });
// }
export const getVideos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let pipeline = [];

    if (search) {
        pipeline.push({
            $search: {
                index: "default",
                text: {
                    query: search,
                    path: ["title", "description"],
                    fuzzy: {
                        maxEdits: 2 
                    }
                }
            }
        });
    }

    pipeline.push({
        $match: { status: "published" }
    });

    if (search) {
        pipeline.push({ $sort: { score: { $meta: "searchScore" } } });
    } else {
        pipeline.push({ $sort: { createdAt: -1 } });
    }

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    pipeline.push({
        $lookup: {
            from: "users", 
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    });
    pipeline.push({ $unwind: "$owner" });
    
    pipeline.push({
        $addFields: {
            owner: {
                _id: "$owner._id",
                channelName: "$owner.channelName",
                logoUrl: "$owner.logoUrl"
            }
        }
    });

    console.log(pipeline);
    

    try {
        const videos = await VideoModel.aggregate(pipeline);

        const query = { status: "published" };
        const totalVideos = await VideoModel.countDocuments(query); 
        
        const hasNextPage = skip + videos.length < totalVideos;
        const nextPage = hasNextPage ? page + 1 : null;

        return res.status(200).json({ videos, nextPage });
    } catch (error) {
        console.error("Atlas Search Error:", error);
        return res.status(500).json({ message: "Search failed. Did you create the Atlas Search index?" });
    }
}


export const getVideo = async (req, res) => {

    const { videoId } = req.params

    const video = await VideoModel.findById(videoId).populate("owner", "channelName logoUrl subscribers uniqueChannelName").lean()
    if (!video) return res.status(404).json({ message: "video not found" })


    let userReaction = null;
    let isSubscribed = false;
    if (req.loggedInUser && req.loggedInUser.user) {
        const reaction = await VideoReactionModel.findOne({
            user: req.loggedInUser.user._id,
            video: videoId
        }).lean();
        const subscribe = await SubscriptionModel.findOne({
            subscriber: req.loggedInUser.user._id,
            channel: video.owner._id
        }).lean();
        if (reaction) {
            userReaction = reaction.type;
        }
        if (subscribe) {
            isSubscribed = true;
        }
    }

    video.userReaction = userReaction;
    video.isSubscribed = isSubscribed;

    return res.status(200).json({ video })

}

export const reactionToVideo = async (req, res) => {
    const { user } = req.loggedInUser;
    const { videoId } = req.params;
    const { type } = req.body;

    if (!Object.values(videoReactionType).includes(type)) return res.status(400).json({ message: "invalid reaction type" });
    if (!videoId) return res.status(400).json({ message: "video id is required" });

    const video = await VideoModel.findById(videoId);
    if (!video) return res.status(404).json({ message: "video not found" });

    const session = await startSession();

    try {
        session.startTransaction();

        const previousReaction = await VideoReactionModel.findOne({ user: user._id, video: videoId }).session(session);

        let message;
        let shouldNotify = false;

        if (previousReaction) {
            if (previousReaction.type === type) {
                await VideoReactionModel.findByIdAndDelete(previousReaction._id, { session });
                await VideoModel.findByIdAndUpdate(videoId, { $inc: { [`${type}s`]: -1 } }, { session });
                if (type === 'like') {
                    await NotificationModel.findOneAndDelete({
                        sender: user._id,
                        recipient: video.owner,
                        video: videoId,
                        type: 'like'
                    }, { session });
                }
                message = "reaction removed successfully";
            } else {
                await VideoReactionModel.findByIdAndUpdate(previousReaction._id, { type }, { session });
                await VideoModel.findByIdAndUpdate(videoId, {
                    $inc: { [`${previousReaction.type}s`]: -1, [`${type}s`]: 1 }
                }, { session });
                message = "reaction updated successfully";
                shouldNotify = type === 'like';
            }
        } else {
            await VideoReactionModel.create([{ user: user._id, video: videoId, type }], { session });
            await VideoModel.findByIdAndUpdate(videoId, { $inc: { [`${type}s`]: 1 } }, { session });
            message = "reaction added successfully";
            shouldNotify = type === 'like';
        }

        const isNotLikingOwnVideo = video.owner.toString() !== user._id.toString();

        if (shouldNotify && isNotLikingOwnVideo) {
            await NotificationModel.create([{
                type: 'like',
                recipient: video.owner,
                sender: user._id,
                video: videoId
            }], { session });
        }

        await session.commitTransaction();

        if (shouldNotify && isNotLikingOwnVideo) {
            try {
                getIO().to(video.owner.toString()).emit("notification", {
                    message: `${user.channelName} liked your video "${video.title}"`,
                    type: "like",
                    videoId: video._id
                });
            } catch (err) {
                console.error("Socket notification error:", err.message);
            }
        }

        return res.status(200).json({ message });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ message: "something went wrong" });
    } finally {
        session.endSession();
    }
}

export const addView = async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) return res.status(400).json({ message: "video id is required" });

    const video = await VideoModel.findById(videoId);
    if (!video) return res.status(404).json({ message: "video not found" });

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // console.log(ipAddress);
    const userId = req.loggedInUser?.user?._id;

    let existingView;
    if (userId) {
        existingView = await VideoViewModel.findOne({ video: videoId, user: userId });

    } else {
        existingView = await VideoViewModel.findOne({ video: videoId, ipAddress });
    }

    if (userId) {
        const watchHistory = await HistoryModel.findOne({ video: videoId, user: userId });

        if (!watchHistory) {
            await HistoryModel.create({
                video: videoId,
                user: userId
            });
        } else {
            watchHistory.updatedAt = Date.now();
            await watchHistory.save();
        }
    }

    if (existingView) {
        return res.status(200).json({ message: "already viewed" });
    }
    await VideoViewModel.create({
        video: videoId,
        user: userId || null,
        ipAddress: ipAddress
    });

    video.views += 1;
    await video.save();

    return res.status(200).json({ message: "view added successfully" });
};


export const deleteVideo = async (req, res) => {

    const { videoId } = req.params
    const { _id } = req.loggedInUser.user

    const video = await VideoModel.findById(videoId)
    if (!video) return res.status(404).json({ message: "video not found" })

    if (video.owner.toString() !== _id.toString()) return res.status(403).json({ message: "you can not delete this video" })

    await VideoModel.findByIdAndDelete(videoId)

    return res.status(200).json({ message: "video deleted successfully" })
}

