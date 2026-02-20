"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBlog } from "@/app/services/blog.service";
import { ImagePlus } from "lucide-react";

/* ===============================
   HELPERS
================================ */
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const getCardDescription = (content: string, length = 120) =>
  content.length > length
    ? content.slice(0, length) + "..."
    : content;

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "", // Base64
  });

  /* ===============================
     INPUT HANDLER
  ================================ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===============================
     IMAGE HANDLER (Base64)
  ================================ */
  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setForm((prev) => ({
      ...prev,
      image: base64, // ✅ Store Base64
    }));
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
        cover_image: form.image, // same image
      };

      const result = await createBlog(payload);

      if (!result.success) {
        alert("Failed to create blog");
        setLoading(false);
        return;
      }

      router.push("/dashboard/blog");

    } catch (error) {
      console.error(error);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Add Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* TITLE */}
        <input
          name="title"
          placeholder="Blog title"
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* CONTENT */}
        <textarea
          name="content"
          placeholder="Write full blog content here..."
          rows={8}
          required
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        {/* IMAGE */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Blog Image
          </label>

          <label
            htmlFor="blogImage"
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-gray-600 hover:border-black hover:text-black"
          >
            <ImagePlus size={20} />
            <span>Select blog image</span>
          </label>

          <input
            id="blogImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {form.image && (
            <div className="mt-2">
              <img
                src={form.image}
                alt="Preview"
                className="h-20 w-20 object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* PREVIEW INFO */}
        {form.content && (
          <p className="text-xs text-gray-500">
            Card description preview:{" "}
            <span className="italic">
              {getCardDescription(form.content)}
            </span>
          </p>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
