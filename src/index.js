import connectDB from "./db/index.js";
import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(`App is not Listing: ${err}`);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server stated at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`MongoDB connection failed ${err}`);
  });

/*
import express from "express";

const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB}/${APP_NAME}`);
    app.on("error", (error) => {
      console.log(error);
      throw error;
    });

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.log("ERROR: ", error);
    throw error;
  }
})();
*/
