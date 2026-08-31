import API from "../axios";

export const getCommentsByVideo = async (videoId) => {
    return await API.get(`/comment/${videoId}`);
};

export const addComment = async (data) => {
    const { videoId, content, parentCommentId } = data;
    return await API.post(`/comment/${videoId}`, { content, parentCommentId });
};

export const updateComment = async (data) => {
    const { commentId, content } = data;
    return await API.put(`/comment/${commentId}`, { content });
};

export const deleteComment = async (commentId) => {
    return await API.delete(`/comment/${commentId}`);
};
