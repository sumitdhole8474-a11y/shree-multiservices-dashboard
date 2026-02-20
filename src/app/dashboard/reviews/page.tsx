import { getAdminReviews } from "../../services/reviews.service";
import ReviewRow from "../../components/Reviewrow";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">
          Reviews
        </h1>
        <p className="text-gray-500 mt-1">
          Customer feedback
        </p>
      </div>

      {/* Reviews Grid */}
      {Array.isArray(reviews) && reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review: any) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-20">
          No reviews found
        </p>
      )}
    </div>
  );
}
