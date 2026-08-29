import mongoose from "mongoose";


const blacklistedTokenSchema = new mongoose.Schema({
    tokenId:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
})

export const BlacklistedTokenModel = mongoose.model("BlacklistedToken" , blacklistedTokenSchema)