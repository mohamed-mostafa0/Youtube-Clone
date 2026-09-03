import mongoose from "mongoose";

const videoViewSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    ipAddress: {
        type: String,
        default: null
    }
}, { timestamps: true });

export const VideoViewModel = mongoose.model("VideoView", videoViewSchema);
