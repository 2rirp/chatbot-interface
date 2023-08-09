import { Socket } from "socket.io";

export default interface IConnection {
  connection: Socket;
  userId?: string | null;
  botUserId?: string | null;
  conversationId?: number | null;
}
