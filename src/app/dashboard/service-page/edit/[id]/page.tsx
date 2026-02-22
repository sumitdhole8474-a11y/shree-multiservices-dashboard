"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { updateService } from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";
import { Loader2 } from "lucide-react";

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
     GALLERY STATE
  ============================= */
  const [gallery, setGallery] = useState<
    { file?: File; preview: string }[]
  >(Array(MAX_IMAGES).fill(null));

  /* =============================
     FETCH SERVICE
  ============================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, res] = await Promise.all([
          getAdminCategories(),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`
          ).then((r) => r.json()),
        ]);

        const service = res?.data;

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

        // 🔥 Force exactly 5 image slots
        const images =
          service.images?.slice(0, 5) || [];

        const filledGallery = Array(MAX_IMAGES)
          .fill(null)
          .map((_, i) =>
            images[i]
              ? { preview: images[i].image_url }
              : { preview: "" }
          );

        setGallery(filledGallery);
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
     INPUT CHANGE
  ============================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =============================
     REPLACE IMAGE
  ============================= */
  const handleReplace = (index: number, file: File) => {
    const preview = URL.createObjectURL(file);

    setGallery((prev) => {
      const updated = [...prev];
      updated[index] = { file, preview };
      return updated;
    });
  };

  /* =============================
     BASE64 TO FILE
  ============================= */
  const base64ToFile = async (
    base64: string,
    filename: string
  ): Promise<File> => {
    const res = await fetch(base64);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (gallery.some((g) => !g.preview)) {
      alert("All 5 images must be present.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      fd.append("long_description", form.long_description);
      fd.append("category_id", form.category_id);

      for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];

        if (item.file) {
          fd.append("gallery", item.file);
        } else {
          const file = await base64ToFile(
            item.preview,
            `image-${i}.jpg`
          );
          fd.append("gallery", file);
        }
      }

      const result = await updateService(Number(id), fd);

      if (!result.success) {
        alert(result.message || "Update failed");
        return;
      }

      router.push("/dashboard/service-page");
    } catch (error) {
      console.error(error);
      alert("Update failed");
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
      <h1 className="text-2xl font-semibold">
        Edit Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border p-8 space-y-6"
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2.5 rounded-lg border"
        />

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

        <textarea
          name="long_description"
          value={form.long_description}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border"
        />

        {/* 5 IMAGE BOXES */}
        <div className="grid grid-cols-5 gap-3">
          {gallery.map((item, i) => (
            <div
              key={i}
              className="relative aspect-square border rounded-xl overflow-hidden"
            >
              {item.preview && (
                <img
                  src={item.preview}
                  className="w-full h-full object-cover"
                  alt=""
                />
              )}

              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 cursor-pointer text-white text-xs">
                Change
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleReplace(
                      i,
                      e.target.files[0]
                    )
                  }
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin inline mr-2"
                />
                Saving...
              </>
            ) : (
              "Update Service"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
