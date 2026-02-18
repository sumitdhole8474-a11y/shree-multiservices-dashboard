"use client";

import { useEffect, useState } from "react";
import { Search, Headset, AlertTriangle } from "lucide-react";
import SupportCard from "../../components/SupportCard";
import {
  getAdminSupport,
  deleteSupport,
  updateSupportStatus,
} from "../../services/support.service";
import { motion, AnimatePresence } from "framer-motion";

type SupportStatus = "pending" | "resolved";

export default function SupportPage() {
  const [supports, setSupports] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* DELETE MODAL STATE */
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* FETCH DATA */
  const fetchData = async () => {
    setLoading(true);
    const data = await getAdminSupport();
    setSupports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* CONFIRM DELETE */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteSupport(deleteTarget.id);
      setDeleteTarget(null);
      fetchData();
    } finally {
      setDeleting(false);
    }
  };

  /* UPDATE STATUS */
  const handleStatusChange = async (
    id: number,
    status: SupportStatus
  ) => {
    // Optimistic update
    setSupports((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status } : s
      )
    );

    try {
      await updateSupportStatus(id, status);
    } catch (error) {
      console.error("Failed to update support status", error);
      fetchData(); // rollback
    }
  };

  /* FILTER */
  const filtered = supports.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.mobile.toLowerCase().includes(q) ||
      (s.email?.toLowerCase().includes(q) ?? false) ||
      s.query.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* ================= DELETE MODAL ================= */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-red-600 mb-3">
                <AlertTriangle />
                <h3 className="text-lg font-semibold">
                  Delete Support Request
                </h3>
              </div>

              <p className="text-sm text-gray-600">
                Are you sure you want to delete the support request from{" "}
                <span className="font-semibold text-gray-900">
                  {deleteTarget.name}
                </span>
                ?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-60"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PAGE ================= */}
      <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
                <Headset size={16} />
                Admin Portal
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Customer Support
              </h1>
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Quick search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-11 pr-4 py-3 rounded-2xl
                  bg-white shadow-sm ring-1 ring-slate-200
                  focus:ring-2 focus:ring-blue-500
                  transition-all outline-none
                "
              />
            </div>
          </div>

          {/* GRID */}
          {loading ? (
            <p className="text-sm text-slate-500">
              Loading support requests…
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                No support requests found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((support) => (
                <motion.div
                  key={support.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <SupportCard
                    support={support}
                    onRequestDelete={setDeleteTarget}
                    onStatusChange={handleStatusChange}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
