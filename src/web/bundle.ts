import UserRepo from "../application/users/userRepo";
import TokenService from "../application/services/tokens";
import Validators from "../application/services/validation";
import AlbumRepo from "../application/albums/albumRepo";
import ReviewRepo from "../application/albums/reviewsRepo";
import Query from "../application/albums/albumQueries";
import { GetUploadURL, ResolveURL } from "../application/albums/upload";
import GetReviewsByAlbum from "../application/albums/reviewQueries";
import GetAlbumTracks from "../application/albums/songQueries";
import { FindAlbum } from "../application/albums/albumQueries";

interface Bundle {
    tokens: TokenService;
    validators: Validators;

    userRepo: UserRepo;
    albumRepo: AlbumRepo;
    reviewRepo: ReviewRepo;

    albumsQueries: Query;
    reviewsQuery: GetReviewsByAlbum;
    tracksQuery: GetAlbumTracks;
    findAlbum: FindAlbum;

    getUploadURL: GetUploadURL;
    resolveURL: ResolveURL;
}

export default Bundle;
