"use client";

import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { FaFacebookF, FaInstagram, FaGoogle, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ContactData = {
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  business_hours: string;
  facebook_url: string;
  instagram_url: string;
  google_url: string;
  map_embed_url: string;
};

export default function DashboardContactPage() {
  const [form, setForm] = useState<ContactData>({
    address: "",
    phone1: "",
    phone2: "",
    email: "",
    business_hours: "",
    facebook_url: "",
    instagram_url: "",
    google_url: "",
    map_embed_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/contact`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setForm(data);
      } catch (err) {
        console.error("Failed to fetch contact details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSuccess("");

      const res = await fetch(`${API_URL}/api/contact`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setSuccess("Contact details updated successfully 🎉");
    } catch {
      alert("Failed to update contact details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 md:p-10">

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Contact Settings
        </h1>
        <p className="text-slate-500 mt-2">
          Update your website contact information
        </p>
      </div>

      <div className="max-w-4xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 md:p-12 transition-all duration-500 hover:shadow-blue-100">

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SOCIAL LINKS */}
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-6">
              Social & Map Links
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Facebook */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaFacebookF className="text-blue-600" />
                  Facebook URL
                </label>
                <input
                  name="facebook_url"
                  value={form.facebook_url}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaInstagram className="text-pink-500" />
                  Instagram URL
                </label>
                <input
                  name="instagram_url"
                  value={form.instagram_url}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Google */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaGoogle className="text-red-500" />
                  Google URL
                </label>
                <input
                  name="google_url"
                  value={form.google_url}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>

              {/* Google Map */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FaMapMarkerAlt className="text-green-600" />
                  Google Map Embed URL
                </label>
                <input
                  name="map_embed_url"
                  value={form.map_embed_url}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
                />
              </div>

            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>

        </form>
      </div>
    </main>
  );
}