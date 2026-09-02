import {Router} from 'express'
import * as channelServices from './Services/channel.service.js'
import { authenticationMiddleware, optionalAuthenticationMiddleware } from '../../Middlewares/index.js'

export const channelController = Router()


channelController.get('/:channelName' , optionalAuthenticationMiddleware , channelServices.getChannel)
channelController.get('/is-subscribed/:channelName' , authenticationMiddleware , channelServices.isSubscribed)