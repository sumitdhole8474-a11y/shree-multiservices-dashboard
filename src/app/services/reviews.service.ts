const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* =============================
   TYPES
============================= */

export type AdminReview = {
  id: number;
  name: string;
  mobile: string;
  review: string;
  rating: number;
  is_hidden: boolean;
  created_at: string;
};

export type CreateReviewPayload = {
  name: string;
  mobile: string;
  review: string;
  rating: number;
};

export type ApiResponse = {
  success: boolean;
  message?: string;
};

/* =============================
   CREATE REVIEW (ADMIN)
   Default: Hidden
============================= */
export const createAdminReview = async (
  payload: CreateReviewPayload
): Promise<ApiResponse> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false, message: "API URL not configured" };
    }

    const res = await fetch(`${API_URL}/api/admin/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ createAdminReview failed:", res.status);
      return {
        success: false,
        message: data?.message || "Failed to create review",
      };
    }

    return {
      success: true,
      message: "Review created successfully",
    };
  } catch (error) {
    console.error("❌ createAdminReview error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

/* =============================
   GET ALL REVIEWS (ADMIN)
============================= */
export const getAdminReviews = async (): Promise<AdminReview[]> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return [];
    }

    const res = await fetch(`${API_URL}/api/admin/reviews`, {
      cache: "no-store",
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
   HIDE / UNHIDE REVIEW
============================= */
export const toggleHideReview = async (
  id: number
): Promise<ApiResponse> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { success: false };
    }

    const res = await fetch(
      `${API_URL}/api/admin/reviews/${id}/toggle`, // make sure backend route matches
      {
        method: "PATCH",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ toggleHideReview failed:", res.status);
      return {
        success: false,
        message: data?.message || "Failed to update review",
      };
    }

    return {
      success: true,
      message: "Review status updated",
    };
  } catch (error) {
    console.error("❌ toggleHideReview error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

/* =============================
   DELETE REVIEW
============================= */
export const deleteReview = async (
  id: number
): Promise<ApiResponse> => {
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

    const data = await res.json();

    if (!res.ok) {
      console.warn("⚠️ deleteReview failed:", res.status);
      return {
        success: false,
        message: data?.message || "Failed to delete review",
      };
    }

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("❌ deleteReview error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};