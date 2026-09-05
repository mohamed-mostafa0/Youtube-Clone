import { CommentModel, CommentReactionModel, NotificationModel, VideoModel } from "../../../DB/Models/index.js"
import { videoReactionType, videoVisibility } from "../../../Common/index.js"
import mongoose from "mongoose";
import { getIO, sendNotification } from "../../../Utils/index.js";



export const addComment = async(req, res) => {
        const {videoId} = req.params;
        const {user} = req.loggedInUser; 
        const {content , parentCommentId} = req.body;

        if (!content || !content.trim()) return res.status(400).json({message: "Comment can not be empty"});
        if (content.length > 2000) return res.status(400).json({message: "Comment is too long"});

        const video = await VideoModel.findById(videoId)
        if (!video) return res.status(404).json({message: "Video Not Found"});

        if(video.visibility === videoVisibility.PRIVATE) return res.status(403).json({message:"You can not access this video"})
        if(video.commentsAllow == false) return res.status(403).json({message:"Comments are disabled for this video"})

        let mainComment = null;
        if (parentCommentId) {
            mainComment = await CommentModel.findById(parentCommentId);
            if (!mainComment) return res.status(404).json({message: "Comment Not Found"});
        }
        console.log(parentCommentId);
        

        if(parentCommentId && mainComment.owner.toString() !== user._id.toString()){
            sendNotification(mainComment.owner , {
                message :`${user.uniqueChannelName} replied to your comment`,
                type: "comment",
                sender : user.uniqueChannelName,
                video: videoId  
            })
            await NotificationModel.create({
                type:"comment",
                recipient:mainComment.owner,
                sender:user._id,
                video:videoId,
                comment:parentCommentId
            })
        }

        if(!parentCommentId && video.owner.toString() !== user._id.toString()){
            sendNotification(video.owner , {
                message :`${user.uniqueChannelName} commented on your video "${video.title}"`,
                type: "comment",
                sender : user.uniqueChannelName,
                video: videoId  
            })
            
            await NotificationModel.create({
                type:"comment",
                recipient:video.owner,
                sender:user._id,
                video:videoId,
            })
        }

        await CommentModel.create({
            content,
            owner: user._id,
            video: video._id,
            parentComment: parentCommentId || null
        });

        return res.status(201).json({message: "Comment Added Successfully"});
}

const buildCommentTree = (comments) => {
    const commentMap = new Map()

    comments.forEach(comment => {
        commentMap.set(comment._id.toString(), {
            ...comment,
            replies: []
        })
    })
    // console.log(commentMap);
    

    const tree = []

    comments.forEach(comment => {
        const commentNode = commentMap.get(comment._id.toString())

        if (comment.parentComment) {
            const parent = commentMap.get(
                comment.parentComment.toString()
            )

            if (parent) {
                parent.replies.push(commentNode)
            } else {
                tree.push(commentNode)
            }
        } else {
            tree.push(commentNode)
        }
    })

    return tree
}


