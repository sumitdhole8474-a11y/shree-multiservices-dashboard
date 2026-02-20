"use client";

import { Eye, EyeOff, Trash2, Pencil, Calendar } from "lucide-react";
import type { Blog } from "@/app/services/blog.service";

type Props = {
  blog: Blog;
  onRequestDelete: (blog: Blog) => void;
  onToggle: (id: string) => void;
  onEdit: (blog: Blog) => void;
  loading: boolean;
};

export default function BlogCard({
  blog,
  onRequestDelete,
  onToggle,
  onEdit,
  loading,
}: Props) {
  /* ===============================
     IMAGE NORMALIZATION
     Supports:
     - Base64 (data:image/...)
     - Public path (/uploads/...)
     - Fallback prefix
  ================================ */
  const coverImage = blog.cover_image
    ? blog.cover_image.startsWith("data:image/")
      ? blog.cover_image
      : blog.cover_image.startsWith("/")
      ? blog.cover_image
      : `/${blog.cover_image}`
    : null;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 ease-out p-3 flex flex-col h-full active:scale-[0.98]">
      
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-50 mb-4">
        {coverImage ? (
          <img
            src={coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-medium">
            No cover image
          </div>
        )}

        {/* STATUS BADGE */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
              blog.is_published
                ? "bg-emerald-500/90 border-emerald-400/50 text-white"
                : "bg-slate-700/90 border-slate-500/50 text-white"
            }`}
          >
            {blog.is_published ? "Live" : "Draft"}
          </span>
        </div>
      </div>

      {/* CONTENT BLOCK */}
      <div className="px-1 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={12} className="text-blue-500" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-tight">
            {blog.created_at
              ? new Date(blog.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {blog.title}
        </h3>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-50">
        <div className="flex gap-1">
          <button
            onClick={() => onToggle(blog.id)}
            disabled={loading}
            className={`p-2 rounded-xl transition-all duration-200 ${
              blog.is_published
                ? "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                : "text-blue-500 bg-blue-50 hover:bg-blue-100"
            }`}
            title={blog.is_published ? "Hide from public" : "Show to public"}
          >
            {blog.is_published ? (
              <EyeOff size={18} strokeWidth={2.5} />
            ) : (
              <Eye size={18} strokeWidth={2.5} />
            )}
          </button>

          <button
            onClick={() => onEdit(blog)}
            className="p-2 rounded-xl text-gray-400 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
            title="Edit Post"
          >
            <Pencil size={18} strokeWidth={2.5} />
          </button>
        </div>

        <button
          onClick={() => onRequestDelete(blog)}
          className="p-2 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          title="Delete Post"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
