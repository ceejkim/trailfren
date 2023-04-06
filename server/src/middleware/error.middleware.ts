import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";

export const errorHandler = (
  error: HttpException | AxiosError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status =
    (error as HttpException).statusCode ||
    (error as HttpException).status ||
    500;

  res.status(status).send(error);
};
