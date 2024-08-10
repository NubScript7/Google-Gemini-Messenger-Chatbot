import { Request, Response, NextFunction } from "express";
declare function logger(req: Request, res: Response, next: NextFunction): void;
export default logger;
