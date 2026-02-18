"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Folder,
  Star,
  MessageSquare,
  Briefcase,
  Headphones,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Folder },
  { name: "Services", href: "/service-page", icon: Layers },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Enquiries", href: "/enquiries", icon: MessageSquare },
  { name: "Careers", href: "/careers", icon: Briefcase },
  { name: "Support", href: "/support", icon: Headphones },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      {/* Logo */}
      <div className="h-16 px-4 flex items-center gap-3 border-b">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <span className="sr-only">Menu</span>
        </button>

        <div className="relative h-9 w-9 rounded-full overflow-hidden border">
          <Image
            src="/logo.png"
            alt="Shree Multiservices"
            fill
            className="object-cover"
          />
        </div>

        <span className="text-sm font-semibold leading-tight text-gray-800">
          Shree <br /> Multiservices
        </span>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
