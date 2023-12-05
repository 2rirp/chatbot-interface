import dbConnect from "../database/dbConnect";

export default class ConversationRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  async getAllConversationsDates() {
    try {
      const queryText = `SELECT created_at FROM conversations`;

      const result = await this.db.pool.query(queryText);

      const datesArray = result.rows.map(
        (row) => row.created_at.toISOString().split("T")[0]
      );

      const uniqueDates = [...new Set(datesArray)];

      return uniqueDates;
    } catch (error) {
      console.error("Failed to fetch conversations date: ", error);
      throw error;
    }
  }

  async getRedirectedConversations(typeOfRedirected: "attendant" | "lecturer") {
    try {
      const conversationStatus =
        typeOfRedirected === "attendant"
          ? "talking_to_attendant"
          : "talking_to_lecturer";

      const queryText = `SELECT c.user_id, c.id, c.served_by, m.content, m.created_at, m.sid, m.status, m.media_type
      FROM conversations c
      INNER JOIN (
        SELECT conversation_id, MAX(id) AS max_id
        FROM messages
        GROUP BY conversation_id
      ) latest_message ON c.id = latest_message.conversation_id
      INNER JOIN messages m ON latest_message.max_id = m.id
      WHERE c.status = $1
      ORDER BY m.created_at DESC`;

      const result = await this.db.pool.query(queryText, [conversationStatus]);

      console.log(result.rows);

      return result.rows;
    } catch (error) {
      console.error(
        `Failed to fetch conversations redirected to ${typeOfRedirected}: `,
        error
      );
      throw error;
    }
  }

  async deactivateConversation(conversationId: string, userId: string) {
    try {
      const result = await this.db.pool.query(
        `
            UPDATE conversations
            SET status = 'inactive'
            WHERE id = $1 AND user_id = $2`,
        [conversationId, userId]
      );

      return result.rows[0];
    } catch (error) {
      console.error("Failed to deactivate conversation: ", error);
      throw error;
    }
  }

  async applyAttendantToServeConversation(
    conversationId: number,
    attendantId: number
  ) {
    try {
      const result = await this.db.pool.query(
        `
            UPDATE conversations
            SET served_by = $2
            WHERE id = $1 AND served_by IS NULL
            RETURNING *`,
        [conversationId, attendantId]
      );

      return result.rowCount > 0;
    } catch (error) {
      console.error("Failed to update the served_by in conversation: ", error);
      throw error;
    }
  }
}
