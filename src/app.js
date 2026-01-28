import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//yeh sare configure hote hai app ban ne k baad!

const app = express();

//configuration

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true,
}))

// data in backend comes from many places: some will send from url some will send in json format...,

//for that we need settings and some best practises

//you can configure json with express : that i am accepting json

//option of limit as per your server like 16kb here,,
app.use(express.json({limit : "16kb"}))
//extended bole toh : object within object, nested objects
app.use(express.urlencoded({extended:true, limit : "16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'




//routes declaration
//now you can write the routers, (router, you want to activate)
app.use("/api/v1/users", userRouter)
//standard practise : define your api/version



// http://localhost:8000/api/v1/users/register
//method call thats how url gets created..
export default app;
