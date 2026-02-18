"use client";

import { useEffect, useState } from "react";
import { createBlog, updateBlog } from "@/app/services/blog.service";
import { ImagePlus, Loader2 } from "lucide-react";
import type { Blog } from "@/app/services/blog.service";

/* HELPERS */
const generateSlug = (title: string) =>
  title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

const getCardDescription = (content: string, length = 120) =>
  content.length > length ? content.slice(0, length) + "..." : content;

type Props = {
  mode: "create" | "edit";
  blog?: Blog | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function BlogForm({
  mode,
  blog,
  onSuccess,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  /* PREFILL FOR EDIT */
  useEffect(() => {
    if (mode === "edit" && blog) {
      setForm({
        title: blog.title,
        content: blog.content,
        image: blog.image || blog.cover_image || "",
      });
    }
  }, [mode, blog]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, image: `/blogs/${file.name}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      slug: generateSlug(form.title),
      description: getCardDescription(form.content),
      content: form.content,
      image: form.image,
      cover_image: form.image,
    };

    try {
      if (mode === "create") {
        await createBlog(payload);
      } else if (blog) {
        await updateBlog(blog.id, payload);
      }

      onSuccess();
    } catch (err) {
      alert("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Blog title"
        required
        className="w-full border p-2 rounded"
      />

      <textarea
        name="content"
        value={form.content}
        onChange={handleChange}
        rows={8}
        placeholder="Blog content"
        required
        className="w-full border p-2 rounded"
      />

      {/* IMAGE */}
      <div>
        <label className="block mb-1 text-sm font-medium">
          Blog Image
        </label>

        <label
          htmlFor="blogImage"
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-gray-600 hover:border-black"
        >
          <ImagePlus size={18} />
          Select blog image
        </label>

        <input
          id="blogImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {form.image && (
          <p className="mt-1 text-xs text-gray-500">
            {form.image}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded border"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {mode === "create" ? "Create Blog" : "Update Blog"}
        </button>
      </div>
    </form>
  );
}
