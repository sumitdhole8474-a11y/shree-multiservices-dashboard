"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getAllBlogsAdmin,
  deleteBlog,
  toggleBlogVisibility,
  type Blog,
} from "@/app/services/blog.service";

import BlogCard from "@/app/components/BlogRow";
import BlogDetailModal from "@/app/components/BlogDetailModal";
import BlogFormModal from "@/app/components/BlogFormModal";

import { Plus, Loader2, FileText, AlertCircle } from "lucide-react";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* MODAL STATES */
  const [modals, setModals] = useState<{
    delete: Blog | null;
    detail: Blog | null;
    form: { mode: "create" | "edit" | null; blog: Blog | null };
  }>({
    delete: null,
    detail: null,
    form: { mode: null, blog: null },
  });

  /* ===============================
     FETCH BLOGS
  ================================ */
  const fetchBlogs = useCallback(async (showSkeleton = true) => {
    try {
      if (showSkeleton) setLoading(true);
      const data = await getAllBlogsAdmin();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* ===============================
     ACTION HANDLERS
  ================================ */
  const handleToggleVisibility = async (id: string) => {
    // Optimistic Update: Update UI immediately
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_published: !b.is_published } : b))
    );

    try {
      setActionLoading(id);
      await toggleBlogVisibility(id);
    } catch (error) {
      // Revert if API fails
      fetchBlogs(false);
      console.error("Toggle failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const confirmDelete = async () => {
    const target = modals.delete;
    if (!target) return;

    try {
      setActionLoading(target.id);
      await deleteBlog(target.id);
      setModals((prev) => ({ ...prev, delete: null }));
      fetchBlogs(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* --- FORM MODAL (CREATE/EDIT) --- */}
      {modals.form.mode && (
        <BlogFormModal
          mode={modals.form.mode}
          blog={modals.form.blog}
          onClose={() => setModals((prev) => ({ ...prev, form: { mode: null, blog: null } }))}
          onSaved={() => {
            setModals((prev) => ({ ...prev, form: { mode: null, blog: null } }));
            fetchBlogs(false);
          }}
        />
      )}

      {/* --- DETAIL MODAL --- */}
      {modals.detail && (
        <BlogDetailModal
          blog={modals.detail}
          onClose={() => setModals((prev) => ({ ...prev, detail: null }))}
        />
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {modals.delete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Confirm Delete</h3>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-slate-900">“{modals.delete.title}”</span>? This action cannot be undone.
            </p>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setModals((prev) => ({ ...prev, delete: null }))}
                className="flex-1 px-4 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={!!actionLoading}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Blog Manager</h1>
            <p className="text-sm font-medium text-slate-500">
              {blogs.length} {blogs.length === 1 ? 'post' : 'posts'} total
            </p>
          </div>

          <button
            onClick={() => setModals((prev) => ({ ...prev, form: { mode: "create", blog: null } }))}
            className="inline-flex items-center gap-2 bg-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} strokeWidth={3} />
            New Entry
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          /* SKELETON GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-white border border-slate-100 p-4 space-y-4">
                <div className="w-full h-40 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-4">
              <FileText size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No blogs yet</h2>
            <p className="text-slate-500 max-w-xs mt-2">
              Start sharing your stories by clicking the "New Entry" button above.
            </p>
          </div>
        ) : (
          /* BLOG GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <div
                key={blog.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <BlogCard
                  blog={blog}
                  loading={actionLoading === blog.id}
                  onToggle={handleToggleVisibility}
                  onEdit={(b) => setModals((prev) => ({ ...prev, form: { mode: "edit", blog: b } }))}
                  onRequestDelete={(b) => setModals((prev) => ({ ...prev, delete: b }))}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}