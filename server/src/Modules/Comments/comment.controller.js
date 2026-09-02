import {Router} from 'express'
import * as commentServices from './Services/comment.service.js'
import { authenticationMiddleware, optionalAuthenticationMiddleware } from '../../Middlewares/authentication.middleware.js'

export const commentController = Router()

commentController.post('/:videoId' , authenticationMiddleware , commentServices.addComment)
commentController.get("/:videoId" , optionalAuthenticationMiddleware, commentServices.getCommentsByVideo)
commentController.delete("/:commentId" , authenticationMiddleware , commentServices.deleteComment)
commentController.put("/:commentId" , authenticationMiddleware , commentServices.updateComment)
commentController.post("/:commentId/react" , authenticationMiddleware , commentServices.reactionToComment)