"use client";

import Image from "next/image";
import { Mail, Phone, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Reduced top padding */}
      <div className="max-w-5xl mx-auto pt-10 pb-20 px-6">
        
        {/* LOGO */}
        <div className="flex justify-center mb-12">
          <Image
            src="/bizonancelogo.png"
            alt="Bizonance Logo"
            width={220}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start max-w-4xl mx-auto">
          
          {/* LEFT - CONTACT INFO */}
          <div className="flex flex-col space-y-8">
            <h2 className="text-xl font-bold text-gray-900">
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#E8F1FF] flex items-center justify-center shrink-0">
                  <Mail className="text-[#3B82F6]" size={22} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">
                    Email
                  </p>
                  <p className="text-gray-600 text-base">
                    info@bizonance.in
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-[#E8F1FF] flex items-center justify-center shrink-0">
                  <Phone className="text-[#3B82F6]" size={22} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">
                    Phone
                  </p>
                  <p className="text-gray-600 text-base">
                    +91 89567 27311
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - FORM */}
          <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Write your query to us
            </h2>

            <form className="space-y-4">
              {/* Email */}
              <div>
                <label className="block mb-1.5 text-gray-700 font-medium text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block mb-1.5 text-gray-700 font-medium text-sm">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block mb-1.5 text-gray-700 font-medium text-sm">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    rows={5}
                    className="w-full rounded-md border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-blue-400 resize-none"
                  />
                  <div className="absolute bottom-2 right-2 opacity-20 pointer-events-none">
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M12 0L0 12M12 6L6 12"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="
                  w-full mt-2 flex items-center justify-center gap-2
                  rounded-lg bg-[#D4E6FF] text-[#304B82]
                  font-semibold py-3.5
                  hover:bg-[#C5DCFF] transition-all
                "
              >
                <Send size={18} className="rotate-[-10deg]" />
                <span>Send Request</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
