import { BlacklistedTokenModel, userModel } from "../DB/Models/index.js"
import { verifyToken } from "../Utils/index.js"



export const authenticationMiddleware = async(req , res , next)=>{
    const accessToken = req.cookies.accessToken
    if(!accessToken) return res.status(401).json({message:"unauthorized"})
    

    try {
        const decodedToken = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken) return res.status(401).json({message:"invalid token"})
        
        const checkBlaklistedToken = await BlacklistedTokenModel.findOne({tokenId:decodedToken.jti})
        if(checkBlaklistedToken) return res.status(401).json({message:"Session has ended , Please log in again"})

        const user = await userModel.findOne({_id:decodedToken._id})
        if(!user) return res.status(404).json({message:"User not found"})

        req.loggedInUser = {user , token:{tokenId:decodedToken.jti , expiresAt:decodedToken.exp}}
        
        next()
    } catch (error) {
        return res.status(401).json({message: "Invalid or expired access token , please log in again"});
    }
}