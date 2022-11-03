import mongoose from "mongoose";
import { DB_URL } from ".";

const dbConnect = () => {
  mongoose
    .connect(DB_URL)
    .then(() => console.log(`db connection on ${mongoose.connection.host}`))
    .catch((error) => console.log(error));
};

export default dbConnect;
