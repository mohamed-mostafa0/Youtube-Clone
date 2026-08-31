import Joi from "joi";
import { videoCategories, videoVisibility } from "../Common/index.js";


export const videoSchema = {
    body:Joi.object({
        title:Joi.string().required().max(100).min(5),
        description:Joi.string().required(),
        visibility:Joi.string().required().valid(...Object.values(videoVisibility)),
        category:Joi.string().required().valid(...Object.values(videoCategories)),
        commentsAllow:Joi.boolean()
    })
}