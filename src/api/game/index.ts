import Express, {Request} from "express"
import { shuffle } from "lodash";
import createError from "http-errors"
import UsersModel from "./model"
import { adminOnlyMiddleware, superAdminOnlyMiddleware } from "../../lib/auth/admin"
import { JWTAuthMiddleware } from "../../lib/auth/jwt"
import createHttpError from "http-errors";
import axios from "axios"
import { TokenPayload } from "../../lib/auth/tools"
import ActiveGameModel from "./model"
const activeGameRouter = Express.Router()

activeGameRouter.post("/rand",JWTAuthMiddleware,async(req,res,next)=>{
    try {
        const userIds = req.body.userIds; // array of user ids
        const shuffledUserIds = shuffle(userIds); // randomize the order of user ids
        const mafia = shuffledUserIds.slice(0, 3); // first 3 are mafia
        const vigilante = shuffledUserIds[3]; // 4th is vigilante
        const nerfedMedic = shuffledUserIds[4]; // 5th is nerfed medic
        const vanillaTown = shuffledUserIds.slice(5); // rest are vanilla town
        const activeGame = new ActiveGameModel({
            mafia: mafia,
            vigilante: vigilante,
            nerfedMedic: nerfedMedic,
            vanillaTown: vanillaTown,
        });
        await activeGame.save();
        } catch (error) {
            next(error)
        }
        
})

export default activeGameRouter