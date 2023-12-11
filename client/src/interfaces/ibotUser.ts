import { IStatus } from "./imessage";

export default interface IBotUser {
  botUserId: string;
  conversationId?: number;
  servedBy: number | null;
  last_conversation_created_at?: string;
  lastMessageContent: string;
  lastMessageCreatedAt: string;
  lastMessageSid: string | null;
  lastMessageStatus: keyof IStatus | null;
  lastMessageMediaType: string | null;
}
