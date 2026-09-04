import mongoose from "mongoose";



const notificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String,
        enum:['like','comment','subscribe','upload'],
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    },
    message:{
        type:String,
    }


},{timestamps:true}) 


export const NotificationModel = mongoose.model('Notification',notificationSchema)