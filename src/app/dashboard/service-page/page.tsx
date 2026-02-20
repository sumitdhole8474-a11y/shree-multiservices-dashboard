"use client";

import { useEffect, useState, useCallback } from "react";
import ServicesTable from "./ServicesTable";
import ServiceFormModal from "./ServiceFormModal";
import { getAdminServices } from "@/app/services/services.service";

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [formService, setFormService] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =====================================
     LOAD SERVICES
  ===================================== */
  const load = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdminServices();

      // Always ensure array
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
     HANDLE EDIT
     (If you're using separate Edit Page,
      you may remove modal editing)
  ===================================== */
  const handleEdit = (service: any) => {
    setFormService(service);
    setShowForm(true);
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
        loading={loading}
        onRefresh={load}
        onAdd={handleAdd}
        onEdit={handleEdit}
      />
    </>
  );
}
