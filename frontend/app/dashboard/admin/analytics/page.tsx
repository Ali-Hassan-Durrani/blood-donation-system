"use client";

import { ReactNode, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Droplet,
  FileText,
  TrendingUp,
  Calendar,
  Building2,
  Hospital as HospitalIcon,
} from "lucide-react";

interface BarChartProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: ReactNode;
  percentage?: string;
}

type StatColor = "blue" | "purple" | "red" | "green";
type Urgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: StatColor;
  trend?: string;

}

export default function AnalyticsPage() {
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

        const requestsRes = await fetch("http://localhost:3001/blood-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const requestsData = await requestsRes.json();
        setRequests(Array.isArray(requestsData) ? requestsData : []);

        const usersRes = await fetch("http://localhost:3001/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  // Calculate analytics
  const usersByRole = {
    DONOR: users.filter((u) => u.role === "DONOR").length,
    SEEKER: users.filter((u) => u.role === "SEEKER").length,
    BLOOD_BANK: users.filter((u) => u.role === "BLOOD_BANK").length,
    HOSPITAL: users.filter((u) => u.role === "HOSPITAL").length,
  };

  const bloodGroupStats = requests.reduce((acc, req) => {
    const group = req.blood_group;
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const cityStats = requests.reduce((acc, req) => {
    const city = req.city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const urgencyStats = requests.reduce((acc, req) => {
    const urgency = req.urgency;
    acc[urgency] = (acc[urgency] || 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityStats)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  const topBloodGroups = Object.entries(bloodGroupStats)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive overview of system performance
        </p>
      </div>

      {/* Main Stats */}
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
          icon={<Droplet className="h-8 w-8" />}
          color="red"
          trend="+15%"
        />
        <StatCard
          title="Messages"
          value={stats?.contactMessages || 0}
          icon={<Calendar className="h-8 w-8" />}
          color="green"
          trend="+5%"
        />
      </div>

      {/* Request Status Distribution */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Request Status Distribution
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            {["PENDING", "APPROVED", "FULFILLED", "REJECTED", "CANCELLED"].map(
              (status) => {
                const count = requests.filter((r) => r.status === status).length;
                const percentage = requests.length
                  ? ((count / requests.length) * 100).toFixed(1)
                  : 0;
                return (
                  <div
                    key={status}
                    className="text-center p-4 border rounded-lg"
                  >
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 mt-1">{status}</p>
                    <p className="text-xs text-gray-500 mt-1">{percentage}%</p>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bar Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Users by Role */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Users by Role
            </h3>
            <div className="space-y-4">
              <BarChart
                label="Donors"
                value={usersByRole.DONOR}
                max={users.length || 1}
                color="bg-green-600"
                icon={<Droplet className="h-4 w-4" />}
              />
              <BarChart
                label="Seekers"
                value={usersByRole.SEEKER}
                max={users.length || 1}
                color="bg-blue-600"
                icon={<Users className="h-4 w-4" />}
              />
              <BarChart
                label="Blood Banks"
                value={usersByRole.BLOOD_BANK}
                max={users.length || 1}
                color="bg-purple-600"
                icon={<Building2 className="h-4 w-4" />}
              />
              <BarChart
                label="Hospitals"
                value={usersByRole.HOSPITAL}
                max={users.length || 1}
                color="bg-orange-600"
                icon={<HospitalIcon className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Most Requested Blood Groups */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Most Requested Blood Groups
            </h3>
            <div className="space-y-4">
              {topBloodGroups.map(([group, count]: any) => {
                const percentage = requests.length
                  ? ((count / requests.length) * 100).toFixed(1)
                  : 0;
                return (
                  <BarChart
                    key={group}
                    label={group.replace("_", "")}
                    value={count}
                    max={requests.length || 1}
                    color="bg-red-600"
                    icon={<Droplet className="h-4 w-4" />}
                    percentage={`${percentage}%`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Top Cities by Requests
          </h2>
          <div className="space-y-4">
            {topCities.map(([city, count]: any) => {
              const percentage = requests.length
                ? ((count / requests.length) * 100).toFixed(1)
                : 0;
              return (
                <div key={city}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{city}</span>
                    <span className="text-sm text-gray-600">
                      {count} requests ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Urgency Distribution */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Urgency Level Distribution
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((urgency) => {
              const count = requests.filter((r) => r.urgency === urgency).length;
              const percentage = requests.length
                ? ((count / requests.length) * 100).toFixed(1)
                : 0;

              const urgencyColors: Record<Urgency, string> = {
                LOW: "bg-green-100 text-green-800",
                MEDIUM: "bg-yellow-100 text-yellow-800",
                HIGH: "bg-orange-100 text-orange-800",
                CRITICAL: "bg-red-100 text-red-800",
              };

              return (
                <div
                  key={urgency}
                  className={`text-center p-6 border rounded-lg ${urgencyColors[urgency as Urgency]
                    }`}
                >
                  <p className="text-3xl font-bold">{count}</p>
                  <p className="text-sm font-medium mt-1">{urgency}</p>
                  <p className="text-xs mt-1">{percentage}%</p>
                </div>
              );
            })}
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
  trend }: StatCardProps) {
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
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
            <TrendingUp className="h-3 w-3 inline mr-1" />
            {trend}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function BarChart({
  label,
  value,
  max,
  color,
  icon,
  percentage = "" }: BarChartProps) {
  const safeMax = max > 0 ? max : 1;
  const width = Math.min((value / safeMax) * 100, 100);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
        <span className="text-sm text-gray-600">
          {value} {percentage && `(${percentage})`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}