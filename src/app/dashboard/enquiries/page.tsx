"use client";

import { useEffect, useState } from "react";
import EnquiryCard from "@/app/components/EnquiryRow";
import {
  getAdminEnquiries,
  deleteEnquiry,
  updateEnquiryStatus,
} from "../../services/enquiries.service";
import { Search } from "lucide-react";

type EnquiryStatus = "pending" | "contacted" | "not_interested";

export const dynamic = "force-dynamic";


export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* DELETE POPUP STATE */
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ================= FETCH ================= */
  const fetchEnquiries = async () => {
    setLoading(true);
    const data = await getAdminEnquiries();
    setEnquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteEnquiry(deleteTarget.id);
      setDeleteTarget(null);
      setEnquiries((prev) =>
        prev.filter((e) => e.id !== deleteTarget.id)
      );
    } finally {
      setDeleting(false);
    }
  };

  /* ================= UPDATE STATUS (FIXED) ================= */
  const handleStatusChange = async (
    id: number,
    status: EnquiryStatus
  ) => {
    // 1️⃣ Optimistic UI update
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status } : e
      )
    );

    try {
      // 2️⃣ Persist to backend
      await updateEnquiryStatus(id, status);
    } catch (error) {
      console.error("Status update failed", error);
      // 3️⃣ Rollback on failure
      fetchEnquiries();
    }
  };

  /* ================= SEARCH ================= */
  const filteredEnquiries = enquiries.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.customer_name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.mobile_number.toLowerCase().includes(q) ||
      (e.product_slug?.toLowerCase().includes(q) ?? false) ||
      e.message.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* ================= DELETE MODAL ================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl mx-4">
            <h3 className="text-xl font-bold text-slate-900">Delete Enquiry</h3>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to delete the enquiry from{" "}
              <span className="font-bold text-slate-900">
                {deleteTarget.customer_name}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= PAGE ================= */}
      <div className="p-8 bg-slate-50 min-h-screen space-y-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Enquiries</h1>
            <p className="text-slate-500 mt-1 font-medium">
              Manage your customer contact requests
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or product..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white"
            />
          </div>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="text-slate-400">Loading enquiries...</div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center text-slate-400 py-24">
            No matching enquiries found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEnquiries.map((enquiry) => (
              <EnquiryCard
                key={enquiry.id}
                enquiry={enquiry}
                onRequestDelete={setDeleteTarget}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
