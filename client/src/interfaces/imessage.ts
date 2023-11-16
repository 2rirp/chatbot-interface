export default interface IMessage {
  id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean;
  media_url: string | null;
  media_type: string | null;
  botUserId?: string;
  sid: string | null;
  status: keyof IStatus | null;
}

export type IStatus = {
  queued: string;
  failed: string;
  sent: string;
  delivered: string;
  read: string;
};
