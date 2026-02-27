"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@greenacres/ui";
import {
  Users,
  Package,
  FileText,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2,
  Coffee,
  Sparkles,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  getUserCounts,
  getCoffeeCount,
  getInquiryCounts,
  getUsers,
  getInquiries,
} from "@greenacres/db";
import type { User, Inquiry } from "@greenacres/types";

interface DashboardStats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  rejectedUsers: number;
  totalCoffees: number;
  totalInquiries: number;
  pendingInquiries: number;
  completedInquiries: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color: "gold" | "success" | "warning" | "info";
  delay?: number;
}

function StatCard({
  title,
  value,
  icon,
  trend,
  color,
  delay = 0,
}: StatCardProps) {
  const colorClasses = {
    gold: "from-gold/20 to-gold/5 text-gold border-gold/20",
    success: "from-success/20 to-success/5 text-success border-success/20",
    warning: "from-warning/20 to-warning/5 text-warning border-warning/20",
    info: "from-info/20 to-info/5 text-info border-info/20",
  };

  const iconBgClasses = {
    gold: "bg-gradient-to-br from-gold/30 to-gold/10",
    success: "bg-gradient-to-br from-success/30 to-success/10",
    warning: "bg-gradient-to-br from-warning/30 to-warning/10",
    info: "bg-gradient-to-br from-info/30 to-info/10",
  };

  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <Card
        className={`
                card-elevated stat-card overflow-hidden
                bg-gradient-to-br ${colorClasses[color]}
                hover:scale-[1.02] transition-transform duration-300
            `}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`stat-icon ${iconBgClasses[color]}`}>{icon}</div>
            {trend && (
              <div className="flex items-center gap-1 text-xs font-medium text-success">
                <TrendingUp className="w-3 h-3" />
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          <div>
            <p className="text-3xl font-bold text-cream mb-1 font-serif">
              {value.toLocaleString()}
            </p>
            <p className="text-sm text-cream/60">{title}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  stats?: { label: string; value: number }[];
  delay?: number;
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
  stats,
  delay = 0,
}: QuickActionCardProps) {
  return (
    <div
      className="animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <Link href={href} className="block group">
        <Card className="glass-card h-full transition-all duration-300 hover:border-gold/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <ArrowRight className="w-5 h-5 text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-cream text-lg mb-2 group-hover:text-gold transition-colors">
              {title}
            </CardTitle>
            <p className="text-cream/50 text-sm mb-4">{description}</p>
            {stats && (
              <div className="flex gap-4 pt-4 border-t border-gold/10">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-xl font-bold text-gold">{stat.value}</p>
                    <p className="text-xs text-cream/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

interface ActivityItemProps {
  user: User;
  type: "user";
}

function ActivityItem({ user, type }: ActivityItemProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      label: "Pending approval",
    },
    approved: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
      label: "Approved",
    },
    rejected: {
      icon: AlertCircle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      label: "Rejected",
    },
  };

  const config = statusConfig[user.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gold/5 transition-colors group">
      <div
        className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}
      >
        <StatusIcon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-cream font-medium truncate group-hover:text-gold transition-colors">
          {user.companyName || user.email}
        </p>
        <p className="text-cream/50 text-sm">{config.label}</p>
      </div>
      <Link
        href="/dashboard/users"
        className="text-gold/60 hover:text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        View
      </Link>
    </div>
  );
}

interface InquiryItemProps {
  inquiry: Inquiry;
}

