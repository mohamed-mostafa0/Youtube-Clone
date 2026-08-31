import mongoose from "mongoose";



const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    },
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default:null
    }
    
},{
    timestamps:true
})

export const CommentModel = mongoose.model("Comment" , commentSchema)

