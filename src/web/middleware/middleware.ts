import { Request, Response, NextFunction } from "express";

interface Middleware {
    (req: Request, res: Response, next: NextFunction): any;
}

export default Middleware;
