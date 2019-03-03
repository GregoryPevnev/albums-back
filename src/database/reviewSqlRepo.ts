import _ from "lodash";
import ReviewRepo from "../application/albums/reviewsRepo";
import Album from "../application/albums/album";
import Review from "../application/albums/review";
import User from "../application/users/user";
import Knex from "knex";
import Id from "../application/common/id";
import { generateId } from "../application/common/id";

interface ReviewDTO {
    id?: Id;
    title: string;
    rating: number;
    text: string;
    album: Id;
    user: Id;
}

export const REVIEW_TABLE = "reviews";

class ReviewSqlRepo extends ReviewRepo {
    private toEntity(data: ReviewDTO): Review {
        return _.pick(data, ["id", "title", "rating", "text"]);
    }

    private toDTO(user: User, album: Album, review: Review): ReviewDTO {
        return { ..._.pick(review, ["id", "title", "rating", "text"]), user: user.id, album: album.id };
    }

    private async update(review: ReviewDTO): Promise<any> {
        await this.client
            .update(review)
            .table(REVIEW_TABLE)
            .where({ id: review.id })
            .thenReturn();
    }

    private async insert(review: ReviewDTO): Promise<any> {
        await this.client
            .insert(review)
            .table(REVIEW_TABLE)
            .thenReturn();
    }

    constructor(private readonly client: Knex) {
        super();
    }

    public async find(id: Id): Promise<Review | null> {
        const results = await this.client
            .select(["id", "title", "rating", "text"])
            .table(REVIEW_TABLE)
            .where({ id });

        if (!results || results.length == 0) return null;
        return this.toEntity(results[0]);
    }

    public async delete(album: Album, review: Review): Promise<any> {
        await this.client
            .delete()
            .table(REVIEW_TABLE)
            .where({ id: review.id, album: album.id });
    }

    public async save(user: User, album: Album, review: Review): Promise<any> {
        const isNew = !review.id;
        if (!review.id) review.id = generateId();

        const dto = this.toDTO(user, album, review);

        if (isNew) await this.insert(dto);
        else await this.update(dto);
    }

    public async checkReview(user: User, album: Album): Promise<boolean> {
        const [{ count }] = await this.client
            .count("id")
            .table("reviews")
            .where({ user: user.id, album: album.id });

        return Number(count) === 0;
    }
}

export default ReviewSqlRepo;
