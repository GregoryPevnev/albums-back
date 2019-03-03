import Entity from "../common/entity";
import Timestamp, { generateTimestamp } from "../common/timestamp";
import { SongItem } from "./song";

interface Album extends Entity {
    title: string;
    artist: string;
    image: string;
    added: Timestamp;
}

export interface AlbumData {
    title: string;
    artist: string;
    image: string;
    songs?: SongItem[];
}

export const generateAlbum = ({ title, artist, image }: AlbumData): Album => ({
    title,
    artist,
    image,
    added: generateTimestamp()
});

export const updateAlbum = (album: Album, { title, artist, image }: AlbumData): Album => ({
    ...album,
    title,
    artist,

    // IMPORTANT: ONLY UPDATE WHEN THE IMAGE IS NOT NULL
    image: image ? image : album.image
});

export default Album;
