import { startSession } from "mongoose";
import { videoReactionType } from "../../../Common/index.js";
import { uploadImageOnCloudinary, uploadVideoOnCloudinary } from "../../../Common/Services/cloudinary.service.js";
import { VideoModel, VideoReactionModel } from "../../../DB/Models/index.js";



export const uploadVideo = async (req, res) => {
    const { files } = req
    const { title, description, category, visibility ,commentsAllow} = req.body
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


export const getVideos = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const videos = await VideoModel.find({ status: "published" })
        .populate("owner", "channelName logoUrl")
        .skip(skip)
        .limit(limit);

    const totalVideos = await VideoModel.countDocuments({ status: "published" });
    const hasNextPage = skip + videos.length < totalVideos;
    const nextPage = hasNextPage ? page + 1 : null;

    return res.status(200).json({ videos, nextPage });
}

export const getVideo = async (req, res) => {

    const { videoId } = req.params

    const video = await VideoModel.findById(videoId).populate("owner", "channelName logoUrl subscribers").lean()
    if (!video) return res.status(404).json({ message: "video not found" })

    let userReaction = null;
    if (req.loggedInUser && req.loggedInUser.user) {
        const reaction = await VideoReactionModel.findOne({
            user: req.loggedInUser.user._id,
            video: videoId
        }).lean();
        if (reaction) {
            userReaction = reaction.type;
        }
    }

    video.userReaction = userReaction;

    return res.status(200).json({ video })

}

export const reactionToVideo = async (req, res) => {

    const { user } = req.loggedInUser
    const { videoId } = req.params
    const { type } = req.body

    if (!Object.values(videoReactionType).includes(type)) return res.status(400).json({ message: "invalid reaction type" })
    if(!videoId) return res.status(400).json({ message: "video id is required" })

    const video = await VideoModel.findById(videoId)
    if (!video) return res.status(404).json({ message: "video not found" })

    const session = await startSession()

    try{
        session.startTransaction()
        let message;

        const previousReaction = await VideoReactionModel.findOne({ user: user._id, video: videoId }).session(session)

        if (previousReaction) {
            if (previousReaction.type === type) {
                await VideoReactionModel.findByIdAndDelete(previousReaction._id , {session})
                await VideoModel.findByIdAndUpdate(videoId, { $inc: { [`${type}s`]: -1 } } ,{session})
                message = "reaction removed successfully"
            } else {
                await VideoReactionModel.findByIdAndUpdate(previousReaction._id, { type } ,{session})
                await VideoModel.findByIdAndUpdate(videoId, {
                    $inc: {
                        [`${previousReaction.type}s`]: -1,
                        [`${type}s`]: 1
                    }
                }, {session})
                message = "reaction updated successfully"
            }
        }else{
            await VideoReactionModel.create([{
                user: user._id,
                video: videoId,
                type
            }], {session})
            await VideoModel.findByIdAndUpdate(videoId, { $inc: { [`${type}s`]: 1 } } ,{session})
            message = "reaction added successfully"
        }

        await session.commitTransaction()

        return res.status(200).json({ message });

    }
    catch (error) {
        await session.abortTransaction()
        return res.status(500).json({ message: "something went wrong" })
    } finally {
        session.endSession()
    }

}

