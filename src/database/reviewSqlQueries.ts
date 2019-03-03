import Knex from "knex";
import GetReviewsByAlbum from "../application/albums/reviewQueries";

const getReviewsQuery = (client: Knex): GetReviewsByAlbum => async album => {
    const results = await client
        .select({
            id: "reviews.id",
            title: "reviews.title",
            rating: "reviews.rating",
            text: "reviews.text",
            by: "users.username",
            byId: "users.id"
        })
        .table("reviews")
        .where({ album: album.id })
        .join("users", { "users.id": "reviews.user" });

    return results;
};

export default getReviewsQuery;
