"use client";

import { Trash2, Star, EyeOff, Eye } from "lucide-react";
import {
  deleteReview,
  toggleHideReview,
} from "../services/reviews.service";
import { useState } from "react";

export default function ReviewRow({
  review,
  onDelete,
  onToggle,
}: any) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await deleteReview(review.id);

      if (res.success) {
        onDelete(review.id); // ✅ update parent state
        setShowDeleteModal(false);
      } else {
        alert("Failed to delete review");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= HIDE ================= */
  const handleHide = async () => {
    const res = await toggleHideReview(review.id);

    if (res.success) {
      onToggle(review.id); // ✅ update parent state
    } else {
      alert("Failed to update review");
    }
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        className={`relative flex flex-col bg-white rounded-2xl border border-gray-200 p-6 transition-all ${
          review.is_hidden
            ? "opacity-50"
            : "hover:shadow-md hover:border-gray-300"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {review.name}
            </h3>

            <p className="text-xs text-gray-600 mt-0.5">
              📞 {review.mobile}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {new Date(review.created_at).toLocaleString()}
            </p>
          </div>

          <span
            className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
              review.is_hidden
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {review.is_hidden ? "Hidden" : "Published"}
          </span>
        </div>

        {/* ================= RATING ================= */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < review.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>

        {/* ================= REVIEW TEXT ================= */}
        <p className="text-sm text-gray-700 leading-relaxed mb-14 line-clamp-5">
          {review.review}
        </p>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={handleHide}
            title={review.is_hidden ? "Unhide Review" : "Hide Review"}
            className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            {review.is_hidden ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            title="Delete Review"
            className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Review
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Are you sure you want to delete the review from{" "}
              <span className="font-semibold text-gray-900">
                {review.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}