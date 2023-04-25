import Express from "express" 
import listEndpoints from "express-list-endpoints"
import cors from 'cors'
import usersRouter from "./api/users/index";
import mongoose from "mongoose"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notFoundHandler } from "./errorsHandlers"
import 'dotenv/config';

const server = Express()
const port = process.env.PORT
server.use(Express.json())
server.use(cors())
server.use("/auth/discord/", usersRouter)
server.use(badRequestHandler)
server.use(unauthorizedHandler) 
server.use(notFoundHandler) 
server.use(genericErrorHandler)
server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is running on port ${port}`)
})