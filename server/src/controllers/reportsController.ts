import { NextFunction, Request, Response } from "express";
import reportsService from "../services/reportsService";
import IUser from "../interfaces/iuser";
import ErrorHandler from "../errors";

export default class ReportsController {
    public async getReportsByDate(
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const admin : IUser = req.user;
             const date = req.params.date;
            // console.log(date)
               
            if(admin.is_admin === true) {
                    const reports = await reportsService.getConversationReportsByDate(date);
                    res.status(200).json({
                        error: null,
                        data: reports
                        
                });  
            //const redirected = await reportsService.getRedirectedReports(date);
            //const registrations = await reportsService.getRegistrationReports(date);
            //console.log("conversations: ",conversations, /*"redirected: ", redirected, "registrations: ", registrations*/)

            
        } else {
            throw ErrorHandler.createError(
              "UnauthorizedError",
              "User is not admin."
            );
          }
        } catch (error) {
            next(error)
        }
    }
    public async getReports(
        req: Request,
        res: Response,
        next: NextFunction
    ) : Promise<void> {
        try {
            const admin : IUser = req.user;
            // console.log(date)
               
            if(admin.is_admin === true) {
                    const reports = await reportsService.getAllConversationReports();
                    res.status(200).json({
                        error: null,
                        data: reports
                        
                });  
            //const redirected = await reportsService.getRedirectedReports(date);
            //const registrations = await reportsService.getRegistrationReports(date);
            //console.log("conversations: ",conversations, /*"redirected: ", redirected, "registrations: ", registrations*/)

            
        } else {
            throw ErrorHandler.createError(
              "UnauthorizedError",
              "User is not admin."
            );
          }
        } catch (error) {
            next(error)
        }
    }
}