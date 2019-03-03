import { RedisClient } from "redis";
import { Search } from "../application/albums/albumQueries";

const MAX_AGE = 60;

export const SEARCH_PREFIX = "search-";

const format = (term: string) => `${SEARCH_PREFIX}${term}`;

export const getSearchCache = (client: RedisClient) => (search: Search): Search => async ({ term }) => {
    let result: any = await new Promise((res, rej) =>
        client.get(format(term), (err, result) => {
            if (err) rej(err);
            else res(JSON.parse(result));
        })
    );

    if (!result) {
        console.log("No result for", term);
        result = await search({ term });
        client.setex(format(term), MAX_AGE, JSON.stringify(result));
    } else console.log("Found result for", term);

    return result;
};
