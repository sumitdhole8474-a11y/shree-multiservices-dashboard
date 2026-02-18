"use client";

import Link from "next/link";
import {
  Layers,
  Folder,
  Star,
  MessageSquare,
  Briefcase,
  Headphones,
} from "lucide-react";

const icons: any = {
  services: Layers,
  categories: Folder,
  reviews: Star,
  enquiries: MessageSquare,
  careers: Briefcase,
  support: Headphones,
};

type Props = {
  title: string;
  value: number;
  iconKey: keyof typeof icons;
  href: string;
  gradient: string;
};

export default function DashboardCard({
  title,
  value,
  iconKey,
  href,
  gradient,
}: Props) {
  const Icon = icons[iconKey];

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition ${gradient}`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 tracking-wide">
            {title}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </h2>
        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center text-white shadow-lg ${gradient}`}
        >
          <Icon size={26} />
        </div>
      </div>
    </Link>
  );
}
