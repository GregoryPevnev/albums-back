import Entity from "../common/entity";

export interface SongItem {
    name: string;
    object: string;
}

interface Song extends Entity {
    order: number;
    name: string;
    object: string;
}

// Saving to data-store: Pass together with album (Save Album -> Map IDs)
export const generateSongs = (items: SongItem[]): Song[] =>
    items.map(({ name, object }, i) => ({
        order: i + 1,
        name,
        object
    }));

export default Song;
