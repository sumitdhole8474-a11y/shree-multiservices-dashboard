"use client";

import { X } from "lucide-react";
import type { Blog } from "@/app/services/blog.service";

type Props = {
  blog: Blog;
  onClose: () => void;
};

export default function BlogDetailModal({ blog, onClose }: Props) {
  // ✅ Normalize image path for public folder
  const imageSrc = blog.cover_image
    ? blog.cover_image.startsWith("/")
      ? blog.cover_image
      : `/${blog.cover_image}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{blog.title}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* IMAGE */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={blog.title}
            className="mb-4 h-64 w-full rounded-lg object-cover"
          />
        )}

        {/* META */}
        <div className="mb-4 text-sm text-gray-600">
          <p>
            <strong>Slug:</strong> {blog.slug}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(blog.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {blog.is_published ? "Published" : "Hidden"}
          </p>
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="mb-4">
          <h3 className="mb-1 font-semibold">Short Description</h3>
          <p className="text-gray-700">{blog.description}</p>
        </div>

        {/* LONG CONTENT */}
        <div>
          <h3 className="mb-1 font-semibold">Blog Content</h3>
          <div className="whitespace-pre-line text-gray-800">
            {blog.content}
          </div>
        </div>
      </div>
    </div>
  );
}
