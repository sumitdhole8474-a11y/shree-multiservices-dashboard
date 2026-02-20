"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!API_URL) {
        throw new Error("API URL not configured");
      }

      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      document.cookie = `admin_token=${data.token}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9E9] relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[55%] h-[35%] bg-[#FFE9D6] rounded-br-[120px]" />
        <div className="absolute right-0 top-0 w-[20%] h-[30%] bg-[#FFEAD6] rounded-bl-full" />
        <div className="absolute right-[15%] bottom-[20%] w-40 h-40 bg-[#F1F1F1] rounded-full" />
        <div className="absolute right-[5%] bottom-[5%] w-72 h-72 bg-[#FFF1CC] rounded-full" />
      </div>

      {/* Login Card */}
      <div className="relative bg-white w-full max-w-5xl rounded-lg shadow-md overflow-hidden z-10">
        <div className="flex flex-col md:flex-row items-center p-10 gap-10">
          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Logo" width={48} height={48} />
            </div>

            <h1 className="text-3xl font-semibold text-gray-800">
              Sign in to Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Use your Login Credentials
            </p>
          </div>

          {/* RIGHT – FORM */}
          <div className="flex-1 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* USERNAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="
                    w-full px-4 py-2.5
                    rounded-lg border border-gray-300
                    text-gray-800 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="
                      w-full px-4 py-2.5 pr-12
                      rounded-lg border border-gray-300
                      text-gray-800 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      appearance-none
                    "
                    required
                  />

                  {/* SINGLE EYE ICON */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#D6E8FF] text-blue-900 font-semibold hover:bg-[#C6DFFF] transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Color Strip */}
        <div className="flex h-1.5 w-full">
          <div className="w-1/3 bg-yellow-400" />
          <div className="w-1/3 bg-blue-700" />
          <div className="w-1/3 bg-red-600" />
        </div>
      </div>
    </div>
  );
}
