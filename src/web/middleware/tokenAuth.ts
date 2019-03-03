import { Request, Response, NextFunction } from "express";
import Bundle from "../bundle";
import Middleware from "./middleware";

const extractToken = (auth: string) => {
    const match = auth.match(/^JWT (\S+)$/);
    return match ? match[1] : null;
};

const getAuthMiddleware = ({ tokens, userRepo }: Bundle): Middleware => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ type: "Unauthorized" });

    const token = extractToken(auth);
    if (!token) return res.status(401).json({ type: "Invalid Token" });

    const id = await tokens.getData(token);
    if (!id) return res.status(401).json({ type: "Token Expired" });

    const user = await userRepo.find(id);
    if (!user) return res.status(401).json({ type: "User Not Found" });

    res.locals = { user, token };
    next();
};

export default getAuthMiddleware;
