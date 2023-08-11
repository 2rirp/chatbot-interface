import { Socket } from "socket.io";

export default interface IConnection {
  connection: Socket;
  userId?: number | null;
  botUserId?: string | null;
  conversationId?: number | null;
}
