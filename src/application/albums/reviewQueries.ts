import Id from "../common/id";
import Album from "../../../../frontend/src/application/models/Album";

export interface AlbumReview {
    id: Id;
    title: string;
    rating: number;
    text: string;
    by: string;
    byId: Id;
}

interface GetReviewsByAlbum {
    (album: Album): Promise<AlbumReview[]>;
}

export default GetReviewsByAlbum;
