import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import "colors";
import {db_connection} from "./config/database.js";
import {router} from "./routes/_api.js";
import {ApiError} from "./utils/apiError.js";
import {globalError} from "./middlewares/errorMiddleware.js";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";


dotenv.config({path: "config.env"});
const port = process.env.PORT || 3000;
const app = express();

/**
 * @Middlewares
 */
app.use(compression());
app.use(cors());
app.options("*", cors());
db_connection();
app.use(express.json({limit: "50kb"}));
app.use(express.static(__dirname + "/public"));

//sanitizes user-supplied data to prevent MongoDB Operator Injection
app.use(mongoSanitize());
app.use(xss());

//middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp({whitelist:['price','sold']}))
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode: ${process.env.NODE_ENV}`);
}
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})

// Apply the rate limiting middleware to all requests
app.use('/api', limiter)
/**
 * @Routers
 */
// Use JSON parser for all non-webhook routes


app.use("/api/v1", router);


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
