import Knex from "knex";
import { Search, Pagination, My, SortBy, QueryResult, FindAlbum } from "../application/albums/albumQueries";
import { stringToTimestamp } from "../application/common/timestamp";
import { LIKES_TABLE } from "./albumSqlRepo";

const FIELDS = "id, title, artist, CAST(rating as FLOAT), by, image, added";
const SEARCH_VIEW = "AlbumSearch";

export const initSearchQuery = (client: Knex): Search => async ({ term }): Promise<QueryResult> => {
    const result = await client.select(client.raw(FIELDS)).table(client.raw("SearchAlbums(?)", term || ""));

    return {
        albums: result,
        count: 1,
        next: false,
        page: 0
    };
    // IMPORTANT: No input -> Empty search (Desired behavior -> Only search with content)
};

export const initListQuery = (client: Knex, pageSize = 20): Pagination => async ({
    page,
    sort
}): Promise<QueryResult> => {
    const count = await client.raw("SELECT COUNT(1) as count FROM AlbumSearch").then(res => res.rows[0].count);
    const totalPages = Math.ceil(count / pageSize);

    if (totalPages <= page) return { albums: [], count: totalPages, next: false, page: 0 }; // Overflow -> Handle by default

    const sorter = sort === SortBy.Recent ? "added DESC" : "rating DESC, added DESC";

    // Pagination: Starts with 0
    const result = await client
        .select(client.raw(FIELDS))
        .table(client.raw(SEARCH_VIEW))
        .orderByRaw(client.raw(sorter))
        .limit(pageSize)
        .offset(pageSize * page);

    return {
        albums: result,
        count: totalPages,
        next: totalPages > page + 1,
        page
    };
};

export const initMyQuery = (client: Knex): My => async ({ user }): Promise<QueryResult> => {
    const result = await client
        .select(client.raw(FIELDS))
        .table(client.raw(SEARCH_VIEW))
        .joinRaw(`JOIN ${LIKES_TABLE} ON ${SEARCH_VIEW}.id=${LIKES_TABLE}.album`)
        .where(`${LIKES_TABLE}.user`, user.id);

    return {
        albums: result,
        count: 1,
        next: false,
        page: 0
    };
};

export const initFindQuery = (client: Knex): FindAlbum => async id => {
    const result = await client
        .select({
            id: "albums.id",
            title: "albums.title",
            artist: "albums.artist",
            image: "albums.image",
            by: "albums.user",
            added: "albums.added"
        })
        .table("albums")
        .where({ id });

    if (result.length === 0) return null;

    return { ...result[0], added: stringToTimestamp(result[0].added) };
};
