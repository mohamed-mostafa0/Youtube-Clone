import API from "../axios";

export const getLikedVideos = async () => {
    return API.get("/user/liked-videos");
};
