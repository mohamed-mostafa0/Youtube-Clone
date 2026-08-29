import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true 
});


API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth/refresh-token") {
            originalRequest._retry = true; 

            try {
                await API.post("/auth/refresh-token");

                return API(originalRequest);
            } catch (refreshError) {
                console.log("Session expired, user needs to login again.");
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default API;