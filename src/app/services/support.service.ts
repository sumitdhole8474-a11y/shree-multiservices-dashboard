const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* =============================
   GET SUPPORT QUERIES (ADMIN)
============================= */
export const getAdminSupport = async () => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return [];
    }

    const res = await fetch(`${API_URL}/api/admin/support`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("⚠️ getAdminSupport failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getAdminSupport error:", error);
    return [];
  }
};

/* =============================
   UPDATE SUPPORT STATUS ✅
============================= */
export const updateSupportStatus = async (
  id: number,
  status: "pending" | "resolved"
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/support/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ updateSupportStatus failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ updateSupportStatus error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   DELETE SUPPORT QUERY
============================= */
export const deleteSupport = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/support/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      console.warn("⚠️ deleteSupport failed:", res.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ deleteSupport error:", error);
    return { success: false };
  }
};
