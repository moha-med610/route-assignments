import mongoose from "mongoose";
import cli from "cli-colors";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(cli.bgGreen("Database connected successfully"));
  } catch (error) {
    console.error(cli.bgRed("Database connection failed: ", error));
  }
};
