const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

/* =============================
   GET CATEGORIES
============================= */
export const getAdminCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/categories`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(
        "⚠️ getAdminCategories failed:",
        res.status
      );
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error(
      "❌ getAdminCategories error:",
      error
    );
    return [];
  }
};

/* =============================
   CREATE CATEGORY
============================= */
export const createCategory = async (
  title: string
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ createCategory failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ createCategory error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   DELETE CATEGORY
============================= */
export const deleteCategory = async (
  id: number
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/categories/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ deleteCategory failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ deleteCategory error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   UPDATE CATEGORY
============================= */
export const updateCategory = async (
  id: number,
  title: string
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ updateCategory failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ updateCategory error:",
      error
    );
    return { success: false };
  }
};

/* =============================
   REORDER CATEGORIES (NEW)
============================= */
export const reorderCategories = async (
  orderedIds: number[]
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/categories/reorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderedIds }),
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ reorderCategories failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ reorderCategories error:",
      error
    );
    return { success: false };
  }
};