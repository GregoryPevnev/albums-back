import ReviewRepo from "../application/albums/reviewsRepo";
import Album from "../application/albums/album";
import User from "../application/users/user";
import Id from "../application/common/id";
import Review from "../application/albums/review";
import CacheInvalidator from "./cacheInvalidator";

class CacheReviewRepo extends ReviewRepo {
    constructor(private readonly invalidator: CacheInvalidator, private readonly repo: ReviewRepo) {
        super();
    }

    public checkReview(user: User, album: Album): Promise<boolean> {
        return this.repo.checkReview(user, album);
    }

    public find(id: Id): Promise<Review | null> {
        return this.repo.find(id);
    }

    public delete(album: Album, review: Review): Promise<boolean> {
        this.invalidator.invalidateReviewsCache(album);
        return this.repo.delete(album, review);
    }

    public save(user: User, album: Album, review: Review): Promise<any> {
        this.invalidator.invalidateReviewsCache(album);
        return this.repo.save(user, album, review);
    }
}

export default CacheReviewRepo;
