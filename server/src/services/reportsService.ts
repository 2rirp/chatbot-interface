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
    public static async getAllConversationReports() {
        try {
            const conversations = await this.repository.getAllConversationReports();
            if(conversations)
                return conversations;
            
        } catch (error) {
            throw error;
        }
    }

    // public static async getRedirectedReports(date: string) {
    //     try {
    //         const redirect = await this.repository.getRedirectedConversations(date);
    //         return redirect;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // public static async getRegistrationReports(date: string) {
    //     try {
    //         const registration = await this.repository.getRegistrations(date);
    //         return registration;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}