import express from "express";
import dotenv from "dotenv";
import DatabaseConnect from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import todoRouter from "./routes/todoRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { limitter } from "./utilities/rateLimit.js";

import { createClient } from "redis";

export const client = createClient({
  username: "default",
  password: "Cx7TzDJSr5sIjX6wweqdAjMiLQVtDCOo",
  socket: {
    host: "redis-11516.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 11516,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(limitter); // Express limiter secure middleware

DatabaseConnect();

// API Route
app.use("/api/user/", userRouter);
app.use("/api/todo/", todoRouter);
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server test / route running successfully",
    data: [
      {
        id: 1,
        name: "User 1",
        age: 23,
        mobile_no: "**********",
        country_code: "+91",
      },
      {
        id: 2,
        name: "User 2",
        age: 21,
        mobile_no: "********",
        country_code: "+8",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server run on ${PORT}`);
});
