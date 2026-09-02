import API from "../axios"



export const getVideos = ({ pageParam = 1 } = {}) => {
    return API.get(`/video/get-videos?page=${pageParam}&limit=12`)
}

export const uploadVideo = async (formData) => {
    
    return API.post("/video/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getVideoById = (videoId) => {
    return API.get(`/video/${videoId}`);
};

export const reactToVideo = ({videoId, type}) => {
    return API.post(`/video/${videoId}/react`, { type });
};