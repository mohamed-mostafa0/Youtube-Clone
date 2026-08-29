import {Router} from "express"
import * as videoServices from './Services/video.service.js'
import { authenticationMiddleware, upload, validationMiddleware } from "../../Middlewares/index.js"
import { videoSchema } from "../../Validators/video.validator.js"

export const videoController = Router()

// videoController.post("/upload" , upload("videos").single("video") , videoServices.uploadVideo)

// videoController.post("/upload" , upload().single("video") , videoServices.uploadVideo)
videoController.post("/upload", authenticationMiddleware, upload().fields(
    [{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), validationMiddleware(videoSchema), videoServices.uploadVideo)
videoController.get('/get-videos',videoServices.getVideos)
videoController.get('/:videoId' , videoServices.getVideo)
videoController.post('/:videoId/reaction' , authenticationMiddleware , videoServices.reactionToVideo)