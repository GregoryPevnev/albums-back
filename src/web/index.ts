import createApi from "./api";
import createApp from "./server";
import Bundle from "./bundle";
import getAuthMiddleware from "./middleware/tokenAuth";
import loadAlbumMiddleware from "./middleware/albumLoad";

const createServer = (bundle: Bundle, origin: string) => {
    const authMiddleware = getAuthMiddleware(bundle);
    const albumLoader = loadAlbumMiddleware(bundle);

    const api = createApi(bundle, authMiddleware, albumLoader);
    const app = createApp(api, origin);
    return app;
};

export default createServer;
