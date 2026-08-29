import {Router} from 'express'
import * as authServices from '../Services/auth.service.js'
import { authenticationMiddleware } from '../../../Middlewares/authentication.middleware.js'

export const authController = Router()


authController.post("/google" , authServices.googleLogin)
authController.post("/refresh-token" , authServices.refreshToken)
authController.get("/users" , authenticationMiddleware , authServices.getusers)
authController.get("/me", authenticationMiddleware, authServices.getMe)
authController.post("/logout", authenticationMiddleware, authServices.logout)

