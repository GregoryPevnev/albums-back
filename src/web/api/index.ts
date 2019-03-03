import { Router } from "express";
import createAlbumsApi from "./albums";
import createAuthApi from "./auth";
import Bundle from "../bundle";
import Middleware from "../middleware/middleware";
import { AlbumLoaderFactory } from "../middleware/albumLoad";
import createReviewsApi from "./reviews";
import createUploadApi from "./upload";

const createApi = (bundle: Bundle, auth: Middleware, albumLoaderFactory: AlbumLoaderFactory) => {
    const api = Router();

    const reviewsApi = createReviewsApi(bundle);

    // Note: Auth-Middleware is ONLY applied partially
    api.use("/auth", createAuthApi(bundle, auth));

    api.use("/albums", auth, createAlbumsApi(bundle, reviewsApi, albumLoaderFactory));

    api.use("/upload", auth, createUploadApi(bundle));

    return api;
};

export default createApi;