export const getCommentsByVideo = async (req , res)=>{
    // console.log("test");
    
        const {videoId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const video = await VideoModel.findById(videoId);
        if(!video) return res.status(404).json({message:"Video Not Found"});

        if(video.visibility === videoVisibility.PRIVATE) return res.status(403).json({message:"You can not access this video"});

        if(video.commentsAllow == false) return res.status(403).json({message:"Comments are disabled for this video"});

        const rootComments = await CommentModel.find({
            video: video._id,
            parentComment: null
        }).populate("owner" , "uniqueChannelName logoUrl").sort({createdAt:-1}).skip(skip).limit(limit).lean();

        const rootCommentIds = rootComments.map(c => c._id);

        const descendants = await CommentModel.aggregate([
            { $match: { _id: { $in: rootCommentIds } } },
            {
                $graphLookup: {
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentComment",
                    as: "allReplies"
                }
            },
            { $unwind: "$allReplies" },
            { $replaceRoot: { newRoot: "$allReplies" } }
        ]);

        const populatedDescendants = await CommentModel.populate(descendants, { 
            path: "owner", 
            select: "uniqueChannelName logoUrl" 
        });

        const allCommentsForPage = [...rootComments, ...populatedDescendants];
        const commentIds = allCommentsForPage.map(c => c._id);
        
        let userReactionsMap = {};
        if (req.loggedInUser && req.loggedInUser.user) {
            const userId = req.loggedInUser.user._id;
            const userReactions = await CommentReactionModel.find({
                userId: userId,
                commentId: { $in: commentIds }
            }).lean();
            
            userReactions.forEach(reaction => {
                userReactionsMap[reaction.commentId.toString()] = reaction.type;
            });
        }

        const allCommentsWithReactions = allCommentsForPage.map(comment => {
            return {
                ...comment,
                userReaction: userReactionsMap[comment._id.toString()] || null
            }
        });

        const commentTree = buildCommentTree(allCommentsWithReactions);

        const totalRootComments = await CommentModel.countDocuments({ video: videoId, parentComment: null });
        const totalComments = await CommentModel.countDocuments({ video: videoId });
        const hasNextPage = skip + rootComments.length < totalRootComments;
        const nextPage = hasNextPage ? page + 1 : null;

        return res.status(200).json({
            comments: commentTree, 
            commentsCount: totalComments,
            nextPage
        });
}


export const deleteComment = async(req , res)=>{

    const {commentId} = req.params
    const {user} = req.loggedInUser

    const comment = await CommentModel.findById(commentId)
    if(!comment) return res.status(404).json({message:"Comment Not Found"})

    if(comment.owner.toString() !== user._id.toString()) return res.status(403).json({message:"You can only delete your own comments"}) 

   const deletedComment = await CommentModel.findByIdAndDelete(commentId) 
   
   await CommentModel.deleteMany({ parentComment: commentId })

   if(!deletedComment) return res.status(500).json({message:"Failed to Delete comment"})

   return res.status(200).json({message:"Comment Deleted Successfully"})
}


export const updateComment = async(req , res)=>{
    const {user} = req.loggedInUser
    const {commentId} = req.params
    const {content} = req.body

    if (!content || !content.trim()) return res.status(400).json({message: "Comment can not be empty"});
    if (content.length > 2000) return res.status(400).json({message: "Comment is too long"});

    const comment = await CommentModel.findById(commentId)
    if(!comment) return res.status(404).json({message:"Comment Not Found"})
    
    if(comment.owner.toString() !== user._id.toString()) return res.status(403).json({message:"You can only update your own comments"}) 

    const updatedComment = await CommentModel.findByIdAndUpdate(commentId , {
        content
    } , {new:true})

    if(!updatedComment) return res.status(500).json({message:"Failed to update comment"})

    return res.status(200).json({message:"Comment Updated Successfully" , updatedComment})
}


export const reactionToComment = async(req , res)=>{
    const {commentId} = req.params
    const {user} = req.loggedInUser
    const {type} = req.body

    if(!type || (type !== videoReactionType.LIKE && type !== videoReactionType.DISLIKE)) return res.status(400).json({message: "Invalid reaction type"})
    if(!commentId) return res.status(404).json({message: "Comment Not Found"}) 

    const comment = await CommentModel.findById(commentId)
    if(!comment) return res.status(404).json({message: "Comment Not Found"})

    const session = await mongoose.startSession();
    try{
        session.startTransaction();

    const existingReaction = await CommentReactionModel.findOne({
        userId:user._id,
        commentId
    }).session(session)


    let message;
    let requireNotification = false

    if(existingReaction){
        if(existingReaction.type === type){
            const removeReaction = await CommentReactionModel.findByIdAndDelete(existingReaction._id , {session})
            if(!removeReaction) throw new Error("Failed to remove reaction")
            
            const updateReactionCount = await CommentModel.findByIdAndUpdate(commentId , {$inc:{[`${type}s`]:-1}} , {session}) 
            if(!updateReactionCount) throw new Error("Failed to update reaction count")

            // return res.status(200).json({message:"Reaction removed successfully"})
            message = 'Reaction removed successfully';
        }else{
            const updatedReaction = await CommentReactionModel.findByIdAndUpdate(existingReaction._id ,{
                type
            } , {new:true , session})
            if(!updatedReaction) throw new Error("Failed to update reaction")

            const updateCount  = await CommentModel.findByIdAndUpdate(
                commentId, 
                {

                    $inc : {
                        [`${type}s`]:1,
                        [`${existingReaction.type}s`]:-1
                    }
                } , 
                {new:true , session}
            )
            if(!updateCount) throw new Error("Failed to update reaction count")
            if(type === "like" && comment.owner.toString() !== user._id.toString()){
                requireNotification = true
            }
            // return res.status(200).json({message:"Reaction updated successfully"})
            message = 'Reaction updated successfully';
        }
    } else {
        const newReaction = await CommentReactionModel.create([{
            userId:user._id,
            commentId,
            type
        }], {session})  
        if(!newReaction) throw new Error("Failed to create reaction")

        const updateCount = await CommentModel.findByIdAndUpdate(commentId , {$inc:{[`${type}s`]:1}} , {session}) 
        if(!updateCount) throw new Error("Failed to update reaction count")
        if(type === "like" && comment.owner.toString() !== user._id.toString()){
            requireNotification = true
        }
        message = 'Reaction added successfully';
    }

        if(requireNotification){
                sendNotification(comment.owner , {
                    message:`${user.uniqueChannelName} liked your comment`,
                    type:"like",
                    sender:user._id,
                    comment:commentId,
                    video:comment.video
                })
                await NotificationModel.create([{
                    recipient:comment.owner,
                    sender:user._id,
                    type:"like",
                    comment:commentId,
                    video:comment.video
                }] , {session})
            }
    // return res.status(200).json({message:"Reaction added successfully"})
    await session.commitTransaction();

    return res.status(200).json({message})

    }
    catch(err){
        await session.abortTransaction();
        console.log(err);
        
        return res.status(500).json({message:"Internal Server Error"});
    }
    finally{
        await session.endSession();
    }
     
}