function InquiryItem({ inquiry }: InquiryItemProps) {
  const statusConfig: Record<string, { color: string; bg: string }> = {
    new: { color: "text-warning", bg: "bg-warning/10" },
    reviewed: { color: "text-info", bg: "bg-info/10" },
    completed: { color: "text-success", bg: "bg-success/10" },
  };

  const config = statusConfig[inquiry.status] || statusConfig.new;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-gold/5 transition-colors group">
      <div
        className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}
      >
        <FileText className={`w-5 h-5 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-cream font-medium truncate group-hover:text-gold transition-colors">
          {inquiry.coffeeItems?.[0]?.coffeeName || "Coffee Inquiry"}
        </p>
        <p className="text-cream/50 text-sm capitalize">
          {inquiry.status.replace("_", " ")}
        </p>
      </div>
      <Link
        href="/dashboard/inquiries"
        className="text-gold/60 hover:text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
      >
        View
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [userCounts, coffeeCount, inquiryCounts, users, inquiries] =
          await Promise.all([
            getUserCounts(),
            getCoffeeCount(),
            getInquiryCounts(),
            getUsers(),
            getInquiries(),
          ]);

        setStats({
          totalUsers: userCounts.total,
          pendingUsers: userCounts.pending,
          approvedUsers: userCounts.approved,
          rejectedUsers: userCounts.rejected,
          totalCoffees: coffeeCount.total,
          totalInquiries: inquiryCounts.total,
          pendingInquiries: inquiryCounts.new,
          completedInquiries: inquiryCounts.completed,
        });

        setRecentUsers(users.slice(0, 5));
        setRecentInquiries(inquiries.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-forest to-forest-dark flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          </div>
          <p className="text-cream/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="glass-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold text-cream mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-cream/60">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header
        className="mb-6 lg:mb-8 animate-fade-in"
        data-tour="admin-welcome"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-medium uppercase tracking-wider">
            Dashboard
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cream font-serif mb-2">
          Welcome Back
        </h1>
        <p className="text-cream/60 text-sm sm:text-base">
          Here's what's happening with your coffee business today.
        </p>
      </header>

      {/* Stats Grid */}
      <section className="mb-8" data-tour="admin-stats">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<Users className="w-6 h-6" />}
            color="gold"
            delay={100}
          />
          <StatCard
            title="Coffee Products"
            value={stats?.totalCoffees || 0}
            icon={<Coffee className="w-6 h-6" />}
            color="success"
            delay={200}
          />
          <StatCard
            title="Total Inquiries"
            value={stats?.totalInquiries || 0}
            icon={<FileText className="w-6 h-6" />}
            color="info"
            delay={300}
          />
          <StatCard
            title="Pending Approval"
            value={stats?.pendingUsers || 0}
            icon={<Clock className="w-6 h-6" />}
            color="warning"
            delay={400}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-gold" />
          <h2 className="text-xl font-semibold text-cream">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <QuickActionCard
            title="Manage Users"
            description="Review pending approvals and manage buyer accounts"
            href="/dashboard/users"
            icon={<Users className="w-6 h-6" />}
            stats={[
              { label: "Pending", value: stats?.pendingUsers || 0 },
              { label: "Approved", value: stats?.approvedUsers || 0 },
            ]}
            delay={100}
          />
          <QuickActionCard
            title="Coffee Catalog"
            description="Add, edit, or manage your coffee products"
            href="/dashboard/products"
            icon={<Package className="w-6 h-6" />}
            stats={[{ label: "Products", value: stats?.totalCoffees || 0 }]}
            delay={200}
          />
          <QuickActionCard
            title="Inquiries"
            description="View and respond to customer inquiries"
            href="/dashboard/inquiries"
            icon={<FileText className="w-6 h-6" />}
            stats={[
              { label: "Pending", value: stats?.pendingInquiries || 0 },
              { label: "Complete", value: stats?.completedInquiries || 0 },
            ]}
            delay={300}
          />
        </div>
      </section>

      {/* Activity & Inquiries */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="border-b border-gold/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-cream">Recent Users</CardTitle>
                </div>
                <Link
                  href="/dashboard/users"
                  className="text-gold/60 hover:text-gold text-sm font-medium flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              {recentUsers.length > 0 ? (
                <div className="divide-y divide-gold/5">
                  {recentUsers.map((user) => (
                    <ActivityItem key={user.id} user={user} type="user" />
                  ))}
                </div>
              ) : (
                <div className="empty-state py-8">
                  <div className="empty-state-icon">
                    <Users className="w-8 h-8" />
                  </div>
                  <p className="text-cream/60">No users yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: "500ms", animationFillMode: "forwards" }}
        >
          <Card className="glass-card h-full">
            <CardHeader className="border-b border-gold/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-cream">Recent Inquiries</CardTitle>
                </div>
                <Link
                  href="/dashboard/inquiries"
                  className="text-gold/60 hover:text-gold text-sm font-medium flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-2">
              {recentInquiries.length > 0 ? (
                <div className="divide-y divide-gold/5">
                  {recentInquiries.map((inquiry) => (
                    <InquiryItem key={inquiry.id} inquiry={inquiry} />
                  ))}
                </div>
              ) : (
                <div className="empty-state py-8">
                  <div className="empty-state-icon">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-cream/60">No inquiries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
