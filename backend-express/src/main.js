import { logger } from "./app/logging.js";
import dotenv from "dotenv";
import { server } from "./app/socket.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});