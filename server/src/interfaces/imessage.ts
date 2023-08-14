export default interface IMessage {
  id: number;
  content: string;
  conversation_id: number;
  created_at: string;
  message_from_bot: boolean;
}
