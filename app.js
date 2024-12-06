import express from "express";
import router from "./routes/productroutes.js";

const server = express();

server.use(express.json()); //order here matters, you have to use it in JSON first before anything else or it wont work
server.use("/api", router);
server.use(express.static("public"));

export default server;