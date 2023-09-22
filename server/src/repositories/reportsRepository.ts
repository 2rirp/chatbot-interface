import { Query, QueryResult } from "pg";
import dbConnect from "../database/dbConnect";
import IResponse from "../interfaces/iresponse";
import IUser from "../interfaces/iuser";
import { query } from "express";

export default class ReportsRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  async getAllConversationReports() {
    try {
      const queryText = `SELECT data,
      MAX(redirected) AS redirected,
      MAX(quantidade) AS quantidade,
      MAX(emitidas) AS emitidas
FROM (
   SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS data,
          COUNT(CASE WHEN menu = 'option_2' THEN user_id END) AS redirected,
          COUNT(user_id) AS quantidade,
          NULL AS emitidas
   FROM conversations
   GROUP BY data

   UNION ALL

   SELECT TO_CHAR(DATE_TRUNC('day', data_solicitacao), 'YYYY-MM-DD') AS data,
          NULL AS redirected,
          NULL AS quantidade,
          COUNT(*) AS emitidas
   FROM registration
   WHERE link_certidao IS NOT NULL AND link_certidao <> ''
   GROUP BY data
) AS combined_data
GROUP BY data
ORDER BY data;`
      const result = await this.db.pool.query(queryText);
      return result.rows;
    } catch (error) {
      console.error('failed to get conversation reports: ', error)
      throw error;
    }
  }

  async getConversationReportsByDay(date: string) {
     
    try {
        const queryText = `SELECT data,
        MAX(redirected) AS redirected,
        MAX(quantidade) AS quantidade,
        MAX(emitidas) AS emitidas
 FROM (
     SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS data,
            COUNT(CASE WHEN menu = 'option_2' THEN user_id END) AS redirected,
            COUNT(user_id) AS quantidade,
            NULL AS emitidas
     FROM conversations
     WHERE DATE_TRUNC('day', created_at) = $1
     GROUP BY data
 
     UNION ALL
 
     SELECT TO_CHAR(DATE_TRUNC('day', data_solicitacao), 'YYYY-MM-DD') AS data,
            NULL AS redirected,
            NULL AS quantidade,
            COUNT(*) AS emitidas
     FROM registration
     WHERE DATE_TRUNC('day', data_solicitacao) = $1
         AND link_certidao IS NOT NULL AND link_certidao <> ''
     GROUP BY data
 ) AS combined_data
 GROUP BY data
 ORDER BY data;`
        const result = await this.db.pool.query(queryText, [date]);
        return result.rows;
    } catch (error) {
        console.error('failed to get conversation reports: ', error)
        throw error;
    }
  }

  async getRedirectedConversations(date: string) {
    try {
        const queryText = `SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS data, COUNT(*) AS redirected
        FROM conversations
        WHERE menu = 'option_2'
        WHERE created_at >= $1::timestamp AND created_at < ($1::timestamp + INTERVAL '1 day')
        GROUP BY date
        ORDER BY date;`
        const result = await this.db.pool.query(queryText, [date]);
        return result.rows;
    } catch (error) {
        console.error('failed to get redirected conversations reports: ', error)
        throw error;
    }
  }

  async getRegistrations(date: string) {
    try {
        const queryText = `SELECT TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS data, 
        COUNT(*) AS emitidas FROM registration WHERE link_certidao IS NOT NULL AND link_certidao <> ''
        WHERE data_solicitacao >= $1::timestamp AND data_solicitacao < ($1::timestamp + INTERVAL '1 day')
        GROUP BY data
        ORDER BY data;
        `
        const result = await this.db.pool.query(queryText, [date]);
        return result.rows;
    } catch (error) {
        console.error('failed to get registration reports: ', error)
        throw error;
    }
  }

  async getAllUsersByDate(date: string) {
    try {
      const queryText = `SELECT TO_CHAR(c.created_at, 'HH24:MI') AS date, c.id, c.user_id, c.status,
      CASE WHEN u.link_certidao IS NOT NULL and link_certidao <> '' THEN TRUE ELSE FALSE END AS emitida
      FROM conversations c
      LEFT JOIN registration u ON c.user_id = u.user_id
      WHERE c.created_at >= $1::timestamp
      AND c.created_at < ($1::timestamp + INTERVAL '1 day')
      ORDER BY c.created_at;`;
      const result = await this.db.pool.query(queryText, [date]);
      return result.rows;
    } catch (error) {
      console.error('failed to get all user reports: ', error)
      throw error;
    }
  }
}