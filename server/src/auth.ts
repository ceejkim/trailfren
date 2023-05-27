import { NextFunction, Request, Response } from "express";

const auth = async (
  _req: Request<any, any, any, any>,
  res: Response<any, Record<string, any>>,
  next: NextFunction
) => {
  try {
    return next();
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

export default auth;
