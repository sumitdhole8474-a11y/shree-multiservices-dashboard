const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getContactDetails = async () => {
  const res = await fetch(`${API_URL}/api/contact`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch contact");
  return res.json();
};

export const updateContactDetails = async (data: any) => {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update contact");
  return res.json();
};