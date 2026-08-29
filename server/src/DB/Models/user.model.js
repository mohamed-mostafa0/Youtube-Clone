import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    channelName:{
        type:String,
        required:true,
    },
    uniqueChannelName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:null
    },
    logoUrl:{
        type:String,
    },
    logoId:{
        type:String,
        default:null
    },
    subscribers:{
        type:Number,
        default:0
    },
    // subscribedChannels:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:'Users'
    //     }
    // ]
    channelCover:{
        type:String,
        default:null
    },
    channelCoverId:{
        type:String,
        default:null
    }
    
},{
    timestamps:true
})

userSchema.index({
    uniqueChannelName:1
},{
    unique:true
})

export const userModel = mongoose.model("User" , userSchema)