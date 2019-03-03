import Knex from "knex";
import GetAlbumTracks from "../application/albums/songQueries";
import { SONG_TABLE } from "./albumSqlRepo";

const getTracksQuery = (client: Knex): GetAlbumTracks => async album => {
    return await client
        .select(["id", "order", "name", "object"])
        .from(SONG_TABLE)
        .where({ album: album.id });
};

export default getTracksQuery;
