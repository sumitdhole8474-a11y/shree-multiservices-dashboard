"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getBlogByIdAdmin,
  updateBlog,
} from "@/app/services/blog.service";
import { Loader2, ImagePlus } from "lucide-react";

/* ===============================
   HELPERS
================================ */
const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

const getCardDescription = (
  content: string,
  length = 120
) =>
  content.length > length
    ? content.slice(0, length) + "..."
    : content;

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
  });

  /* ===============================
     FETCH BLOG
  ================================ */
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blog = await getBlogByIdAdmin(id);

        if (!blog) {
          alert("Blog not found");
          router.push("/dashboard/blog");
          return;
        }

        setForm({
          title: blog.title,
          content: blog.content,
          image: blog.image || blog.cover_image || "",
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load blog");
        router.push("/dashboard/blog");
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [id, router]);

  /* ===============================
     INPUT HANDLERS
  ================================ */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: `/blogs/${file.name}`,
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

      await updateBlog(id, payload);
      router.push("/dashboard/blog");
    } catch (error) {
      console.error(error);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 text-gray-500 text-sm">
        Loading blog...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Edit Blog
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update blog content and image
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-6 space-y-4"
      >
        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog title"
          required
          className="w-full border p-2 rounded"
        />

        {/* CONTENT */}
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Blog content"
          rows={8}
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
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-gray-600 hover:border-black hover:text-black"
          >
            <ImagePlus size={18} />
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
            <p className="mt-1 text-xs text-gray-500">
              Current: {form.image}
            </p>
          )}
        </div>

        {/* CARD DESCRIPTION PREVIEW */}
        {form.content && (
          <p className="text-xs text-gray-500">
            Card description preview:{" "}
            <span className="italic">
              {getCardDescription(form.content)}
            </span>
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2 rounded bg-black text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}
            {loading ? "Saving..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
