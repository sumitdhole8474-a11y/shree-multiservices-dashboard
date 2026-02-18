const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* ===============================
   GET ALL SERVICES (ADMIN)
================================ */
export const getAdminServices = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/services`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(
        "⚠️ getAdminServices failed:",
        res.status
      );
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error(
      "❌ getAdminServices error:",
      error
    );
    return [];
  }
};

/* ===============================
   CREATE SERVICE
================================ */
export const createService = async (
  formData: FormData
): Promise<{ success: boolean; data?: any }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services`,
      {
        method: "POST",
        body: formData, // multipart/form-data
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.warn(
        "⚠️ createService failed:",
        text
      );
      return { success: false };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error(
      "❌ createService error:",
      error
    );
    return { success: false };
  }
};

/* ===============================
   UPDATE SERVICE
================================ */
export const updateService = async (
  id: number,
  formData: FormData
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}`,
      {
        method: "PUT",
        body: formData, // multipart/form-data
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.warn(
        "⚠️ updateService failed:",
        text
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ updateService error:",
      error
    );
    return { success: false };
  }
};

/* ===============================
   DELETE SERVICE
================================ */
export const deleteService = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ deleteService failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ deleteService error:",
      error
    );
    return { success: false };
  }
};

/* ===============================
   HIDE / UNHIDE SERVICE
================================ */
export const toggleServiceStatus = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}/toggle`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ toggleServiceStatus failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ toggleServiceStatus error:",
      error
    );
    return { success: false };
  }
};
