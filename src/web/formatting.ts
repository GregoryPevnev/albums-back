import User from "../application/users/user";
import _ from "lodash";
import Song from "../application/albums/song";
import { ResolveURL } from "../application/albums/upload";
import Timestamp, { stringToTimestamp } from "../application/common/timestamp";

export const formatUser = (user: User): any => _.pick(user, ["id", "username", "email"]);

export const formatAlbum = (album: any, urlFormatter: ResolveURL): any => ({
    ..._.omit(album, ["added"]),
    at: (album.added instanceof Timestamp ? album.added : stringToTimestamp(album.added)).toStamp(),
    image: urlFormatter(album.image)
});

export const formatTracks = (songs: Song[], urlFormatter: ResolveURL): any =>
    songs.map(song => ({
        ..._.pick(song, ["id", "name", "order"]),
        object: urlFormatter(song.object)
    }));
