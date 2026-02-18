"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getAdminServices,
  updateService,
} from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";
import { Loader2, ImagePlus } from "lucide-react";

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const imageRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    long_description: "",
    category_id: "",
    image_url: "",
  });

  /* =============================
     FETCH SERVICE + CATEGORIES
  ============================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [services, cats] = await Promise.all([
          getAdminServices(),
          getAdminCategories(),
        ]);

        const service = services.find(
          (s: any) => String(s.id) === String(id)
        );

        if (!service) {
          alert("Service not found");
          router.push("/dashboard/service-page");
          return;
        }

        setForm({
          title: service.title,
          long_description: service.long_description || "",
          category_id: String(service.category_id),
          image_url: service.image_url,
        });

        // Extract filename from existing image URL
        if (service.image_url) {
          const parts = service.image_url.split("/");
          setImageName(parts[parts.length - 1]);
        }

        setCategories(cats);
      } catch (error) {
        console.error(error);
        alert("Failed to load service");
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [id, router]);

  /* =============================
     INPUT HANDLER
  ============================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =============================
     IMAGE HANDLER (IMPROVED)
  ============================= */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setImageName(file.name);
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("long_description", form.long_description);
      formData.append("category_id", form.category_id);

      if (imageRef.current?.files?.[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      await updateService(Number(id), formData);
      router.push("/dashboard/service-page");
    } catch (error) {
      console.error(error);
      alert("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Loading service...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Service
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update service details
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6"
      >
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Service Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 rounded-lg border bg-white"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE PICKER */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Service Image
          </label>

          <label
            htmlFor="image"
            className="flex items-center gap-3 cursor-pointer rounded-lg border border-dashed p-4 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600"
          >
            <ImagePlus size={20} />
            {imageName ? "Change image" : "Upload image"}
          </label>

          <input
            ref={imageRef}
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* FILE NAME */}
          {imageName && (
            <p className="mt-2 text-xs text-gray-500 truncate">
              Selected file: <span className="font-medium">{imageName}</span>
            </p>
          )}

          {/* PREVIEW */}
          <img
            src={preview || form.image_url}
            alt="Preview"
            className="mt-3 h-28 w-28 rounded-lg object-cover border"
          />
        </div>

        {/* LONG DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Long Description
          </label>
          <textarea
            name="long_description"
            value={form.long_description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg border"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white disabled:opacity-60"
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}
            {loading ? "Saving..." : "Update Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
