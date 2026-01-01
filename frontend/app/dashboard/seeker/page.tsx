"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

export default function SeekerDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    fulfilled: 0,
  });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        // Fetch stats
        const statsRes = await fetch(
          "http://localhost:3001/blood-requests/my/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent requests
        const requestsRes = await fetch(
          "http://localhost:3001/blood-requests/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const requestsData = await requestsRes.json();
        setRecentRequests(
          Array.isArray(requestsData) ? requestsData.slice(0, 5) : []
        );
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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Seeker Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your blood requests and track their status
          </p>
        </div>
        <Link href="/dashboard/seeker/create-request">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={<FileText className="h-8 w-8" />}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock className="h-8 w-8" />}
          color="yellow"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={<CheckCircle className="h-8 w-8" />}
          color="green"
        />
        <StatCard
          title="Fulfilled"
          value={stats.fulfilled}
          icon={<CheckCircle className="h-8 w-8" />}
          color="purple"
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Requests
            </h2>
            <Link
              href="/dashboard/seeker/requests"
              className="text-red-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No requests yet</p>
              <Link href="/dashboard/seeker/create-request">
                <Button className="bg-red-600 hover:bg-red-700">
                  Create Your First Request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((req) => (
                <Link
                  key={req.id}
                  href={`/dashboard/seeker/requests/${req.id}`}
                >
                  <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {req.blood_group?.replace("_", "")} •{" "}
                          {req.units_needed} units
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {req.city} • Needed on{" "}
                          {new Date(req.needed_on).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Contact our support team if you need assistance with your blood
              requests.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Blood Compatibility
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Learn about blood type compatibility and donation requirements.
            </p>
            <Link href="/how-it-works">
              <Button variant="outline">Learn More</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: "blue" | "yellow" | "green" | "purple" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`${colors[color]} p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
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