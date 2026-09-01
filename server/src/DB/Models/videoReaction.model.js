import mongoose from "mongoose"
import { videoReactionType } from "../../Common/index.js"


const videoReactionSchema = new mongoose.Schema({
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:Object.values(videoReactionType),
        required:true
    }
    
}, {
    timestamps:true
})


videoReactionSchema.index(
    {
        video:1,
        user:1
    },
    {
        unique:true
    }
)

export const VideoReactionModel = mongoose.model("VideoReaction" , videoReactionSchema)
