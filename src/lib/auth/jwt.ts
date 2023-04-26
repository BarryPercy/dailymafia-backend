import createHttpError from "http-errors";
import { RequestHandler, Request } from "express";
import { verifyAccessToken, TokenPayload } from "./tools";

export interface UserRequest extends Request {
  cookie:string
  user?: TokenPayload;
}

export const JWTAuthMiddleware: RequestHandler = async (req: UserRequest, res, next) => {
    if(!req.cookies.token){
      next(createHttpError(401,"User has no access token and must log in"))
    }
    const accessToken = req.cookies.token
    try {
      const payload = await verifyAccessToken(accessToken);

      req.user = {
        discordId: payload.discordId,
        userName: payload.userName,
        avatar: payload.avatar,
        role: payload.role,
      };
      console.log("this is req user", req.user)
      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid! Please log in again!"));
    }
};
