import Album from "../application/albums/album";
import { REVIEWS_PREFIX } from "./reviewsCache";
import { SEARCH_PREFIX } from "./searchCache";
import { RedisClient } from "redis";

class CacheInvalidator {
    constructor(private readonly client: RedisClient) {}

    public getKeys(prefix: string): Promise<string[]> {
        return new Promise((res, rej) =>
            this.client.keys(`${prefix}*`, (err, result) => (err ? rej(err) : res(result)))
        );
    }

    // Perform multiple invalidations if needed
    public async invalidateSearchCache() {
        const keys: any = await this.getKeys(SEARCH_PREFIX);

        if (keys.length > 0)
            await new Promise((res, rej) => this.client.del(...keys, (err, result) => (err ? rej(err) : res(result))));
    }

    public async invalidateReviewsCache(album: Album) {
        await new Promise((res, rej) =>
            this.client.del(`${REVIEWS_PREFIX}${album.id}`, (err, result) => (err ? rej(err) : res(result)))
        );
    }
}

export default CacheInvalidator;
