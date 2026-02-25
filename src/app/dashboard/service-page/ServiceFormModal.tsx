"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import {
  createService,
  updateService,
} from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";

const MAX_IMAGES = 5;

type GalleryItem =
  | {
      id: number; // existing image from DB
      preview: string;
      isExisting: true;
    }
  | {
      file: File; // new uploaded image
      preview: string;
      isExisting: false;
    };

export default function ServiceFormModal({
  service,
  onClose,
  onSaved,
}: {
  service: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  /* =========================
     FORM STATE
  ========================= */
  const [form, setForm] = useState({
    title: "",
    long_description: "",
    category_id: "",
  });

  /* =========================
     GALLERY STATE
  ========================= */
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    getAdminCategories().then(setCategories);

    if (service) {
      setForm({
        title: service.title || "",
        long_description: service.long_description || "",
        category_id: String(service.category_id || ""),
      });

      // 🔥 LOAD EXISTING IMAGES
      if (service.images?.length) {
        const existingImages = service.images.map((img: any) => ({
          id: img.id,
          preview: img.image_url,
          isExisting: true as const,
        }));

        setGallery(existingImages);
      }
    } else {
      setGallery([]);
    }
  }, [service]);

  /* =========================
     ADD GALLERY IMAGE
  ========================= */
  const handleGalleryAdd = (file: File) => {
    if (gallery.length >= MAX_IMAGES) return;

    const preview = URL.createObjectURL(file);

    setGallery((prev) => [
      ...prev,
      { file, preview, isExisting: false },
    ]);
  };

  /* =========================
     REMOVE IMAGE
  ========================= */
  const removeGalleryImage = (index: number) => {
    setGallery((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];

      if (!removed.isExisting) {
        URL.revokeObjectURL(removed.preview);
      }

      return updated;
    });
  };

  /* =========================
     DRAG REORDER
  ========================= */
  const handleDragStart = (index: number) => {
    (window as any).__dragIndex = index;
  };

  const handleDropReorder = (index: number) => {
    const dragIndex = (window as any).__dragIndex;
    if (dragIndex === undefined) return;

    setGallery((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(index, 0, moved);
      return updated;
    });

    (window as any).__dragIndex = undefined;
  };

  /* =========================
     SUBMIT
  ========================= */
 const submit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.title || !form.category_id) {
    alert("Title and category are required.");
    return;
  }

  setLoading(true);

  try {
    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("long_description", form.long_description);
    fd.append("category_id", form.category_id);

    if (service) {
      // EDIT MODE
      gallery.forEach((item) => {
        if (!item.isExisting) {
          fd.append("gallery", item.file);
        } else {
          fd.append("imageIds", String(item.id));
        }
      });
    } else {
      // CREATE MODE (must have 5)
      if (gallery.length !== 5) {
        alert("Exactly 5 images are required.");
        setLoading(false);
        return;
      }

      gallery.forEach((item) => {
        if (!item.isExisting) {
          fd.append("gallery", item.file);
        }
      });
    }

    const result = service
      ? await updateService(service.id, fd)
      : await createService(fd);

    if (!result?.success) {
      alert(result?.message || "Failed to save service");
      return;
    }

    onSaved();

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-5"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {service ? "Edit Service" : "Add Service"}
          </h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TITLE */}
        <input
          required
          placeholder="Service title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-lg border"
        />

        {/* CATEGORY */}
        <select
          required
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-lg border bg-white"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          rows={4}
          placeholder="Long description"
          value={form.long_description}
          onChange={(e) =>
            setForm({
              ...form,
              long_description: e.target.value,
            })
          }
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
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() =>
                    item ? handleDropReorder(i) : undefined
                  }
                  draggable={!!item}
                  onDragStart={() =>
                    item && handleDragStart(i)
                  }
                  className="relative aspect-square border-2 border-dashed rounded-xl flex items-center justify-center overflow-hidden cursor-pointer"
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
                        onClick={() =>
                          removeGalleryImage(i)
                        }
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
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 disabled:opacity-60"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin" />
            )}
            {service ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}