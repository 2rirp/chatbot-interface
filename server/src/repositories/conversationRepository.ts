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
}
