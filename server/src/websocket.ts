import { Server, Socket } from "socket.io";
import IConnection from "./interfaces/connection";

export default class Websocket {
  private static instance: Websocket;
  private io: Server | null = null;
  private connections: Array<IConnection> = [];

  private constructor() {}

  public static getIstance(): Websocket {
    if (!Websocket.instance) {
      Websocket.instance = new Websocket();
    }
    return Websocket.instance;
  }

  public setIO(io: Server) {
    this.io = io;
  }

  public initialize(): void {
    if (!this.io) return;
    this.io.on("connection", (socket: Socket) => {
      console.log("Client reached the server");
      this.handleEvents(socket);
    });
  }

  private handleEvents(socket: Socket) {
    socket.on("login", (userId: string) => {
      try {
        this.setConnection(socket, userId);
        console.log("Client logged in");
      } catch (error) {
        console.error("Error setting connection: " + error);
      }
    });

    socket.on(
      "enterConversation",
      (botUserId: string, conversationId: string, userId: string) => {
        try {
          this.joinConversationRoom(socket, botUserId, conversationId, userId);
          console.log(
            `Client joined conversation ${conversationId} with botUser ${botUserId}`
          );
        } catch (error) {
          console.error("Error joining conversation room: " + error);
        }
      }
    );

    socket.on(
      "exitConversation",
      (botUserId: string, conversationId: string, userId: string) => {
        try {
          this.leaveConversationRoom(userId);
          console.log(
            `Client left conversation ${conversationId} with botUser ${botUserId}`
          );
        } catch (error) {
          console.error("Error leaving conversation room: " + error);
        }
      }
    );

    socket.on("disconnect", () => {
      this.removeConnection(socket);
      console.log("Client disconnected");
    });
  }

  private setConnection(socket: Socket, userId: string): void {
    this.connections.push({ connection: socket, userId: userId });
  }

  private getConnection(userId: string): IConnection | undefined {
    return this.connections.find((conn) => conn.userId === userId);
  }

  private removeConnection(socket: Socket) {
    const index = this.connections.findIndex(
      (conn) => conn.connection.id === socket.id
    );
    if (index !== -1) this.connections.splice(index, 1);
  }

  private joinConversationRoom(
    socket: Socket,
    botUserId: string,
    conversationId: string,
    userId: string
  ) {
    const connection = this.getConnection(userId);
    if (connection) {
      connection.botUserId = botUserId;
      connection.conversationId = conversationId;
      connection.userId = userId;
    } else {
      this.connections.push({
        connection: socket,
        botUserId,
        conversationId,
        userId,
      });
    }
  }

  private leaveConversationRoom(userId: string) {
    const index = this.connections.findIndex((conn) => conn.userId === userId);
    console.log(
      "before",
      this.connections[index].userId,
      this.connections[index].botUserId
    );
    if (index !== -1) this.connections[index].botUserId = null;
    console.log(
      "after",
      this.connections[index].userId,
      this.connections[index].botUserId
    );
  }
}
