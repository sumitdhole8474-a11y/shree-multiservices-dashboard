const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

/* =========================================================
   TYPES
========================================================= */

export interface AdminService {
  id: number;
  title: string;
  image_url?: string; // first image from service_images
  short_description?: string;
  long_description?: string;
  category_id: number;
  category?: string;
  is_active: boolean;
  created_at: string;
}

/* =========================================================
   Helper: Safe JSON Parse
========================================================= */

const safeJson = async (res: Response) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

/* =========================================================
   GET ALL SERVICES (ADMIN)
========================================================= */

export const getAdminServices = async (): Promise<AdminService[]> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("⚠️ getAdminServices failed:", res.status);
      return [];
    }

    const json = await safeJson(res);

    if (json?.success && Array.isArray(json.data)) {
      return json.data;
    }

    if (Array.isArray(json)) {
      return json;
    }

    return [];
  } catch (error) {
    console.error("❌ getAdminServices error:", error);
    return [];
  }
};

/* =========================================================
   CREATE SERVICE
   🔥 Requires exactly 5 images in field name: gallery
========================================================= */

export const createService = async (
  formData: FormData
): Promise<{ success: boolean; message?: string }> => {
  try {
    // 🔥 Validate gallery images before sending
    const galleryFiles = formData.getAll("gallery");

    if (galleryFiles.length !== 5) {
      return {
        success: false,
        message: "Exactly 5 images are required",
      };
    }

    const res = await fetch(
      `${API_BASE_URL}/api/admin/services`,
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || "Failed to create service",
      };
    }

    return { success: true };

  } catch (error) {
    console.error("❌ createService error:", error);
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
};

/* =========================================================
   UPDATE SERVICE
   🔥 If gallery provided → must be exactly 5 images
========================================================= */

export const updateService = async (
  id: number,
  formData: FormData
): Promise<{ success: boolean; message?: string }> => {
  try {
    const galleryFiles = formData.getAll("gallery");

    if (galleryFiles.length > 0 && galleryFiles.length !== 5) {
      return {
        success: false,
        message: "Exactly 5 images are required when updating gallery",
      };
    }

    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const json = await safeJson(res);

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || "Failed to update service",
      };
    }

    return { success: true };

  } catch (error) {
    console.error("❌ updateService error:", error);
    return {
      success: false,
      message: "Unexpected error occurred",
    };
  }
};

/* =========================================================
   DELETE SERVICE
========================================================= */

export const deleteService = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };

  } catch (error) {
    console.error("❌ deleteService error:", error);
    return { success: false };
  }
};

/* =========================================================
   TOGGLE SERVICE STATUS
========================================================= */

export const toggleServiceStatus = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}/toggle`,
      { method: "PATCH" }
    );

    if (!res.ok) {
      return { success: false };
    }

    return { success: true };

  } catch (error) {
    console.error("❌ toggleServiceStatus error:", error);
    return { success: false };
  }
};
