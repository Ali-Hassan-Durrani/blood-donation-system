"use client";

import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Droplet,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  HeartPulse,
  Building2,
  Hospital as HospitalIcon,
  BarChart,
  Shield,
} from "lucide-react";

/* =====================================================
   TYPES
===================================================== */
/* ---------- UI TYPES ---------- */

type StatColor = "blue" | "purple" | "red" | "green";
type StatusColor = "yellow" | "blue" | "green" | "red";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: StatColor;
  trend?: string;
}

interface StatusCardProps {
  label: string;
  count: number;
  icon: ReactNode;
  color: StatusColor;
}

interface RoleCardProps {
  label: string;
  count: number;
  icon: ReactNode;
  color: "green" | "blue" | "purple" | "orange";
}

interface HealthCardProps {
  label: string;
  value: string;
  status: "good" | "warning" | "error";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        const statsRes = await fetch("http://localhost:3001/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        setStats(statsData);

        const reqRes = await fetch("http://localhost:3001/blood-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        const usersRes = await fetch("http://localhost:3001/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const fulfilledRequests = requests.filter((r) => r.status === "FULFILLED").length;
  const rejectedRequests = requests.filter((r) => r.status === "REJECTED").length;

  const usersByRole = {
    DONOR: users.filter((u) => u.role === "DONOR").length,
    SEEKER: users.filter((u) => u.role === "SEEKER").length,
    BLOOD_BANK: users.filter((u) => u.role === "BLOOD_BANK").length,
    HOSPITAL: users.filter((u) => u.role === "HOSPITAL").length,
  };

  const recentRequests = requests
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const activeUsers = users.filter((u) => u.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage the entire VitaFlow system
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/users">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link href="/dashboard/admin/analytics">
            <Button className="bg-red-600 hover:bg-red-700">
              <BarChart className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert for Pending Requests */}
      {pendingRequests > 0 && (
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">
                Action Required: {pendingRequests} Pending Request
                {pendingRequests !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-gray-600">
                Review and approve blood requests to help those in need
              </p>
            </div>
            <Link href="/dashboard/admin/requests">
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                Review Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.users || 0}
          icon={<Users className="h-8 w-8" />}
          color="blue"
          trend="+12%"
        />
        <StatCard
          title="Blood Requests"
          value={stats?.bloodRequests || 0}
          icon={<FileText className="h-8 w-8" />}
          color="purple"
          trend="+8%"
        />
        <StatCard
          title="Donations"
          value={stats?.donations || 0}
          icon={<HeartPulse className="h-8 w-8" />}
          color="red"
          trend="+15%"
        />
        <StatCard
          title="Messages"
          value={stats?.contactMessages || 0}
          icon={<Activity className="h-8 w-8" />}
          color="green"
          trend="+5%"
        />
      </div>

      {/* Request Status Overview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Request Status Overview
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <StatusCard
              label="Pending"
              count={pendingRequests}
              icon={<Clock className="h-5 w-5" />}
              color="yellow"
            />
            <StatusCard
              label="Approved"
              count={approvedRequests}
              icon={<CheckCircle className="h-5 w-5" />}
              color="blue"
            />
            <StatusCard
              label="Fulfilled"
              count={fulfilledRequests}
              icon={<CheckCircle className="h-5 w-5" />}
              color="green"
            />
            <StatusCard
              label="Rejected"
              count={rejectedRequests}
              icon={<XCircle className="h-5 w-5" />}
              color="red"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Role Distribution */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Distribution</h2>
            <Link
              href="/dashboard/admin/analytics"
              className="text-red-600 hover:underline text-sm"
            >
              View Detailed Analytics
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <RoleCard
              label="Donors"
              count={usersByRole.DONOR}
              icon={<Droplet className="h-6 w-6" />}
              color="green"
            />
            <RoleCard
              label="Seekers"
              count={usersByRole.SEEKER}
              icon={<Users className="h-6 w-6" />}
              color="blue"
            />
            <RoleCard
              label="Blood Banks"
              count={usersByRole.BLOOD_BANK}
              icon={<Building2 className="h-6 w-6" />}
              color="purple"
            />
            <RoleCard
              label="Hospitals"
              count={usersByRole.HOSPITAL}
              icon={<HospitalIcon className="h-6 w-6" />}
              color="orange"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Requests */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Blood Requests
              </h2>
              <Link
                href="/dashboard/admin/requests"
                className="text-red-600 hover:underline text-sm"
              >
                View All
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No recent requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {req.blood_group?.replace("_", "")} • {req.units_needed} units
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {req.city} • {req.urgency}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/dashboard/admin/users">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-3" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/dashboard/admin/requests">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-3" />
                  Review Requests
                </Button>
              </Link>
              <Link href="/dashboard/admin/analytics">
                <Button className="w-full justify-start" variant="outline">
                  <BarChart className="h-4 w-4 mr-3" />
                  View Analytics
                </Button>
              </Link>
              <Link href="/dashboard/admin/audit">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-3" />
                  Audit Logs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            System Health
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <HealthCard
              label="Active Users"
              value={`${activeUsers}/${users.length}`}
              status="good"
            />
            <HealthCard
              label="Pending Reviews"
              value={pendingRequests.toString()}
              status={pendingRequests > 10 ? "warning" : "good"}
            />
            <HealthCard
              label="System Status"
              value="Operational"
              status="good"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  trend } : StatCardProps) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${colors[color]} p-3 rounded-lg`}>{icon}</div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusCard({ 
  label, 
  count, 
  icon, 
  color } : StatusCardProps) {
  const colors = {
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  );
}

function RoleCard({ 
  label, 
  count, 
  icon, 
  color } : RoleCardProps) {
  const colors = {
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
  };

  const iconColors = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className={`p-6 rounded-lg border ${colors[color]}`}>
      <div className={`${iconColors[color]} mb-3`}>{icon}</div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{count}</p>
    </div>
  );
}

function HealthCard({ 
  label, 
  value, 
  status } : HealthCardProps) {
  const statusColors = {
    good: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{label}</span>
        <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}