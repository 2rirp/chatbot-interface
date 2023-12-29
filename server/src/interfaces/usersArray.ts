export interface User {
  botUserId: string;
  last_conversation_created_at: string;
  served_by: number;
}

export default interface UsersArray extends Array<User> {}
