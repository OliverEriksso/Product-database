import express from "express";
import http from "http";
import router from "./routes.js";
 
const server = express();

server.use(express.json()); //order here matters, you have to use it in JSON first before anything else or it wont work
server.use("/api", router);
server.use(express.static("public"));

const httpServer = http.createServer(server); //we need to combo http & express so we can shut it down during testing easier

httpServer.listen(3000, function() {
    console.log("Server started on https://localhost:3000");
});

export default httpServer;