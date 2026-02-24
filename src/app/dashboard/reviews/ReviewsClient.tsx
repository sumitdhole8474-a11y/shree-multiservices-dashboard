"use client";

import { useState } from "react";
import { createAdminReview } from "../../services/reviews.service";
import ReviewRow from "../../components/Reviewrow";
import { Plus, Star } from "lucide-react";

export default function ReviewsClient({ initialReviews }: any) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    review: "",
    rating: 5,
    is_hidden: false, // ✅ Always published by default
  });

  /* =============================
     HANDLE CREATE REVIEW
  ============================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
const res = await createAdminReview({
  name: form.name,
  review: form.review,
  rating: form.rating,
});

    if (res.success && res.review) {
      setReviews((prev: any[]) => [
        res.review,
        ...prev,
      ]);

      setIsOpen(false);

      setForm({
        name: "",
        review: "",
        rating: 5,
        is_hidden: false,
      });
    } else {
      alert("Failed to create review");
    }
  };

  /* =============================
     HANDLE TOGGLE
  ============================= */
  const handleToggle = (id: number) => {
    setReviews((prev: any[]) =>
      prev.map((r) =>
        r.id === id ? { ...r, is_hidden: !r.is_hidden } : r
      )
    );
  };

  /* =============================
     HANDLE DELETE
  ============================= */
  const handleDelete = (id: number) => {
    setReviews((prev: any[]) =>
      prev.filter((r) => r.id !== id)
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Reviews
          </h1>
          <p className="text-gray-500 mt-1">
            Customer feedback
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={18} />
          Add Review
        </button>
      </div>

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review: any) => (
            <ReviewRow
              key={review.id}
              review={review}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-20">
          No reviews found
        </p>
      )}

      {/* =============================
           MODAL
      ============================= */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold">
              Create Review
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Customer Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              {/* ✅ REVIEW - 200 CHARACTER LIMIT */}
              <div>
                <textarea
                  required
                  placeholder="Review message"
                  className="w-full border p-2 rounded"
                  maxLength={200}
                  value={form.review}
                  onChange={(e) =>
                    setForm({ ...form, review: e.target.value })
                  }
                />

                <div className="flex justify-end">
                  <span
                    className={`text-xs mt-1 ${
                      form.review.length >= 200
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  >
                    {form.review.length}/200
                  </span>
                </div>
              </div>

              {/* ⭐ STAR RATING */}
              <div>
                <p className="text-sm font-medium mb-2">Given Rating</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() =>
                        setForm({ ...form, rating: i + 1 })
                      }
                    >
                      <Star
                        size={22}
                        className={
                          i < form.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}