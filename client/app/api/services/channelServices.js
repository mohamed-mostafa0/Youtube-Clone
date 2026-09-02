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

export const toggleSubscribe = async({channelId})=>{
    return API.post(`/user/toggle-subscribe/${channelId}`)
}

export const updateChannel = async(formData)=>{
    return API.put("/user/update-channel", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}