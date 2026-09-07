import { SetupApplication } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

class Server {
  static start(): void {
    const application = new SetupApplication(PORT);
    application.init();
    application.start();
  }
}

Server.start();
