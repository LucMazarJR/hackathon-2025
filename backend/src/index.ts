import path from "path";
import { connectServer } from "./utils/logger.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT);

connectServer(PORT);