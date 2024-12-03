import express from "express";
import router from "./routes/productroutes.js";

const app = express();

app.use(express.json()); //order here matters, you have to use it in JSON first before anything else or it wont work
app.use("/api", router);
app.use(express.static("public"));

export default app;