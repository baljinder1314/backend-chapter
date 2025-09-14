import mongoose from "mongoose";

import { APP_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectingString = await mongoose.connect(
      `${process.env.MONGO_DB}/${APP_NAME}`
    );
    console.log(`Connecting String: ${connectingString.connection.host}`);
  } catch (error) {
    console.log(`MongoDB didn't connect ${error}`);
  }
};
export default connectDB;
/*
const connectDB = async () => {
  try {
    const connectionString = await mongoose.connect(
      `${process.env.MONGO_DB}/${APP_NAME}`
    );
    console.log(`Mongoose connected Successfuly ${connectionString.Connection.host}`)
  } catch (error) {
    console.log(`MongoDB didn't connet: ${error}`);
  }
};

export default connectDB*/
