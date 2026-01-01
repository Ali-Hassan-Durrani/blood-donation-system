"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  Droplet,
  User,
  Calendar,
  Package,
  Users,
  Building2,
  Hospital,
  Settings,
  LogOut,
  HeartPulse,
  Bell,
  BarChart,
  Plus,
  Activity,
} from "lucide-react";

export function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    router.push("/auth/login");
  }

  const navigation = getNavigation(role);

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-red-600" />
          <span className="text-xl font-bold text-gray-900">VitaFlow</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}

function getNavigation(role: string) {
  switch (role) {
    case "SEEKER":
      return [
        { href: "/dashboard/seeker", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/seeker/create-request", label: "Create Request", icon: Plus },
        { href: "/dashboard/seeker/requests", label: "My Requests", icon: FileText },
        { href: "/dashboard/seeker/profile", label: "Profile", icon: User },
        { href: "/dashboard/seeker/notifications", label: "Notifications", icon: Bell },
      ];

    case "DONOR":
      return [
        { href: "/dashboard/donor", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/donor/availability", label: "Availability", icon: Droplet },
        { href: "/dashboard/donor/requests", label: "Donation Requests", icon: Calendar },
        { href: "/dashboard/donor/donations", label: "My Donations", icon: FileText },
        { href: "/dashboard/donor/profile", label: "Profile", icon: User },
        { href: "/dashboard/donor/notifications", label: "Notifications", icon: Bell },
      ];

    case "BLOOD_BANK":
      return [
        { href: "/dashboard/blood-bank", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/blood-bank/requests", label: "Requests", icon: FileText },
        { href: "/dashboard/blood-bank/inventory", label: "Inventory", icon: Package },
        { href: "/dashboard/blood-bank/donors", label: "Available Donors", icon: Users },
        { href: "/dashboard/blood-bank/donations", label: "Donations", icon: Calendar },
        { href: "/dashboard/blood-bank/profile", label: "Profile", icon: Building2 },
        { href: "/dashboard/blood-bank/notifications", label: "Notifications", icon: Bell },
      ];

    case "HOSPITAL":
      return [
        { href: "/dashboard/hospital", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/hospital/create-request", label: "Create Request", icon: Plus },
        { href: "/dashboard/hospital/requests", label: "Blood Requests", icon: FileText },
        { href: "/dashboard/hospital/profile", label: "Profile", icon: Hospital },
        { href: "/dashboard/hospital/notifications", label: "Notifications", icon: Bell },
      ];

    case "ADMIN":
      return [
        { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/admin/users", label: "Users", icon: Users },
        { href: "/dashboard/admin/requests", label: "All Requests", icon: FileText },
        { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart },
        { href: "/dashboard/admin/audit", label: "Audit Logs", icon: Activity },
      ];

    default:
      return [];
  }
}