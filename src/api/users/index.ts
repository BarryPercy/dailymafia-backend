import Express, {Request} from "express"
import createError from "http-errors"
import UsersModel from "./model"
import { adminOnlyMiddleware, superAdminOnlyMiddleware } from "../../lib/auth/admin"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import createHttpError from "http-errors";
import axios from "axios"
import { TokenPayload } from "../../lib/auth/tools"
const usersRouter = Express.Router()

interface userRequest extends Request{
    user?:TokenPayload
}

usersRouter.get("/me", JWTAuthMiddleware, async (req:userRequest, res, next) => {
    try {
      const user = await UsersModel.findOne({discordId:req.user.discordId});
      if (user) {
        res.send(user);
      } else {
        res.send(createHttpError(404, "Couldn't find user"));
      }
    } catch (error) {
      next(error);
    }
});

usersRouter.post('/logout', (req,res,next)=>{
    res.clearCookie('token');
    res.status(200).send('Logout Successful')
})

export default usersRouter