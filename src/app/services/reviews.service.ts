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
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("⚠️ getAdminReviews failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getAdminReviews error:", error);
    return [];
  }
};


/* =============================
   CREATE REVIEW (ADMIN)
============================= */
export const createAdminReview = async (data: {
  name: string;
  review: string;
  rating: number;
}): Promise<{
  success: boolean;
  review?: any;
}> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(`${API_URL}/api/admin/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: data.name,
        review: data.review,
        rating: data.rating,
        // ✅ mobile removed
        // ✅ is_hidden handled by backend (always false)
      }),
    });

    const responseData = await res.json();

    if (!res.ok) {
      console.warn("⚠️ createAdminReview failed:", res.status);
      return { success: false };
    }

    return {
      success: true,
      review: responseData.review, // ✅ real DB review
    };
  } catch (error) {
    console.error("❌ createAdminReview error:", error);
    return { success: false };
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
        credentials: "include",
      }
    );

    if (!res.ok) {
      console.warn("⚠️ deleteReview failed:", res.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ deleteReview error:", error);
    return { success: false };
  }
};


/* =============================
   HIDE / UNHIDE REVIEW
============================= */
export const toggleHideReview = async (
  id: number
): Promise<{ success: boolean; is_hidden?: boolean }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/reviews/${id}/hide`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ toggleHideReview failed:", res.status);
      return { success: false };
    }

    return {
      success: true,
      is_hidden: data.is_hidden, // ✅ now returns actual DB state
    };
  } catch (error) {
    console.error("❌ toggleHideReview error:", error);
    return { success: false };
  }
};