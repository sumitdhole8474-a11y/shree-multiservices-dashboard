const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/* ===============================
   TYPES
================================ */
export type Blog = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  cover_image: string | null;
  slug: string;
  content: string;
  created_at: string;
  is_published: boolean;
};

export type CreateBlogPayload = {
  title: string;
  description: string;
  image?: string;
  cover_image?: string;
  slug: string;
  content: string;
};

/* ===============================
   GET ALL BLOGS (ADMIN)
================================ */
export const getAllBlogsAdmin = async (): Promise<Blog[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/blogs`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("⚠️ getAllBlogsAdmin failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getAllBlogsAdmin error:", error);
    return [];
  }
};

/* ===============================
   GET BLOG BY ID (ADMIN)
================================ */
export const getBlogByIdAdmin = async (
  id: string
): Promise<Blog | null> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/blogs/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      console.warn("⚠️ getBlogByIdAdmin failed:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getBlogByIdAdmin error:", error);
    return null;
  }
};

/* ===============================
   CREATE BLOG
================================ */
export const createBlog = async (
  payload: CreateBlogPayload
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn("⚠️ createBlog failed:", res.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ createBlog error:", error);
    return { success: false };
  }
};

/* ===============================
   UPDATE BLOG
================================ */
export const updateBlog = async (
  id: string,
  payload: CreateBlogPayload
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/blogs/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      console.warn("⚠️ updateBlog failed:", res.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ updateBlog error:", error);
    return { success: false };
  }
};

/* ===============================
   DELETE BLOG
================================ */
export const deleteBlog = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/blogs/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      console.warn("⚠️ deleteBlog failed:", res.status);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ deleteBlog error:", error);
    return { success: false };
  }
};

/* ===============================
   HIDE / UNHIDE BLOG
================================ */
export const toggleBlogVisibility = async (
  id: string
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/admin/blogs/${id}/toggle`,
      {
        method: "PATCH",
      }
    );

    if (!res.ok) {
      console.warn(
        "⚠️ toggleBlogVisibility failed:",
        res.status
      );
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error(
      "❌ toggleBlogVisibility error:",
      error
    );
    return { success: false };
  }
};
