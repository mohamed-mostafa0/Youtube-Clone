import { OAuth2Client } from "google-auth-library";
import { userModel, BlacklistedTokenModel } from "../../../DB/Models/index.js";
import { generateToken, verifyToken } from "../../../Utils/index.js";
import { generateUniqueChannelName } from "../../../Utils/generateUniqueChannelName.utils.js";
import { v4 as uuidv4 } from 'uuid';



export const googleLogin = async(req , res)=>{
    const {token} = req.body
    const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  const { email, email_verified, name, picture, sub } = payload;
  if(!email_verified){
    return res.status(400).json({message:"Google email is not verified"})
  }
  console.log(payload);
  

  let user = await userModel.findOne({googleId:sub})
  if(!user) {
    const uniqueChannelName = await generateUniqueChannelName(name);
    user = await userModel.create({
        channelName:name,
        email,
        googleId:sub,
        logoUrl:picture,
        uniqueChannelName
    })
  }

  const accessTokenId = uuidv4()
  const refreshTokenId = uuidv4()
  const accessToken = generateToken(
    {_id:user._id , email } , process.env.ACCESS_TOKEN_SECRET ,
     {expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid:accessTokenId})
  const refreshToken = generateToken(
    {_id:user._id , email } , process.env.REFRESH_TOKEN_SECRET ,
     {expiresIn:process.env.REFRESH_TOKEN_EXPIRATION_TIME , jwtid:refreshTokenId})

    res.cookie("accessToken" ,accessToken , {
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge: 30 * 60 * 1000 
    })
    res.cookie("refreshToken" ,refreshToken , {
        httpOnly:true,
        secure:false,
        sameSite:"strict",
        maxAge:60*60*24*30
    })

    return res.status(200).json({message:"logged in" })
      
}


export const refreshToken = async (req , res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json({message:"Refresh token is required"})

    try{
    const decodedRefreshToken = verifyToken(refreshToken , process.env.REFRESH_TOKEN_SECRET)
    const accessTokenId = uuidv4()
    const accessToken = generateToken(
        {_id:decodedRefreshToken._id , email:decodedRefreshToken.email} , 
        process.env.ACCESS_TOKEN_SECRET , 
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRATION_TIME , jwtid:accessTokenId})

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false, 
        sameSite: "strict",
        maxAge: 30 * 60 * 1000 
    });
    
    return res.status(200).json({message:"token refreshed successfully"})
        }
        catch(error){
            console.log(error)
            return res.status(401).json({message:"Invalid or expired refresh token , Please log in again"})
        }

}


export const logout = async (req , res)=>{

    const {tokenId , expiresAt} = req.loggedInUser.token

    await BlacklistedTokenModel.create({
        tokenId,
        expiresAt: new Date(expiresAt * 1000)
    })
    
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken) {
        try {
            const decodedRefresh = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await BlacklistedTokenModel.create({ 
                tokenId: decodedRefresh.tokenId, 
                expiresAt: new Date(decodedRefresh.exp * 1000) 
            });
        } catch(e) {}
    }
    
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    return res.status(200).json({message:"logged out successfully"})
}


export const getusers = async(req , res)=>{
    const users = await userModel.find()
    return res.status(200).json({users})
}

export const getMe = async(req, res)=>{
    return res.status(200).json({ user: req.loggedInUser.user })
}