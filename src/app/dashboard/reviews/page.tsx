import { getAdminReviews } from "../../services/reviews.service";
import ReviewsClient from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getAdminReviews();

  return <ReviewsClient initialReviews={reviews} />;
}