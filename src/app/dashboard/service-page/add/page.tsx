"use client";

import { useEffect, useState } from "react";
import { createService } from "@/app/services/services.service";
import { getAdminCategories } from "@/app/services/categories.service";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AddServicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getAdminCategories().then(setCategories);
  }, []);

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  setLoading(true);

  try {
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 🔥 Make sure file exists
    const fileInput = form.querySelector(
      'input[name="image"]'
    ) as HTMLInputElement;

    if (!fileInput?.files?.length) {
      alert("Please select an image");
      setLoading(false);
      return;
    }

    formData.set("image", fileInput.files[0]); // ensure correct file

    const result = await createService(formData);

    if (!result.success) {
      alert("Failed to add service");
      setLoading(false);
      return;
    }

    // ✅ Redirect only if backend confirms success
    router.push("/dashboard/service-page");

  } catch (error) {
    console.error(error);
    alert("Failed to add service");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Add New Service
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a service and assign it to an existing category
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Service Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title
            </label>
            <input
              name="title"
              placeholder="Eg. Health Insurance"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category_id"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Image
            </label>
            <input
              type="file"
              name="image"
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-600
                hover:file:bg-blue-100"
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              name="long_description"
              placeholder="Detailed description for service page"
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}
              {loading ? "Saving..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
