import mongoose from "mongoose";
import { videoReactionType } from "../../Common/index.js";




const commentReactionSchema = new mongoose.Schema({
    commentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:[videoReactionType.LIKE , videoReactionType.DISLIKE],
        required:true
    }
} , {
    timestamps:true
})


commentReactionSchema.index(
    {
        commentId:1,
        userId:1
    },
    {
        unique:true
    }
)

export const CommentReactionModel = mongoose.model("CommentReaction" , commentReactionSchema)