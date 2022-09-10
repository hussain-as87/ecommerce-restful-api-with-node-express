import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { db_connection } from "./config/database.js";
import {  router } from "./routes/api.js";
import { ApiError } from "./utils/apiError.js";
import { globalError } from "./middlewares/errorMiddleware.js";
dotenv.config({ path: "config.env" });
const port = process.env.PORT || 3000;
const app = express();
db_connection();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/v1", router);

app.all("*", (req, res, next) => {
  // create error and send to error handling middleware
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400));
});
// global error handling middleware with Express
app.use(globalError);

const server = app.listen(port, () => {
  console.clear();
  console.log(`server start at port ${port}`);
});

// event => listen =>callpack(error) with Node
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`shutting down....`);
    process.exit(1);
  });
});
