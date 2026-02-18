"use client";

import React from "react";

import {
  Trash2,
  Mail,
  Phone,
  Calendar,
  Package,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

/* ================= TYPES ================= */
type EnquiryStatus = "pending" | "contacted" | "not_interested";

type Props = {
  enquiry: any;
  onRequestDelete: (enquiry: any) => void;
  onStatusChange: (id: number, status: EnquiryStatus) => void;
};

/* ================= COMPONENT ================= */
export default function EnquiryCard({
  enquiry,
  onRequestDelete,
  onStatusChange,
}: Props) {
  const emailLink = `mailto:${enquiry.email}?subject=Regarding your enquiry`;
  const whatsappLink = `https://wa.me/${enquiry.mobile_number
    ?.replace(/\D/g, "")
    .replace(/^0/, "91")}`;

  /* ================= STATUS CONFIG ================= */
  const statusMap: Record<
    EnquiryStatus,
    {
      label: string;
      color: string;
      icon: React.ReactNode;
    }
  > = {
    pending: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={12} />,
    },
    contacted: {
      label: "Contacted",
      color: "bg-blue-100 text-blue-700",
      icon: <CheckCircle size={12} />,
    },
    not_interested: {
      label: "Not Interested",
      color: "bg-red-100 text-red-700",
      icon: <XCircle size={12} />,
    },
  };

  const statusKey: EnquiryStatus =
    enquiry.status === "contacted" || enquiry.status === "not_interested"
      ? enquiry.status
      : "pending";

  const status = statusMap[statusKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* ================= HEADER ================= */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {enquiry.customer_name}
              </h3>
              <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                <Calendar size={12} />
                <span>
                  {new Date(enquiry.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS BADGE */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${status.color}`}
          >
            {status.icon}
            {status.label}
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="p-4 space-y-3">
        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            <span className="text-gray-600">{enquiry.email}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-gray-400" />
            <span className="text-gray-600">{enquiry.mobile_number}</span>
          </div>

          {enquiry.product_slug && (
            <div className="flex items-center gap-2 text-sm">
              <Package size={14} className="text-gray-400" />
              <span className="font-medium text-gray-800 uppercase text-xs">
                {enquiry.product_slug}
              </span>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageSquare size={12} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Message</span>
          </div>
          <p className="text-sm text-gray-700">
            {enquiry.message || "No message provided."}
          </p>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="p-4 pt-0 flex gap-2 flex-wrap">
        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] text-white text-sm font-medium hover:bg-[#20bd5a]"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="text-white" />
          WhatsApp
        </a>

        {/* STATUS BUTTONS */}
        <button
          onClick={() => onStatusChange(enquiry.id, "pending")}
          className="p-2 rounded-lg bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          title="Mark Pending"
        >
          <Clock size={16} />
        </button>

        <button
          onClick={() => onStatusChange(enquiry.id, "contacted")}
          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
          title="Mark Contacted"
        >
          <CheckCircle size={16} />
        </button>

        <button
          onClick={() => onStatusChange(enquiry.id, "not_interested")}
          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
          title="Mark Not Interested"
        >
          <XCircle size={16} />
        </button>

        {/* Email */}
        <a
          href={emailLink}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Mail size={16} />
        </a>

        {/* Delete */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRequestDelete(enquiry)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}