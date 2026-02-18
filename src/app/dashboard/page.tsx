import { getDashboardStats } from "../services/dashboard.service";
import {
  Briefcase,
  Layers,
  MessageSquare,
  Star,
  Headphones,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

type DashboardStats = {
  services: number;
  categories: number;
  reviews: number;
  enquiries: number;
  support: number;
  blogs: number;
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const safeStats: DashboardStats = {
    services: stats?.services ?? 0,
    categories: stats?.categories ?? 0,
    reviews: stats?.reviews ?? 0,
    enquiries: stats?.enquiries ?? 0,
    support: stats?.support ?? 0,
    blogs: stats?.blogs ?? 0,
  };

  const isOffline = !stats;

  return (
    <div className="space-y-8">
      {/* --- Header --- */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Overview of your platform activity
        </p>

        {isOffline && (
          <p className="mt-2 text-sm text-red-500">
            Backend unavailable. Showing cached / fallback data.
          </p>
        )}
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          title="Total Services"
          value={safeStats.services}
          icon={<Briefcase size={24} />}
          href="/dashboard/service-page"
          color="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Categories"
          value={safeStats.categories}
          icon={<Layers size={24} />}
          href="/dashboard/categories"
          color="bg-purple-50 text-purple-600"
        />

        <StatCard
          title="Reviews"
          value={safeStats.reviews}
          icon={<Star size={24} />}
          href="/dashboard/reviews"
          color="bg-yellow-50 text-yellow-600"
        />

        <StatCard
          title="Enquiries"
          value={safeStats.enquiries}
          icon={<MessageSquare size={24} />}
          href="/dashboard/enquiries"
          color="bg-green-50 text-green-600"
        />

        <StatCard
          title="Support"
          value={safeStats.support}
          icon={<Headphones size={24} />}
          href="/dashboard/support"
          color="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          title="Blogs"
          value={safeStats.blogs}
          icon={<BookOpen size={24} />}
          href="/dashboard/blog"
          color="bg-rose-50 text-rose-600"
        />
      </div>
    </div>
  );
}

/* --- Stat Card Component --- */
function StatCard({
  title,
  value,
  icon,
  href,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900">
          {value}
        </h3>
      </div>
    </Link>
  );
}
