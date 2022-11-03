import { APP_PORT, DB_URL } from "./config";
import express from "express";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import dbConnect from "./config/dbConnect";

const app = express();

// DATABASE CONNECTION
dbConnect();

// JSON PARSER
app.use(express.json());
// API ROUTES
app.use("/api", routes);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandler);

// SERVER RUNNING
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`));
