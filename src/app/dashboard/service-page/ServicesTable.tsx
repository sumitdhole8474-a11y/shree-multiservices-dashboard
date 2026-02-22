"use client";

import {
  Trash2,
  Plus,
  Search,
  Eye,
  EyeOff,
  Pencil,
  Filter,
} from "lucide-react";
import {
  deleteService,
  toggleServiceStatus,
} from "@/app/services/services.service";
import { useMemo, useState } from "react";

export default function ServicesTable({
  services,
  loading = false,
  onRefresh,
  onAdd,
  onEdit,
}: {
  services: any[];
  loading?: boolean;
  onRefresh: () => void;
  onAdd: () => void;
  onEdit: (service: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* =============================
     SAFE IMAGE CHECK
  ============================== */
  const isBase64 = (src?: string) =>
    typeof src === "string" && src.startsWith("data:image/");

  /* =============================
     UNIQUE CATEGORIES
  ============================== */
  const categories = useMemo(() => {
    const set = new Set<string>();
    services.forEach((s) => {
      if (s?.category) set.add(s.category);
    });
    return Array.from(set);
  }, [services]);

  /* =============================
     FILTERED SERVICES
  ============================== */
  const filteredServices = services.filter((s) => {
    const title = s?.title || "";
    const category = s?.category || "";

    const matchesSearch = `${title} ${category}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  /* =============================
     CONFIRM DELETE
  ============================== */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteService(deleteTarget.id);
      setDeleteTarget(null);
      onRefresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* =====================
          DELETE MODAL
      ===================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Service
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Do you want to delete the service{" "}
              <span className="font-semibold text-gray-900">
                “{deleteTarget.title}”
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================
          MAIN TABLE
      ===================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Services
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all services category-wise
            </p>
          </div>

          <button
            onClick={onAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            <Plus size={16} />
            Add Service
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="relative max-w-sm flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search by service or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilter((v) => !v)}
              className="h-10 px-4 flex items-center gap-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Filter <Filter size={18} />
            </button>

            {showFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-xl z-30">
                <button
                  onClick={() => {
                    setCategoryFilter("all");
                    setShowFilter(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                >
                  All Categories
                </button>

                <div className="border-t" />

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategoryFilter(cat);
                      setShowFilter(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-y">
              <tr className="text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Created</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No services found
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {s.image_url ? (
                          <img
                            src={s.image_url}
                            alt={s.title}
                            className="h-12 w-12 rounded-lg object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg border flex items-center justify-center text-xs text-gray-400">
                            No Img
                          </div>
                        )}

                        <div>
                          <p className="font-medium">{s.title}</p>
                          <p className="text-xs text-gray-500">
                            ID: {s.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600">
                        {s.category || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {s.created_at
                        ? new Date(s.created_at).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={async () => {
                            await toggleServiceStatus(s.id);
                            onRefresh();
                          }}
                          className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100"
                        >
                          {s.is_active ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => onEdit(s)}
                          className="h-9 w-9 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="h-9 w-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
