import express from "express";
import userController from "../controller/userController.js";

export const publicApi = express.Router();

publicApi.post('/users/register', userController.registerUser);
publicApi.post('/users/login', userController.loginUser);
