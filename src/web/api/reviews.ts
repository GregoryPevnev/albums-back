import { Router, Request, Response, NextFunction } from "express";
import Bundle from "../bundle";
import { isAppError } from "../../application/common/errors";
import { generateReview, updateReview } from "../../application/albums/review";

const createReviewsApi = ({ validators, reviewRepo, reviewsQuery }: Bundle) => {
    const reviewsApi = Router(); // Add middleware to other side

    const reviewLoader = async (req: Request, res: Response, next: NextFunction) => {
        const review = await reviewRepo.find(req.params.reviewId);
        if (!review) return res.status(404).json({ error: { type: "not-found" } });

        res.locals.review = review;
        next();
    };

    reviewsApi
        .route("/")
        .get(async (req, res) => {
            return res.status(200).send({
                reviews: await reviewsQuery(res.locals.album)
            });
        })
        .post(async (req, res) => {
            try {
                const user = res.locals.user,
                    album = res.locals.album;
                const check = await reviewRepo.checkReview(user, album);

                if (!check) return res.status(400).json({ error: { type: "review-exists" } });

                const reviewData = validators.validateReview(req.body);
                const review = generateReview(reviewData);

                await reviewRepo.save(user, album, review);
                return res.status(201).send({ review });
            } catch (e) {
                console.log("Cannot Post Review:", e);
                if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
                return res.status(400).json({ error: e });
            }
        });

    reviewsApi
        .route("/:reviewId")
        .delete(reviewLoader, async (req, res) => {
            await reviewRepo.delete(res.locals.album, res.locals.review);
            return res.status(204).send();
        })
        .put(reviewLoader, async (req, res) => {
            try {
                const reviewData = validators.validateReview(req.body);
                const review = updateReview(reviewData, res.locals.review);

                await reviewRepo.save(res.locals.user, res.locals.album, review);
                return res.status(200).send({ review });
            } catch (e) {
                console.log("Cannot Update Review:", e);
                if (!isAppError(e)) return res.status(500).json({ error: { type: "server" } });
                return res.status(400).json({ error: e });
            }
        });

    return reviewsApi;
};

export default createReviewsApi;
