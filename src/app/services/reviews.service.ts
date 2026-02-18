const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* =============================
   GET ALL REVIEWS (ADMIN)
============================= */
export const getAdminReviews = async () => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return [];
    }

    const res = await fetch(`${API_URL}/api/admin/reviews`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(
        "⚠️ getAdminReviews failed:",
        res.status
      );
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error(
      "❌ getAdminReviews error:",
      error
    );
    return [];
  }
};

/* =============================
   DELETE REVIEW
============================= */
export const deleteReview = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/reviews/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ deleteReview failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ deleteReview error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   HIDE / UNHIDE REVIEW
============================= */
export const toggleHideReview = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/reviews/${id}/hide`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ toggleHideReview failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ toggleHideReview error:",
      error
    );
    return { success: false };
  }
};
