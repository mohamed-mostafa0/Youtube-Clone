import { SubscriptionModel, userModel, VideoModel } from "../../../DB/Models/index.js"

export const getChannel = async(req , res)=>{
    const{channelName} = req.params

    const channel = await userModel.findOne({uniqueChannelName:channelName})
    if(!channel) return res.status(404).json({message:"Channel not found"})

    const videos = await VideoModel.find({owner: channel._id})

    return res.status(200).json({message:"Channel fetched successfully" , channel, videos})
}



export const isSubscribed = async (req , res)=>{
    
    const {user} = req.loggedInUser
    const {channelName} = req.params

    const channel = await userModel.findOne({uniqueChannelName:channelName})
    if(!channel) return res.status(404).json({message:"Channel not found"})

    const isSubscribed = await SubscriptionModel.findOne({channel:channel._id , subscriber:user._id})
    if(!isSubscribed) return res.status(200).json({message:"Subscribe"})

    return res.status(200).json({message:"Unsubscribe"})

    
}