/* eslint-disable no-undef */
import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("Database connection established", conn.connection.host);
  } catch (error) {
    console.log("Error while connecting to DB...", error.message);
    process.exit(1);
  }
};

export default connectDB;
