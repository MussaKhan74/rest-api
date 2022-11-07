import { APP_PORT } from "./config";
import express from "express";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import dbConnect from "./config/dbConnect";
import path from "path";

const app = express();

// DATABASE CONNECTION
dbConnect();

// GLOBAL
global.appRoot = path.resolve(__dirname);
// URL ENCODED
app.use(express.urlencoded({ extended: false }));
// JSON PARSER
app.use(express.json());
// API ROUTES
app.use("/api", routes);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);
// SERVE A FILE
app.use("/uploads", express.static("uploads"));

// SERVER RUNNING
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));
