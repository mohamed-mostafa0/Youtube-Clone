import API from "../axios"



export const getVideos = ({ pageParam = 1, search = '' } = {}) => {
    let url = `/video/get-videos?page=${pageParam}&limit=12`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return API.get(url);
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

export const addView = (videoId) => {
    return API.put(`/video/${videoId}/view`);
};

export const deleteVideo = (videoId) => {
    return API.delete(`/video/${videoId}`);
};