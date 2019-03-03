import Album from "./album";
import Review from "./review";
import User from "../users/user";
import Id from "../common/id";

abstract class ReviewRepo {
    public abstract checkReview(user: User, album: Album): Promise<boolean>;
    public abstract find(id: Id): Promise<Review | null>;
    public abstract delete(album: Album, review: Review): Promise<boolean>;
    public abstract save(user: User, album: Album, review: Review): Promise<any>;
}

export default ReviewRepo;
