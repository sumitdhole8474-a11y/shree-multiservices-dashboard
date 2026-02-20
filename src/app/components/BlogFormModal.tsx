"use client";

import { useEffect, useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import {
  createBlog,
  updateBlog,
  type Blog,
} from "@/app/services/blog.service";

/* ===============================
   HELPERS
================================ */
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const getCardDescription = (c: string, l = 120) =>
  c.length > l ? c.slice(0, l) + "..." : c;

type Props = {
  mode: "create" | "edit";
  blog: Blog | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function BlogFormModal({
  mode,
  blog,
  onClose,
  onSaved,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  /* ===============================
     PREFILL (EDIT MODE)
  ================================ */
  useEffect(() => {
    if (blog && mode === "edit") {
      setForm({
        title: blog.title || "",
        content: blog.content || "",
        image: blog.image || blog.cover_image || "",
      });
    }
  }, [blog, mode]);

  /* ===============================
     IMAGE HANDLER (BASE64)
  ================================ */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string, // ✅ Base64
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ===============================
     SUBMIT
  ================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        slug: generateSlug(form.title),
        description: getCardDescription(form.content),
        content: form.content,
        image: form.image,
        cover_image: form.image,
      };

      if (mode === "create") {
        await createBlog(payload);
      } else if (blog) {
        await updateBlog(blog.id, payload);
      }

      onSaved();
    } catch (error) {
      console.error(error);
      alert("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in p-4">
      <form
        onSubmit={handleSubmit}
        className="
          relative w-full max-w-2xl
          rounded-2xl bg-white p-6
          shadow-2xl
          animate-in zoom-in-95 slide-in-from-bottom-4
        "
      >
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Add Blog" : "Edit Blog"}
            </h2>
            <p className="text-sm text-gray-500">
              {mode === "create"
                ? "Create a new blog post"
                : "Update your blog content"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* TITLE */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Blog Title
          </label>
          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            placeholder="Enter blog title"
            className="
              w-full rounded-lg border px-3 py-2
              focus:ring-2 focus:ring-black/20
              focus:outline-none transition
            "
          />
        </div>

        {/* CONTENT */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Blog Content
          </label>
          <textarea
            required
            rows={6}
            value={form.content}
            onChange={(e) =>
              setForm({ ...form, content: e.target.value })
            }
            placeholder="Write your blog content here..."
            className="
              w-full rounded-lg border px-3 py-2
              focus:ring-2 focus:ring-black/20
              focus:outline-none transition
            "
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Blog Image
          </label>

          <label
            className="
              flex cursor-pointer items-center gap-3
              rounded-xl border border-dashed p-4
              text-sm text-gray-600
              hover:border-black hover:text-black
              transition
            "
          >
            <ImagePlus size={20} />
            <span>
              {form.image ? "Change image" : "Select an image"}
            </span>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {form.image && (
            <div className="mt-2">
              <img
                src={form.image}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg border px-4 py-2
              text-sm hover:bg-gray-50 transition
            "
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="
              inline-flex items-center gap-2
              rounded-lg bg-black px-4 py-2
              text-sm font-medium text-white
              hover:bg-gray-900
              transition-all
              disabled:opacity-60
            "
          >
            {loading && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {mode === "create" ? "Create Blog" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
