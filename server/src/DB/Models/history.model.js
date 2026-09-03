import mongoose from "mongoose";


const historySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
        required:true
    },
    
}, {
    timestamps:true
})

historySchema.index({user:1, video:1}, {unique:true})

export const HistoryModel = mongoose.model("History" , historySchema)