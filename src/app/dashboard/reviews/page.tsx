"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getAdminReviews, createAdminReview } from "../../services/reviews.service";
import ReviewRow from "../../components/Reviewrow";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    review: "",
    rating: 5,
  });

  /* ================= FETCH REVIEWS ================= */
  const fetchReviews = async () => {
    const data = await getAdminReviews();
    setReviews(data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  /* ================= CREATE REVIEW ================= */
  const handleCreate = async () => {
    try {
      setCreating(true);
      await createAdminReview(formData);

      setFormData({
        name: "",
        mobile: "",
        review: "",
        rating: 5,
      });

      setShowModal(false);
      fetchReviews(); // refresh list
    } catch (error) {
      console.error("Create failed:", error);
      alert("Failed to create review");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Reviews
          </h1>
          <p className="text-gray-500 mt-1">
            Customer feedback
          </p>
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      {/* ================= REVIEWS GRID ================= */}
      {reviews.length > 0 ? (
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

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">Add Review</h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded-lg p-2"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Mobile"
              className="w-full border rounded-lg p-2"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />

            <textarea
              placeholder="Review"
              rows={4}
              className="w-full border rounded-lg p-2"
              value={formData.review}
              onChange={(e) =>
                setFormData({ ...formData, review: e.target.value })
              }
            />

            <input
              type="number"
              min="1"
              max="5"
              className="w-full border rounded-lg p-2"
              value={formData.rating}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: Number(e.target.value),
                })
              }
            />

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-xl border border-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-6 py-2 rounded-xl bg-black text-white disabled:opacity-60"
              >
                {creating ? "Creating..." : "Create Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}