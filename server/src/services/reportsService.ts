import ReportsRepository from '../repositories/reportsRepository'


export default class reportsService {
    private static repository = new ReportsRepository();

    public static async getConversationReportsByDate(date: string) {
        try {
            
            const conversations = await this.repository.getConversationReportsByDay(date);
            if(conversations)
                return conversations;
            
        } catch (error) {
            throw error;
        }
    }

    public static async getUserReportsByDate(date: string) {
        try {
            const users = await this.repository.getAllUsersByDate(date);
            if(users)
                return users;
            
        } catch (error) {
            throw error;
        }
    }
    public static async getAllConversationReports() {
        try {
            const conversations = await this.repository.getAllConversationReports();
            if(conversations)
                return conversations;
            
        } catch (error) {
            throw error;
        }
    }
}