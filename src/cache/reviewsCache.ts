import { RedisClient } from "redis";
import GetReviewsByAlbum from "../application/albums/reviewQueries";
import Album from "../../../frontend/src/application/models/Album";

export const REVIEWS_PREFIX = "reviews-";

const format = (album: Album) => `${REVIEWS_PREFIX}${album.id}`;

const getReviewsCache = (client: RedisClient) => (query: GetReviewsByAlbum): GetReviewsByAlbum => async album => {
    let result: any = await new Promise((res, rej) =>
        client.get(format(album), (err, result) => {
            if (err) rej(err);
            else res(JSON.parse(result));
        })
    );

    if (!result) {
        console.log("Album", album.title, "not cached");
        result = await query(album);
        client.set(format(album), JSON.stringify(result));
    } else {
        console.log("Found reviews for album", album.title);
    }

    return result;
};

export default getReviewsCache;
