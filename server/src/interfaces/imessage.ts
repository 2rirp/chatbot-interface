interface IMessage {
  id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean;
  media_url: string;
  media_type: string;
  sid: string;
  status: keyof IMessageStatus;
  botUserId?: string;
}

interface IMessageStatus {
  queued: string;
  failed: string;
  sent: string;
  delivered: string;
  read: string;
}

export { IMessage, IMessageStatus };
