import Express from "express"
import createError from "http-errors"
import UsersModel from "./model"
import { adminOnlyMiddleware } from "../../lib/auth/admin"
import { createAccessToken } from "../../lib/auth/tools"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import createHttpError from "http-errors";
import axios from "axios"

const usersRouter = Express.Router()

usersRouter.post("/register", async (req, res, next) => {
    // try {
    //     const newUser = new UsersModel(req.body)
    //     const { _id } = await newUser.save()
    //     res.status(201).send({ _id })
    //   } catch (error) {
    //     next(error)
    //   }
})
  
usersRouter.get("/login", async (req, res, next) => {
  try{
    const url='https://discord.com/api/oauth2/authorize?client_id=1100363577648484373&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20guilds%20gdm.join'
    res.redirect(url)
  }catch(error){
    next(error)
  }
})

usersRouter.get("/callback", async (req,res,next)=>{
  try{
    if(!req.query.code){
      next(
        createHttpError(404, `Query code not found!`)
      )
    }
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
    const response = await axios.post('https://discord.com/api/oauth2/token',params,{headers})
    const userResponse = await axios.get('https://discord.com/api/users/@me',{
      headers:{
        Authorization:`Bearer ${response.data.access_token}`
      }      
    })
    console.log("user data-------------->",userResponse.data)
  }catch(error){
    next(error)
  }
})

export default usersRouter

   // try {
    //     const { userName, password } = req.body
    //     const user = await UsersModel.checkCredentials(userName, password)
    //     if (user) {
    //         const payload = { discordId: user.discordId, userName: user.userName, avatar: user.avatar, role: user.role }
    //         const accessToken = await createAccessToken(payload)
    //         console.log(accessToken)
    //         res.send({ accessToken })
    //     } else {
    //         next(createError(401, "Credentials are not ok!"))
    //     }
    // } catch (error) {
    //     next(error)
    // }