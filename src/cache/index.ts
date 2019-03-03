import { RedisClient, createClient } from "redis";
import JWTTokens from "./jwtTokens";
import TokenService from "../application/services/tokens";
import { getSearchCache } from "./searchCache";
import { Search } from "../application/albums/albumQueries";
import GetReviewsByAlbum from "../application/albums/reviewQueries";
import getReviewsCache from "./reviewsCache";
import ReviewRepo from "../application/albums/reviewsRepo";
import CacheReviewRepo from "./reviewProxy";
import AlbumRepo from "../application/albums/albumRepo";
import CacheAlbumRepo from "./albumProxy";
import CacheInvalidator from "./cacheInvalidator";

class CacheManager {
    private tokens?: JWTTokens;

    public static init(host: string, port: number, secret: string) {
        const client = createClient({ host, port });
        return new CacheManager(client, secret, new CacheInvalidator(client));
    }

    private constructor(
        private readonly client: RedisClient,
        private readonly secret: string,
        private readonly invalidator: CacheInvalidator
    ) {}

    public searchCache(search: Search) {
        return getSearchCache(this.client)(search);
    }

    public reviewsCache(review: GetReviewsByAlbum) {
        return getReviewsCache(this.client)(review);
    }

    public proxyReviewsRepo(repo: ReviewRepo): ReviewRepo {
        return new CacheReviewRepo(this.invalidator, repo);
    }

    public proxyAlbumsRepo(repo: AlbumRepo): AlbumRepo {
        return new CacheAlbumRepo(this.invalidator, repo);
    }

    public tokensStore(): TokenService {
        if (!this.tokens) this.tokens = new JWTTokens(this.client, this.secret);
        return this.tokens;
    }

    public close() {
        return this.client.quit();
    }
}

export default CacheManager;
