import API from "../axios";



export const getUserChannel = async()=>{
    return API.get("/user/my-channel")
}

export const getSubscribedChannels = async()=>{
    return API.get("/user/subscribed-channels")
}

export const updateChannel = async(formData)=>{
    return API.put("/user/update-channel", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}