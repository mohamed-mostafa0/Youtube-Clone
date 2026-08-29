import { deleteResourceOnCloudinary, uploadImageOnCloudinary } from "../../../Common/index.js"
import { SubscriptionModel, userModel, VideoModel, CommentModel, VideoReactionModel } from "../../../DB/Models/index.js"
import mongoose from  "mongoose"




export const toggleSubscribe = async (req , res)=>{
    const {user} = req.loggedInUser
    const {channelId} = req.params

    if(!channelId) return res.status(400).json({message:"channelId is required"})
    if(channelId === user._id.toString()) return res.status(400).json({message:"You can't subscribe to yourself"})

    const isSubscribed = await SubscriptionModel.findOne({channel:channelId , subscriber:user._id})
    if(isSubscribed){
        await SubscriptionModel.findByIdAndDelete(isSubscribed._id)
        await userModel.findByIdAndUpdate(channelId , {$inc:{subscribers:-1}})
        return res.status(200).json({message:"Unsubscribed successfully"})
    }
    await SubscriptionModel.create({channel:channelId , subscriber:user._id})
    await userModel.findByIdAndUpdate(channelId , {$inc:{subscribers:1}})
    return res.status(200).json({message:"Subscribed successfully"})
}


export const getSubscribedChannelsForUser = async ( req , res)=>{
    
    const {user} = req.loggedInUser

    const subscriptions = await SubscriptionModel.find({subscriber:user._id})
        .select('channel -_id')
        .populate("channel" , "logoUrl channelName uniqueChannelName")
        
    if(subscriptions.length === 0) return res.status(200).json({message:"No subscribed channels found" , channels:[]})
    
    const subscribedChannels = subscriptions.map(sub => sub.channel);

    return res.status(200).json({message:"Subscribed channels fetched successfully" , channels:subscribedChannels})
}




export const getMyChannel = async(req , res)=>{
    const {user:{_id}} = req.loggedInUser

    const channel = await userModel.findById(_id)
    if(!channel) return res.status(404).json({message:"Channel not found"})

    const videos = await VideoModel.find({ owner: _id }).sort({ createdAt: -1 })

    return res.status(200).json({
        message:"Channel fetched successfully", 
        channel,
        videos 
    })
}



export const deleteChannel = async(req , res)=>{
    const {user:{_id}} = req.loggedInUser
    const session = await mongoose.startSession()

    try{
        session.startTransaction()
        
        const subscriptions = await SubscriptionModel.find({ subscriber: _id }).session(session);
        const channelIds = subscriptions.map(sub => sub.channel);

        if (channelIds.length > 0) {
            await userModel.updateMany(
                { _id: { $in: channelIds } },
                { $inc: { subscribers: -1 } },
                { session }
            );
        }

        await userModel.findByIdAndDelete(_id, { session })
        
        await VideoModel.deleteMany({owner:_id} , {session})
        
        await SubscriptionModel.deleteMany({
            $or: [
                { subscriber: _id },
                { channel: _id }
            ]
        }, {session})
        
        await VideoReactionModel.deleteMany({user:_id} , {session})
        await CommentModel.deleteMany({owner:_id} , {session})

        // await deleteResourceOnCloudinary(user.thumbnailId)

        

        await session.commitTransaction()
        res.status(200).json({ success: true, message: "Channel deleted successfully" })
    }catch(err){
        await session.abortTransaction()
        console.log(err);
        res.status(500).json({ success: false, message: "Server error", error: err.message })
    } finally {
        session.endSession()
    }

}


export const updateChannel = async(req , res)=>{
    const {files} = req || {}
    const {channelName ,  description  , uniqueChannelName  } = req.body

    const {user} = req.loggedInUser

    if(channelName) user.channelName = channelName 
    if(description !== undefined) user.description = description 
    if(uniqueChannelName) user.uniqueChannelName = uniqueChannelName

    if(files?.logoUrl?.[0]){
        if(user.logoId){
            await deleteResourceOnCloudinary(user.logoId , "image")
        }

        const uploadedLogo = await uploadImageOnCloudinary(files.logoUrl[0] , "youtube-clone-logos")
        if(!uploadedLogo) return res.status(500).json({message:"error while uploading logo"})
        
        user.logoUrl = uploadedLogo.secure_url
        user.logoId = uploadedLogo.public_id
    }  

    if(files?.channelCover?.[0]){
        if(user.channelCoverId){
            await deleteResourceOnCloudinary(user.channelCoverId , "image")
        }
        
        const uploadedChannelCover = await uploadImageOnCloudinary(files.channelCover[0] , "youtube-clone-channel-covers")
        if(!uploadedChannelCover) return res.status(500).json({message:"error while uploading channel cover"})
        
        user.channelCover = uploadedChannelCover.secure_url
        user.channelCoverId = uploadedChannelCover.public_id
    }
    
    await user.save()

    return res.status(200).json({message:"Channel updated successfully" , channel:user})
}