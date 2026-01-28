import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./db/index.js";

console.log("MONGO URI:", process.env.MONGODB_URI);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });


// import dotenv from "dotenv";
// dotenv.config();   // ✅ NO path
// console.log("MONGO URI:", process.env.MONGODB_URI);


// import connectDB from "./db/index.js";

// connectDB();


// .then(() => { //give 8000 as default port if port is not found, or server par jo port hai vo use karlo, server pe jab aap production par code dalenge vaha pr apka code crash hone se bachayega!
    
//     app.listen(process.env.PORT || 8000, () => {
//         console.log(` Server is running at port : ${process.env.PORT}`);
//     })
// })
// .catch((err) => { //incase db connection fails
//     console.log("MONGO db connection failed !!! ", err);
// })










// /*
// import express from "express"
// const app = express()
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror", (error) => {
//             console.log("ERRR: ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })

//     } catch (error) {
//         console.error("ERROR: ", error)
//         throw err
//     }
// })()

// */