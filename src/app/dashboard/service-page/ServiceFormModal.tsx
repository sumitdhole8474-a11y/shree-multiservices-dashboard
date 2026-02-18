"use client";

import { useEffect, useRef, useState } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";
import {
  createService,
  updateService,
} from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";

export default function ServiceFormModal({
  service,
  onClose,
  onSaved,
}: {
  service: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const imageRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");

  const [form, setForm] = useState({
    title: "",
    long_description: "",
    category_id: "",
  });

  useEffect(() => {
    getAdminCategories().then(setCategories);

    if (service) {
      setForm({
        title: service.title,
        long_description: service.long_description || "",
        category_id: String(service.category_id),
      });
      setPreview(service.image_url || null);

      if (service.image_url) {
        const parts = service.image_url.split("/");
        setImageName(parts[parts.length - 1]);
      }
    }
  }, [service]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("long_description", form.long_description);
      fd.append("category_id", form.category_id);

      if (imageRef.current?.files?.[0]) {
        fd.append("image", imageRef.current.files[0]);
      }

      service
        ? await updateService(service.id, fd)
        : await createService(fd);

      onSaved();
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <form
        onSubmit={submit}
        className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-5"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {service ? "Edit Service" : "Add Service"}
          </h2>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <input
          required
          placeholder="Service title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className="w-full px-4 py-2.5 rounded-lg border"
        />

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

        {/* IMAGE PICKER */}
        <label
          htmlFor="image"
          className="flex gap-2 items-center border-dashed border rounded-lg p-4 cursor-pointer text-gray-600 hover:border-blue-500 hover:text-blue-600"
        >
          <ImagePlus />
          {imageName ? "Change image" : "Upload image"}
          <input
            ref={imageRef}
            id="image"
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        {/* FILE NAME */}
        {imageName && (
          <p className="text-xs text-gray-500 truncate">
            Selected file:{" "}
            <span className="font-medium">{imageName}</span>
          </p>
        )}

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="h-24 w-24 rounded-lg object-cover border"
            alt="Preview"
          />
        )}

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
