import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import "colors";
import { db_connection } from "./config/database.js";
import { router } from "./routes/_api.js";
import { ApiError } from "./utils/apiError.js";
import { globalError } from "./middlewares/errorMiddleware.js";
import { webhookCheckout } from "./services/OrderService.js";
dotenv.config({ path: "config.env" });
const port = process.env.PORT || 3000;
const app = express();

/**
 * @Middlewares
 */
app.use(compression());
app.use(cors());
app.options("*", cors());
db_connection();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
/**
 * @Routers
 */
app.use("/api/v1", router);
// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);


app.all("*", (req, res, next) => {
  // create error and send to error handling middleware
  next(new ApiError(`can't find this route ${req.originalUrl}`.red, 400));
});

// global error handling middleware with Express
app.use(globalError);

const server = app.listen(port, () => {
  console.clear();
  console.log(`server start at http://localhost:${port}`.black.bgCyan);
});

// event => listen =>callpack(error) with Node
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error ${err.name} | ${err.message}`.red);
  server.close(() => {
    console.log(`shutting down....`.yellow);
    process.exit(1);
  });
});
