import AlbumRepo from "../application/albums/albumRepo";
import Id from "../application/common/id";
import User from "../application/users/user";
import Song from "../application/albums/song";
import Album from "../application/albums/album";
import CacheInvalidator from "./cacheInvalidator";

class CacheAlbumRepo extends AlbumRepo {
    constructor(private readonly invalidator: CacheInvalidator, private readonly repo: AlbumRepo) {
        super();
    }

    public delete(album: Album): Promise<any> {
        this.invalidator.invalidateSearchCache();
        this.invalidator.invalidateReviewsCache(album); // All review-records assiciated
        return this.repo.delete(album);
    }

    public save(user: User, album: Album, songs: Song[]): Promise<any> {
        this.invalidator.invalidateSearchCache();
        return this.repo.save(user, album, songs);
    }

    public find(id: Id, user?: User): Promise<Album | null> {
        return this.repo.find(id, user);
    }
    public like(user: User, album: Album): Promise<any> {
        return this.repo.like(user, album);
    }
    public unlike(user: User, album: Album): Promise<any> {
        return this.repo.unlike(user, album);
    }
}

export default CacheAlbumRepo;
