import mongoose from "mongoose";
import { videoCategories, videoVisibility } from "../../Common/index.js";



const videoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:100
    },
    description:{
        type:String,
        required:true
    },
    thumbnailUrl:{
        type:String,
    },
    thumbnailId:{
        type:String,
    },
    duration:{
        type:Number,
    },
    videoUrl:{
        type:String,
    },
    videoId:{
        type:String,
    },
    views:{
        type:Number,
        required:true,
        default:0
    },
    visibility:{
        type:String,
        required:true,
        enum:Object.values(videoVisibility)
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    category:{
        type:String,
        enum:Object.values(videoCategories),
        required:true,
    },
    status:{
        type:String,
        enum:["processing" , "published" , "failed"],
        default:"processing"
    },
    likes:{
        type:Number,
        default:0
    },
    dislikes:{
        type:Number,
        default:0
    }
},
{
timestamps:true
})

export const VideoModel = mongoose.model("Video" , videoSchema)