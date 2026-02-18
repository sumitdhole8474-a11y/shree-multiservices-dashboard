const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ================================
   ADMIN LOGIN
================================ */
export const adminLogin = async (
  username: string,
  password: string
): Promise<{ token?: string; message?: string }> => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return { message: "API URL not configured" };
    }

    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { message: data.message || "Login failed" };
    }

    return data; // { token }
  } catch (error) {
    console.error("❌ adminLogin error:", error);
    return { message: "Something went wrong" };
  }
};
