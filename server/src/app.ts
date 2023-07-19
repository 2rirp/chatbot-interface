import express from "express";
import http from "http";
import handleAllErrors from "./middlewares/error-handler";
import cookieParser from "cookie-parser";
import routes from "./routes";
// import { Server } from "socket.io";

export default class App {
  public app: express.Application;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.middleware();
    this.router();
    this.server = http.createServer(this.app);
    // this.websocket();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use("/", express.static("./client/dist"));
  }

  private router(): void {
    this.app.use("/", routes);
    this.app.use(handleAllErrors);
  }

  // private websocket(): void {
  // 	const io = new Server(this.server);
  // 	const websocketController = new WebsocketController(io);
  // 	websocketController.initialize();
  // }
}
