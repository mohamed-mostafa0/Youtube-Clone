import { CommentModel, VideoModel } from "../../../DB/Models/index.js"
import { videoVisibility } from "../../../Common/index.js"



export const addComment = async(req, res) => {
        const {videoId} = req.params;
        const {user} = req.loggedInUser; 
        const {content , parentCommentId} = req.body;

        if (!content || !content.trim()) return res.status(400).json({message: "Comment can not be empty"});

        if (content.length > 2000) return res.status(400).json({message: "Comment is too long"});

        const video = await VideoModel.findById(videoId);
        if (!video) return res.status(404).json({message: "Video Not Found"});

        if(video.visibility === videoVisibility.PRIVATE) return res.status(403).json({message:"You can not access this video"})

        if(video.commentsAllow == false) return res.status(403).json({message:"Comments are disabled for this video"})
        

        const comment = await CommentModel.create({
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
        const commentTree = buildCommentTree(allCommentsForPage);

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
    
}