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
        onDelete(review.id);
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
      onToggle(review.id);
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

        {/* ✅ GOOGLE "G" ICON - Bottom Left (SVG) */}
        <div className="absolute bottom-4 left-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.2 3.6l6.9-6.9C35.5 2.4 30.2 0 24 0 14.7 0 6.7 5.5 2.8 13.5l8.1 6.3C13 13 18 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.1 24.5c0-1.7-.1-3.3-.4-4.8H24v9.1h12.4c-.5 2.7-2 5-4.2 6.6l6.5 5C42.8 36.5 46.1 31 46.1 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.9 28.8c-.5-1.4-.8-2.9-.8-4.3s.3-2.9.8-4.3l-8.1-6.3C1 17.3 0 20.6 0 24s1 6.7 2.8 10.1l8.1-6.3z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.5 0 12-2.1 16-5.7l-6.5-5c-2 1.4-4.6 2.2-9.5 2.2-6 0-11-3.5-13.1-8.5l-8.1 6.3C6.7 42.5 14.7 48 24 48z"
            />
          </svg>
        </div>

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