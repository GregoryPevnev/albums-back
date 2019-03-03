import Id from "../common/id";
import Album from "../../../../frontend/src/application/models/Album";

export interface AlbumTrack {
    id: Id;
    order: number;
    name: string;
    object: string;
}

interface GetAlbumTracks {
    (album: Album): Promise<AlbumTrack[]>;
}

export default GetAlbumTracks;
