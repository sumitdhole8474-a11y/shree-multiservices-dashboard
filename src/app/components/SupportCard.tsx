"use client";

import { Trash2, Clock, CheckCircle } from "lucide-react";

type SupportStatus = "pending" | "resolved";

type Props = {
  support: any;
  onRequestDelete: (support: any) => void;
  onStatusChange: (
    id: number,
    status: SupportStatus
  ) => void;
};

export default function SupportCard({
  support,
  onRequestDelete,
  onStatusChange,
}: Props) {
  const status: SupportStatus =
    support.status === "resolved" ? "resolved" : "pending";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30 group">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
            {support.name}
          </h3>

          <p className="text-sm text-gray-500 group-hover:text-gray-600">
            {support.mobile}
            {support.email && ` • ${support.email}`}
          </p>

          <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-500">
            {new Date(support.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* STATUS BADGE */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm
              ${
                status === "resolved"
                  ? "bg-green-100 text-green-700 group-hover:bg-green-200"
                  : "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
              } transition-colors`}
          >
            {status === "resolved" ? (
              <CheckCircle size={12} />
            ) : (
              <Clock size={12} />
            )}
            {status === "resolved" ? "Resolved" : "Pending"}
          </span>
        </div>
      </div>

      {/* ADDRESS */}
      {support.address && (
        <p className="text-sm text-gray-600 group-hover:text-gray-700">
          <strong className="font-medium">Address:</strong> {support.address}
        </p>
      )}

      {/* QUERY */}
      <p className="text-gray-700 leading-relaxed text-sm group-hover:text-gray-800">
        {support.query}
      </p>

      {/* ACTIONS - Inline at bottom with delete button beside status buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 group-hover:border-blue-100 transition-colors">
        {/* Empty div for flex spacing */}
        <div></div>
        
        {/* Action buttons group */}
        <div className="flex gap-2">

          <button
            onClick={() =>
              onStatusChange(support.id, "pending")
            }
            disabled={status === "pending"}
            className={`flex items-center justify-center p-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm
              ${
                status === "pending"
                  ? "bg-yellow-100 text-yellow-700 cursor-not-allowed opacity-75"
                  : "bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-yellow-700 hover:from-yellow-100 hover:to-yellow-200 hover:shadow-md hover:-translate-y-0.5 border border-yellow-200/50"
              }`}
          >
            <Clock size={18} />
          </button>

          <button
            onClick={() =>
              onStatusChange(support.id, "resolved")
            }
            disabled={status === "resolved"}
            className={`flex items-center justify-center p-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm
              ${
                status === "resolved"
                  ? "bg-green-100 text-green-700 cursor-not-allowed opacity-75"
                  : "bg-gradient-to-r from-green-50 to-green-100/50 text-green-700 hover:from-green-100 hover:to-green-200 hover:shadow-md hover:-translate-y-0.5 border border-green-200/50"
              }`}
          >
            <CheckCircle size={18} />
          </button>
            {/* Delete button moved here */}
          <button
            onClick={() => onRequestDelete(support)}
            className="p-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
            title="Delete support request"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}