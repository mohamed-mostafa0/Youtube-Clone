import mongoose from "mongoose";




const subscribtionsSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},
{timestamps:true}
)

subscribtionsSchema.index(
    {
        subscriber:1,
        channel:1
    },
    {
        unique:true
    }
)


export const SubscriptionModel = mongoose.model("Subscription",subscribtionsSchema)