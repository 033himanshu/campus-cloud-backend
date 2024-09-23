import dotenv  from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
dotenv.config()


connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Error : ",error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log("Server Listen on port ", process.env.PORT || 8000)
    })
})
.catch((error)=>{
    console.log("MONGO DB Connection failed!!!", error)
})

