import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });
}