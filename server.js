import mongoose from "mongoose";
import app from "./app.js";

const PORT = 3000;

import dotenv from "dotenv";
dotenv.config();
export const mongoKey =  process.env.NODE_ENV === "test" 
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI;

async function start() {
    try {
        await mongoose.connect(mongoKey);
        app.listen(PORT, function() {
        console.log("Server started on https://localhost:3000", " & connected to mongodb");
        }); 
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();