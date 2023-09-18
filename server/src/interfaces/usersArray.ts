export interface User {
  botUserId: string;
  last_conversation_created_at: Date;
}

export default interface UsersArray extends Array<User> {}
