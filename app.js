import express from "express";
import router from "./routes/productroutes.js";
import http from "http";

const server = express();

server.use(express.json()); //order here matters, you have to use it in JSON first before anything else or it wont work
server.use("/api", router);
server.use(express.static("public"));

const app = http.createServer(server); //we combine express & http so we can use http .close() in test.js

export default app;