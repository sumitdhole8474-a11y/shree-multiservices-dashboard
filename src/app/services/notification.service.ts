const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* =============================
   GET NOTIFICATIONS COUNT
============================= */
export const getNotifications = async () => {
  if (!API_URL) return { reviews: 0, enquiries: 0, support: 0, total: 0 };

  const res = await fetch(`${API_URL}/api/admin/notifications`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { reviews: 0, enquiries: 0, support: 0, total: 0 };
  }

  return res.json();
};

/* =============================
   MARK NOTIFICATIONS AS SEEN
============================= */
export const markNotificationsSeen = async (
  type: "reviews" | "enquiries" | "support"
) => {
  if (!API_URL) return false;

  const res = await fetch(
    `${API_URL}/api/admin/notifications/${type}`,
    {
      method: "PATCH",
    }
  );

  return res.ok;
};
