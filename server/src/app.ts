import express from "express";
import path from "path";
import http from "http";
import handleAllErrors from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import routes from "./routes";
import cors from "cors";
import { Server } from "socket.io";
import Websocket from "./websocket";

export default class App {
  public app: express.Application;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.middleware();
    this.router();
    this.server = http.createServer(this.app);
    this.websocket();
    this.fallback();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    /* this.app.use(cors()); */
    this.app.use("/", express.static("./client/dist"));
  }

  private router(): void {
    this.app.use("/", routes);
    this.app.use(handleAllErrors);
  }

  private fallback(): void {
    this.app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../../client", "index.html"));
    });
  }

  private websocket(): void {
    const io = new Server(this.server);
    const websocket = Websocket.getIstance();
    websocket.setIO(io);
    websocket.initialize();
  }
}
