import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/errorHandler.js";
import { publicApi } from "../routes/publicRoutes.js";

export const web = express();
web.use(cors());
web.use(express.json());

web.use('/api/', publicApi);

web.use(errorMiddleware);