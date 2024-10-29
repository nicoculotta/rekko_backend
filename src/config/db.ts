import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

export const connectDB = async () => {
  const { DATABASE_URL } = process.env;
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const conection = await mongoose.connect(DATABASE_URL);
    const url = `${conection.connection.host}:${conection.connection.port}`;
    console.log(colors.green.bold(`Connected to MongoDB at ${url}`));
  } catch (err) {
    console.error(colors.red.bold(`Error connecting to MongoDB`));
    exit(1);
  }
};
