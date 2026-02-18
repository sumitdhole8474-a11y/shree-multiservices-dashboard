"use client";

import { useEffect, useState } from "react";
import ServicesTable from "./ServicesTable";
import ServiceFormModal from "./ServiceFormModal";
import { getAdminServices } from "@/app/services/services.service";

export default function ServicePage() {
  const [services, setServices] = useState<any[]>([]);
  const [formService, setFormService] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getAdminServices();
    setServices(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {/* ADD / EDIT MODAL */}
      {showForm && (
        <ServiceFormModal
          service={formService}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}

      {/* TABLE */}
      <ServicesTable
        services={services}
        loading={loading}
        onRefresh={load}
        onAdd={() => {
          setFormService(null);
          setShowForm(true);
        }}
        onEdit={(service) => {
          setFormService(service);
          setShowForm(true);
        }}
      />
    </>
  );
}
