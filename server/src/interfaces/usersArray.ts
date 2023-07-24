export interface User {
  id: string;
  last_conversation_created_at: Date;
}

export default interface UsersArray extends Array<User> {}
