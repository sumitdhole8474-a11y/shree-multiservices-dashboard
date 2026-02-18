const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getDashboardStats = async () => {
  try {
    if (!API_URL) {
      console.warn("⚠️ NEXT_PUBLIC_API_URL not defined");
      return null;
    }

    const res = await fetch(`${API_URL}/api/dashboard`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(
        "⚠️ getDashboardStats failed:",
        res.status
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error(
      "❌ getDashboardStats error:",
      error
    );
    return null;
  }
};
