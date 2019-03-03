import Entity from "../common/entity";

export interface ReviewData {
    title: string;
    rating: number;
    text?: string;
}

interface Review extends Entity {
    title: string;
    rating: number;
    text: string;
}

// Saving to data-store: Pass Album as a parameter (Got from checking)
export const generateReview = ({ title, rating, text }: ReviewData): Review => ({
    title,
    rating,
    text
});

export const updateReview = (update: ReviewData, review: Review): Review => ({
    ...review,
    ...update
});

export default Review;
