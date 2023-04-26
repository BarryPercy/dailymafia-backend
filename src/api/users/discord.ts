import Express from "express"
import createError from "http-errors"
import UsersModel from "./model"
import { adminOnlyMiddleware } from "../../lib/auth/admin"
import { createAccessToken } from "../../lib/auth/tools"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import createHttpError from "http-errors";
import axios from "axios"

const discordRouter = Express.Router()
  
discordRouter.get("/login", async (req, res, next) => {
  try{
    const url='https://discord.com/api/oauth2/authorize?client_id=1100363577648484373&redirect_uri=http%3A%2F%2Fapi.dailymafia.org%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20gdm.join'
    res.redirect(url)
  }catch(error){
    next(error)
  }
})

discordRouter.get("/callback", async (req,res,next)=>{
  try{
    if(!req.query.code){
      next(
        createHttpError(404, `Query code not found!`)
      )
    }
    console.log("req.query",req.query)
    const {code} = req.query
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code as string,
      redirect_uri: process.env.DISCORD_REDIRECT_URI
    })
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Encoding': 'application/x-www-form-urlencoded'
    }
    console.log("code, Params and headers", code, params, headers)
    const response = await axios.post('https://discord.com/api/oauth2/token',params,{headers})
    const userResponse = await axios.get('https://discord.com/api/users/@me',{
      headers:{
        Authorization:`Bearer ${response.data.access_token}`,
      }      
    })
    const {id, username, avatar} = userResponse.data;
    let user = await UsersModel.findOne({ id });
    if(user){
      await UsersModel.findOneAndUpdate({discordId:id},{userName:username, avatar:avatar})
    }else{
      user = new UsersModel({ discordId:id, userName:username, avatar:avatar, role:"SuperAdmin" });
      await user.save();
    }
    const token = await createAccessToken({
      discordId: user.discordId,
      userName:user.userName,
      avatar:user.avatar,
      role:user.role
    })
    res.cookie('token',token)
    res.redirect(process.env.CLIENT_REDIRECT_URL)
  }catch(error){
    next(error)
  }
})

export default discordRouter