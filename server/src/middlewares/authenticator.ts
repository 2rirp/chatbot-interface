import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ErrorHandler from "../errors";
import IUser from "../interfaces/iuser";

export default function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.session;
  if (!token) {
    return res.status(401).json({
      error: ErrorHandler.createError(
        "UnauthorizedError",
        "token is missing or invalid"
      ),
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWTSECRET || ""
    ) as JwtPayload;
    req.user = decoded as IUser;

    next();
  } catch (error) {
    return res.status(401).json({
      error: ErrorHandler.createError(
        "UnauthorizedError",
        "token is missing or invalid"
      ),
      data: null,
    });
  }
}
