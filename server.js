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
//import { webhookCheckout } from "./services/OrderService.js";
import Stripe from "stripe";
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
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Stripe requires the raw body to construct the event
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  } catch (err) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  console.log('✅ Success:', event.id);

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
});
// Stripe requires the raw body to construct the event
//app.post('/webhook', express.raw({type: 'application/json'}),webhookCheckout);
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
