import {Router} from 'express'
import * as channelServices from './Services/channel.service.js'
import { authenticationMiddleware } from '../../Middlewares/index.js'

export const channelController = Router()


channelController.get('/:channelName' , channelServices.getChannel)
channelController.get('/is-subscribed/:channelName' , authenticationMiddleware , channelServices.isSubscribed)