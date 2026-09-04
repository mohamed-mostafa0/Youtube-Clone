import { Server } from "socket.io";
import { verifyToken } from "./token.utils.js";
import { BlacklistedTokenModel, userModel } from "../DB/Models/index.js";
import cookieParser from "cookie-parser";

let io;

export const initIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });
    

    io.engine.use(cookieParser());

    io.use(async (socket, next) => {
        try {

            const accessToken = socket.request.cookies.accessToken;
            console.log("ACCESS TOKEN: " + accessToken);
            
            if (!accessToken) {
                return next(new Error("Authentication error: No access token"));
            }

            const decodedToken = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if (!decodedToken) {
                return next(new Error("Authentication error: Invalid token"));
            }

            const checkBlaklistedToken = await BlacklistedTokenModel.findOne({ tokenId: decodedToken.jti });
            if (checkBlaklistedToken) {
                return next(new Error("Authentication error: Session ended"));
            }

            const user = await userModel.findById(decodedToken._id);
            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error);
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] User connected: ${socket.user.channelName} (${socket.id})`);
        
        socket.join(socket.user._id.toString());

        socket.on("disconnect", () => {
            console.log(`[Socket] User disconnected: ${socket.user.channelName} (${socket.id})`);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
