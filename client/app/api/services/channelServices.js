import API from "../axios";



export const getUserChannel = async()=>{
    return API.get("/user/my-channel")
}

export const getChannelByName = async(channelName)=>{
    return API.get(`/${channelName}`)
}

export const getSubscribedChannels = async()=>{
    return API.get("/user/subscribed-channels")
}

export const isSubscribed = async(channelName)=>{
    return API.get(`/channel/is-subscribed/${channelName}`)
}

export const updateChannel = async(formData)=>{
    return API.put("/user/update-channel", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}