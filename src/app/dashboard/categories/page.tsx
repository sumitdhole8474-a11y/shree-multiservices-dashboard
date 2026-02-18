"use client";

import { useEffect, useState } from "react";
import {
  getAdminCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../services/categories.service";
import {
  Trash2,
  Search,
  Plus,
  Pencil,
  Check,
  X,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* EDIT STATE */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

  /* DELETE MODAL STATE */
  const [deleteTarget, setDeleteTarget] =
    useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* =============================
     LOAD DATA
  ============================= */
  const loadData = async () => {
    const data = await getAdminCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* =============================
     CREATE CATEGORY
  ============================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await createCategory(title);
    setTitle("");
    setLoading(false);
    loadData();
  };

  /* =============================
     UPDATE CATEGORY
  ============================= */
  const handleUpdate = async (id: number) => {
    if (!editTitle.trim()) return;

    await updateCategory(id, editTitle);
    setEditingId(null);
    setEditTitle("");
    loadData();
  };

  /* =============================
     CONFIRM DELETE
  ============================= */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    await deleteCategory(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    loadData();
  };

  /* =============================
     FILTER
  ============================= */
  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* =====================
          DELETE MODAL
      ===================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Category
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              Do you want to delete the category{" "}
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
          PAGE CONTENT
      ===================== */}
      <div className="p-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage service categories used across your platform
          </p>
        </div>

        {/* ACTION BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* ADD CATEGORY */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 flex-1"
          >
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New category title"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
            >
              <Plus size={16} />
              Add
            </button>
          </form>

          {/* SEARCH */}
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              {/* HEADER WITH TITLE AND ACTIONS INLINE */}
              <div className="flex items-start justify-between gap-4">
                {/* TITLE OR EDIT INPUT */}
                <div className="flex-1">
                  {editingId === cat.id ? (
                    <input
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-lg font-semibold text-gray-900 break-words pr-2">
                      {cat.title}
                    </h3>
                  )}
                </div>

                {/* ACTION BUTTONS INLINE */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {editingId === cat.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>

                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditTitle("");
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditTitle(cat.title);
                        }}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* CREATED DATE */}
              <p className="text-xs text-gray-500 mt-2">
                Created on{" "}
                {new Date(cat.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">
              No categories found
            </div>
          )}
        </div>
      </div>
    </>
  );
}