import Express from "express" 
import listEndpoints from "express-list-endpoints"
import cors from 'cors'
import usersRouter from "./api/users/index";
import mongoose from "mongoose"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorsHandlers"
import 'dotenv/config';
import { verifyAccessToken } from "./lib/auth/tools";
import discordRouter from "./api/users/discord";
import cookieParser from "cookie-parser"

const server = Express()
const port = process.env.PORT
server.use(Express.json())
server.use(cookieParser());
server.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
    }
))
server.use("/auth/discord", discordRouter)
server.use("/users", usersRouter)
server.use(badRequestHandler)
server.use(unauthorizedHandler) 
server.use(notFoundHandler) 
server.use(genericErrorHandler)
mongoose.connect(process.env.MONGO_URL as string);
mongoose.connection.on("connected", () => {
    server.listen(port, () => {
        console.table(listEndpoints(server))
        console.log(`Server is running on port ${port}`)
    })
});