"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LayoutDashboard,
  Layers,
  Briefcase,
  Star,
  MessageSquare,
  Headphones,
  BookOpen,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Phone,
} from "lucide-react";
import logoImg from "@/assets/Logo.png";

import {
  getNotifications,
  markNotificationsSeen,
} from "@/app/services/notification.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [notifications, setNotifications] = useState({
    reviews: 0,
    enquiries: 0,
    support: 0,
    total: 0,
  });

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => setIsSidebarExpanded((v) => !v);

  /* =============================
     🔒 AUTO LOGOUT ON TAB CLOSE
  ============================= */
  useEffect(() => {
    const handleTabClose = () => {
      document.cookie =
        "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      localStorage.removeItem("admin_token");
    };

    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  /* =============================
     LOAD NOTIFICATIONS
  ============================= */
  useEffect(() => {
    const loadNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  /* =============================
     CLICK OUTSIDE HANDLER
  ============================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showNotifications &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        showProfileMenu &&
        profileRef.current &&
        !profileRef.current.contains(event.target as Node) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showProfileMenu]);

  /* =============================
     LOGOUT CONFIRM
  ============================= */
  const confirmLogout = () => {
    document.cookie =
      "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    localStorage.removeItem("admin_token");
    router.replace("/admin-login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Categories", path: "/dashboard/categories", icon: <Layers size={20} /> },
    { name: "Services", path: "/dashboard/service-page", icon: <Briefcase size={20} /> },
    { name: "Blog", path: "/dashboard/blog", icon: <BookOpen size={20} /> },
    { name: "Reviews", path: "/dashboard/reviews", icon: <Star size={20} /> },
    { name: "Enquiries", path: "/dashboard/enquiries", icon: <MessageSquare size={20} /> },
    { name: "Support", path: "/dashboard/support", icon: <Headphones size={20} /> },
    { name: "Contact", path: "/dashboard/contact", icon: <Phone size={20} /> },
    { name: "Help Center", path: "/dashboard/help-centre", icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      {/* ================= TOPBAR ================= */}
      <header className="h-16 bg-white shadow-sm fixed top-0 w-full z-50 flex flex-col">
        <div className="flex-1 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-600"
            >
              <Menu size={24} />
            </button>

            <div className="relative h-9 w-9 rounded-full overflow-hidden border border-gray-200">
              <Image
                src={logoImg}
                alt="Shree Multiservices"
                fill
                className="object-cover"
              />
            </div>

            <span className="text-sm font-semibold leading-tight text-gray-800 hidden sm:block">
              Shree <br /> Multiservices
            </span>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button
                ref={notificationButtonRef}
                onClick={() => setShowNotifications((v) => !v)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Bell size={20} />
                {notifications.total > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-600 text-white rounded-full border border-white">
                    {notifications.total > 99 ? "99+" : notifications.total}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border z-50"
                >
                  <div className="px-4 py-3 border-b font-semibold text-gray-800">
                    Notifications
                  </div>

                  <button
                    onClick={async () => {
                      await markNotificationsSeen("reviews");
                      setShowNotifications(false);
                      router.push("/dashboard/reviews");
                    }}
                    className="w-full px-4 py-3 flex justify-between hover:bg-gray-50 text-sm"
                  >
                    Reviews
                    {notifications.reviews > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {notifications.reviews}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      await markNotificationsSeen("enquiries");
                      setShowNotifications(false);
                      router.push("/dashboard/enquiries");
                    }}
                    className="w-full px-4 py-3 flex justify-between hover:bg-gray-50 text-sm"
                  >
                    Enquiries
                    {notifications.enquiries > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {notifications.enquiries}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      await markNotificationsSeen("support");
                      setShowNotifications(false);
                      router.push("/dashboard/support");
                    }}
                    className="w-full px-4 py-3 flex justify-between hover:bg-gray-50 text-sm"
                  >
                    Support
                    {notifications.support > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        {notifications.support}
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={() => setShowProfileMenu((v) => !v)}
                className="p-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 hover:bg-orange-200 transition"
              >
                <User size={18} />
              </button>

              {showProfileMenu && (
                <div
                  ref={profileRef}
                  className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-xl border z-50"
                >
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-1 flex w-full">
          <div className="w-1/3 bg-yellow-400"></div>
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-red-500"></div>
        </div>
      </header>

      <div className="flex pt-16 h-screen overflow-hidden">
        <aside
          className={`bg-white border-r border-gray-200 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out z-40 ${
            isSidebarExpanded ? "w-56" : "w-16"
          } hidden md:flex flex-col`}
        >
          <nav className="py-4 space-y-1 flex flex-col pr-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`group flex items-center transition-all duration-300 relative hover:-translate-y-[2px] hover:shadow-sm ${
                    isSidebarExpanded
                      ? "px-5 py-2.5 gap-3 w-full rounded-r-full"
                      : "p-2.5 justify-center w-full rounded-full ml-2"
                  } ${
                    isActive
                      ? "bg-blue-100/50 text-blue-700 font-semibold"
                      : "text-slate-600 hover:bg-gray-100/80 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`shrink-0 ${
                      isActive ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    {item.icon}
                  </div>

                  <span
                    className={`text-sm font-medium whitespace-nowrap ${
                      isSidebarExpanded ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto bg-gray-50 w-full p-6 relative">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Do you want to logout the
            </h3>
            <p className="text-gray-600 mt-1">
              Shree Multiservices Dashboard?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}