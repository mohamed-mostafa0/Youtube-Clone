import API from "../axios";

export const getLikedVideos = async () => {
    return API.get("/user/liked-videos");
};

export const getSubscribedVideos = async () => {
    return API.get("/user/subscribed-videos");
};

export const getHistory = async () => {
    return API.get("/user/history");
};

export const deleteHistory = async () => {
    return API.delete("/user/delete-history");
};

export const deleteVideoFromHistory = async (videoId) => {
    return API.delete(`/user/delete-from-history/${videoId}`);
};

export const getNotifications = async (page = 1, limit = 20) => {
    return API.get(`/user/notifications?page=${page}&limit=${limit}`);
};

export const markNotificationAsRead = async (notificationId) => {
    return API.patch(`/user/notifications/${notificationId}/read`);
};
