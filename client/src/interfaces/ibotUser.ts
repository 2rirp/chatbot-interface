import { IStatus } from "./imessage";

export default interface IBotUser {
  botUserId: string;
  conversationId?: number;
  last_conversation_created_at?: string;
  lastMessageContent: string;
  lastMessageCreatedAt: string;
  lastMessageSid: string;
  lastMessageStatus: keyof IStatus;
  lastMessageMediaType: string;
}
