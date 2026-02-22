const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  console.warn("⚠️ NEXT_PUBLIC_API_URL is not defined");
}

/* =========================================================
   TYPES
========================================================= */

export interface AdminService {
  id: number;
  title: string;
  image_url?: string; // first image (for table preview)
  images?: {
    id: number; // ✅ needed for delete/swap
    image_url: string;
    sort_order: number;
  }[];
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
      return json.data as AdminService[];
    }

    if (Array.isArray(json)) {
      return json as AdminService[];
    }

    return [];
  } catch (error) {
    console.error("❌ getAdminServices error:", error);
    return [];
  }
};

/* =========================================================
   GET SINGLE SERVICE (FOR EDIT FORM)
========================================================= */

export const getAdminServiceById = async (
  id: number
): Promise<AdminService | null> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/services/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.warn("⚠️ getAdminServiceById failed:", res.status);
      return null;
    }

    const json = await safeJson(res);

    if (json?.success && json.data) {
      return json.data as AdminService;
    }

    return null;
  } catch (error) {
    console.error("❌ getAdminServiceById error:", error);
    return null;
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
        message:
          "Exactly 5 images are required when updating gallery",
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
      console.warn("⚠️ deleteService failed:", res.status);
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
      console.warn("⚠️ toggleServiceStatus failed:", res.status);
      return { success: false };
    }

    return { success: true };

  } catch (error) {
    console.error("❌ toggleServiceStatus error:", error);
    return { success: false };
  }
};