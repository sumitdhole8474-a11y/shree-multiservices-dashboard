/* =============================
   ENV
============================= */
const API_URL: string | undefined =
  process.env.NEXT_PUBLIC_API_URL;

/* =============================
   GET ENQUIRIES (ADMIN)
============================= */
export const getAdminEnquiries = async (): Promise<any[]> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return [];
    }

    const res = await fetch(
      `${API_URL}/api/admin/enquiries`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ getAdminEnquiries failed:",
        res.status
      );
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error(
      "❌ getAdminEnquiries error:",
      error
    );
    return [];
  }
};

/* =============================
   DELETE ENQUIRY
============================= */
export const deleteEnquiry = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/enquiries/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ deleteEnquiry failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ deleteEnquiry error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   UPDATE ENQUIRY STATUS ✅
============================= */
export const updateEnquiryStatus = async (
  id: number,
  status: "pending" | "contacted" | "not_interested"
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/enquiries/${id}/status`,
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
        "⚠️ updateEnquiryStatus failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ updateEnquiryStatus error:",
      error
    );
    return { success: false };
  }
};
