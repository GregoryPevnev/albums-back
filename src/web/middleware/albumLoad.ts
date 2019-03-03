import { Request, Response, NextFunction } from "express";
import Bundle from "../bundle";
import Middleware from "./middleware";

export interface AlbumLoaderFactory {
    (isOwned?: boolean): Middleware;
}

const loadAlbumMiddleware = ({ albumRepo }: Bundle): AlbumLoaderFactory => (isOwned: boolean = false) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const albumId = String(req.params.albumId);
    const user = res.locals.user;
    const album = isOwned ? await albumRepo.find(albumId, user) : await albumRepo.find(albumId);

    if (!album) return res.status(404).json({ error: { type: "not-found" } });

    res.locals = { ...res.locals, album };
    next();
};

export default loadAlbumMiddleware;
