"use client";

import { useEffect, useState, useCallback } from "react";
import ServicesTable from "./ServicesTable";
import ServiceFormModal from "./ServiceFormModal";
import {
  getAdminServices,
  getAdminServiceById, // ✅ added
} from "@/app/services/services.service";

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [formService, setFormService] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false); // ✅ new

  /* =====================================
     LOAD SERVICES
  ===================================== */
  const load = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdminServices();

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* =====================================
     HANDLE ADD
  ===================================== */
  const handleAdd = () => {
    setFormService(null);
    setShowForm(true);
  };

  /* =====================================
     HANDLE EDIT (🔥 FIXED)
     Fetch full service including images
  ===================================== */
  const handleEdit = async (service: any) => {
    try {
      setEditLoading(true);

      const fullService = await getAdminServiceById(service.id);

      if (!fullService) {
        alert("Failed to load service details");
        return;
      }

      setFormService(fullService);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to fetch service:", error);
      alert("Something went wrong while loading service");
    } finally {
      setEditLoading(false);
    }
  };

  /* =====================================
     AFTER SAVE
  ===================================== */
  const handleSaved = async () => {
    setShowForm(false);
    await load();
  };

  return (
    <>
      {/* ============================
          ADD / EDIT MODAL
      ============================ */}
      {showForm && (
        <ServiceFormModal
          service={formService}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {/* ============================
          TABLE
      ============================ */}
      <ServicesTable
        services={services}
        loading={loading || editLoading}
        onRefresh={load}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
    </>
  );
}