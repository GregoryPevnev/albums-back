// Dependency-Injection and Bundling
import createServer from "./web/index";
import getValidators from "./schemas";
import DatabaseManager from "./database";
import CacheManager from "./cache";
import StorageManager from "./storage/index";

// Environment / Settings
interface Params {
    secret: string;
    schemaPath: string;
    api: {
        port: number;
        address: string;
        origin: string;
    };
    cache: {
        host: string;
        port: number;
    };
    storage: {
        key: string;
        secret: string;
        store: string;
        default: string;
    };
}

const build = async ({ secret, schemaPath, api, cache, storage }: Params) => {
    // Building details
    const validators = await getValidators(schemaPath);
    console.log("Validators built");

    const cacheManager = CacheManager.init(cache.host, cache.port, secret);
    console.log("Connected to Cache");

    const storageManager = StorageManager.init(storage.key, storage.secret, storage.store, storage.default);
    console.log("Configured Storage");

    const databaseManager = DatabaseManager.init(storageManager.objectsDeleter());
    console.log("Connected to Database");

    // Building View
    const server = createServer(
        {
            tokens: cacheManager.tokensStore(),
            userRepo: databaseManager.userRepo(),
            albumRepo: cacheManager.proxyAlbumsRepo(databaseManager.albumRepo()),
            reviewRepo: cacheManager.proxyReviewsRepo(databaseManager.reviewRepo()),
            albumsQueries: {
                search: cacheManager.searchCache(databaseManager.searchQuery()),
                list: databaseManager.paginationQuery(),
                my: databaseManager.myQuery()
            },
            validators,
            getUploadURL: storageManager.uploader(),
            resolveURL: storageManager.resolver(),
            reviewsQuery: cacheManager.reviewsCache(databaseManager.reviewsQuery()),
            tracksQuery: databaseManager.songsQuery(),
            findAlbum: databaseManager.findQuery()
        },
        api.origin
    );

    // Start Up
    server.listen(api.port, api.address);
};

export default build;
