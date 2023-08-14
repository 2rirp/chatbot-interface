import { Server, Socket } from "socket.io";
import IConnection from "./interfaces/connection";
import IMessage from "./interfaces/imessage";

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
    socket.on("login", (userId: number) => {
      try {
        this.setConnection(socket, userId);
        console.log("Client logged in");
      } catch (error) {
        console.error("Error setting connection: " + error);
      }
    });

    socket.on(
      "redirectToAttendant",
      (botUserId: string, conversationId: number) => {
        try {
          this.io?.emit("botUserNeedsAttendant", {
            botUserId,
            conversationId,
          });
        } catch (error) {
          console.error("Error redirecting to attendant " + error);
        }
      }
    );

    socket.on(
      "enterConversation",
      (botUserId: string, conversationId: number, userId: number) => {
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
      (botUserId: string, conversationId: number, userId: number) => {
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

    socket.on(
      "messageToAttendant",
      (conversationId: number, messageContent: string) => {
        try {
          this.broadcastToConversation("newBotUserMessage", conversationId, {
            content: messageContent,
            message_from_bot: false,
          });
        } catch (error) {
          console.error("Error receiving new message: " + error);
        }
      }
    );

    socket.on("disconnect", () => {
      this.removeConnection(socket);
      console.log("Client disconnected");
    });
  }

  private emitEventToBot(eventName: string, data: any) {
    if (eventName === "newAttendantMessage") {
      const { content, botUserId, conversation_id } = data;
      console.log("Im here");
      this.io?.emit("sendWhatsappMessage", content, botUserId, conversation_id);
    }
  }

  private setConnection(socket: Socket, userId: number): void {
    this.connections.push({ connection: socket, userId: userId });
  }

  private getConnection(userId: number): IConnection | undefined {
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
    conversationId: number,
    userId: number
  ) {
    const connection = this.getConnection(userId);
    if (connection) {
      if (
        connection.conversationId !== conversationId &&
        connection.conversationId !== null
      ) {
        this.leaveConversationRoom(userId);
      }

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

  private leaveConversationRoom(userId: number) {
    const index = this.connections.findIndex((conn) => conn.userId === userId);

    console.log(
      "before",
      this.connections[index].userId,
      this.connections[index].botUserId,
      this.connections[index].conversationId
    );

    if (index !== -1) {
      this.connections[index].botUserId = null;
      this.connections[index].conversationId = null;
    }

    console.log(
      "after",
      this.connections[index].userId,
      this.connections[index].botUserId,
      this.connections[index].conversationId
    );
  }

  public broadcastToConversation(
    eventName: string,
    conversationId: number,
    data: any,
    excludeUserConnection?: number
  ) {
    if (!this.io) return;

    this.connections.forEach((conn: IConnection) => {
      if (excludeUserConnection) {
        if (
          conn.conversationId === conversationId &&
          conn.userId !== excludeUserConnection
        ) {
          console.log(
            `websocket: sending message to conversation ${conversationId} excluding user ${excludeUserConnection}`
          );

          conn.connection.emit(eventName, data);
        }
      } else {
        if (conn.conversationId === conversationId) {
          console.log(
            `websocket: sending message to all users in conversation ${conversationId}`
          );
          conn.connection.emit(eventName, data);
        }
      }

      console.log("event is: " + eventName);
    });

    this.emitEventToBot(eventName, data);
  }
}
