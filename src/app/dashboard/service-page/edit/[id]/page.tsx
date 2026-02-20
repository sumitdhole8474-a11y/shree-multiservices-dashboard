"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  updateService,
} from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";
import { Loader2, Plus, Trash2 } from "lucide-react";

const MAX_IMAGES = 5;

export default function EditServicePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    long_description: "",
    category_id: "",
  });

  /* =============================
     GALLERY STATE (5 images)
  ============================= */
  const [gallery, setGallery] = useState<
    { file?: File; preview: string }[]
  >([]);

  /* =============================
     FETCH SERVICE + CATEGORIES
  ============================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, serviceRes] = await Promise.all([
          getAdminCategories(),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${id}`
          ).then((r) => r.json()),
        ]);

        const service = serviceRes?.data;

        if (!service) {
          alert("Service not found");
          router.push("/dashboard/service-page");
          return;
        }

        setForm({
          title: service.title,
          long_description: service.long_description || "",
          category_id: String(service.category_id),
        });

        // 🔥 Load existing gallery images
        const existingImages =
          service.images?.slice(0, 5).map((img: any) => ({
            preview: img.image_url,
          })) || [];

        setGallery(existingImages);

        setCategories(catsRes);
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
     ADD IMAGE
  ============================= */
  const handleGalleryAdd = (file: File) => {
    if (gallery.length >= MAX_IMAGES) return;

    const newItem = {
      file,
      preview: URL.createObjectURL(file),
    };

    setGallery((prev) => [...prev, newItem]);
  };

  /* =============================
     REMOVE IMAGE
  ============================= */
  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (gallery.length !== 5) {
      alert("Exactly 5 images are required.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("long_description", form.long_description);
      formData.append("category_id", form.category_id);

      // 🔥 Only append files if they are new uploads
      gallery.forEach((item) => {
        if (item.file) {
          formData.append("gallery", item.file);
        }
      });

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
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Edit Service
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update service details & gallery
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-8 space-y-6"
      >
        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border"
        />

        {/* CATEGORY */}
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

        {/* DESCRIPTION */}
        <textarea
          name="long_description"
          value={form.long_description}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border"
        />

        {/* GALLERY */}
        <div>
          <p className="text-sm font-medium mb-3">
            Gallery Images (Exactly 5 Required)
          </p>

          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const item = gallery[i];

              return (
                <div
                  key={i}
                  className="relative aspect-square border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden"
                >
                  {item ? (
                    <>
                      <img
                        src={item.preview}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center text-gray-400 cursor-pointer">
                      <Plus />
                      <span className="text-[10px]">
                        Image {i + 1}
                      </span>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleGalleryAdd(
                            e.target.files[0]
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
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
              <Loader2 size={16} className="animate-spin" />
            )}
            {loading ? "Saving..." : "Update Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
