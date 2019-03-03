import Knex from "knex";
import UserSqlRepo from "./userSqlRepo";
import AlbumSqlRepo from "./albumSqlRepo";
import ReviewSqlRepo from "./reviewSqlRepo";
import { Search, Pagination, My, FindAlbum } from "../application/albums/albumQueries";
import { initSearchQuery, initListQuery, initMyQuery, initFindQuery } from "./albumSqlQueries";
import GetReviewsByAlbum from "../application/albums/reviewQueries";
import getReviewsQuery from "./reviewSqlQueries";
import GetAlbumTracks from "../application/albums/songQueries";
import getTracksQuery from "./songSqlQueries";
import { DeleteObjects } from "../application/albums/upload";

class DatabaseManager {
    private readonly client: Knex;

    private users?: UserSqlRepo;
    private albums?: AlbumSqlRepo;
    private reviews?: ReviewSqlRepo;

    public static init(deleter: DeleteObjects) {
        return new DatabaseManager(deleter);
    }

    private constructor(private readonly deleter: DeleteObjects) {
        this.client = Knex(require("../../knexfile"));
    }

    public userRepo(): UserSqlRepo {
        if (!this.users) this.users = new UserSqlRepo(this.client);
        return this.users;
    }
    public albumRepo(): AlbumSqlRepo {
        if (!this.albums) this.albums = new AlbumSqlRepo(this.client, this.deleter);
        return this.albums;
    }
    public reviewRepo(): ReviewSqlRepo {
        if (!this.reviews) this.reviews = new ReviewSqlRepo(this.client);
        return this.reviews;
    }

    public searchQuery(): Search {
        return initSearchQuery(this.client);
    }
    public paginationQuery(): Pagination {
        return initListQuery(this.client, 10);
    }
    public myQuery(): My {
        return initMyQuery(this.client);
    }
    public reviewsQuery(): GetReviewsByAlbum {
        return getReviewsQuery(this.client);
    }
    public songsQuery(): GetAlbumTracks {
        return getTracksQuery(this.client);
    }
    public findQuery(): FindAlbum {
        return initFindQuery(this.client);
    }

    public close() {
        return this.client.destroy();
    }
}

export default DatabaseManager;
