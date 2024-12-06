import mongoose from "mongoose";
import app from "./app.js";
import mongoKey from "./config.js"

const PORT = 3000;


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