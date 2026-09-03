import {Router} from 'express'
import * as userServices from '../Services/user.service.js'
import { authenticationMiddleware, upload } from '../../../Middlewares/index.js'


export const userController = Router()

userController.post("/toggle-subscribe/:channelId" , authenticationMiddleware , userServices.toggleSubscribe)
userController.get("/subscribed-channels" , authenticationMiddleware , userServices.getSubscribedChannelsForUser)
userController.get("/my-channel" , authenticationMiddleware , userServices.getMyChannel)
userController.put("/update-channel" , authenticationMiddleware,upload().fields([
    {name:"logoUrl" , maxCount:1},
    {name:"channelCover" , maxCount:1}
]) , userServices.updateChannel)
userController.get("/liked-videos" , authenticationMiddleware , userServices.getLikedVideos)
userController.get("/subscribed-videos" , authenticationMiddleware , userServices.getSubscribedChannelsVideos)






