"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Hospital, FileText, Calendar, Plus, Activity } from "lucide-react";

export default function HospitalDashboard() {
  const [stats, setStats] = useState({ requests: 0, donations: 0 });
  const [profile, setProfile] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        const profileRes = await fetch(
          "http://localhost:3001/hospital/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        const requestsRes = await fetch(
          "http://localhost:3001/hospital/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const requests = await requestsRes.json();
        const requestsArray = Array.isArray(requests) ? requests : [];

        const donationsRes = await fetch(
          "http://localhost:3001/hospital/donations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const donations = await donationsRes.json();

        setStats({
          requests: requestsArray.length,
          donations: Array.isArray(donations) ? donations.length : 0,
        });
        setRecentRequests(requestsArray.slice(0, 5));
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hospital Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hospital blood requests and donation records
          </p>
        </div>
        {profile && (
          <Link href="/dashboard/hospital/create-request">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </Link>
        )}
      </div>

      {!profile ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Hospital className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">
              Complete Your Hospital Profile
            </h3>
            <p className="text-gray-600 mb-4">
              Create your hospital profile to start managing blood requests
            </p>
            <Link href="/dashboard/hospital/profile">
              <Button className="bg-red-600 hover:bg-red-700">
                Create Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-l-4 border-l-red-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {profile.hospital_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    License: {profile.license_no}
                  </p>
                  <p className="text-sm text-gray-600">{profile.address}</p>
                  {profile.is_verified && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <Link href="/dashboard/hospital/profile">
                  <Button variant="outline">View Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard
              title="Blood Requests"
              value={stats.requests}
              icon={<FileText className="h-8 w-8" />}
              color="blue"
            />
            <StatCard
              title="Pending"
              value={
                recentRequests.filter((r) => r.status === "PENDING").length
              }
              icon={<Activity className="h-8 w-8" />}
              color="yellow"
            />
            <StatCard
              title="Fulfilled"
              value={
                recentRequests.filter((r) => r.status === "FULFILLED").length
              }
              icon={<FileText className="h-8 w-8" />}
              color="green"
            />
            <StatCard
              title="Donation Records"
              value={stats.donations}
              icon={<Calendar className="h-8 w-8" />}
              color="purple"
            />
          </div>

          {/* Recent Requests */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Blood Requests
                </h2>
                <Link
                  href="/dashboard/hospital/requests"
                  className="text-red-600 hover:underline text-sm"
                >
                  View All
                </Link>
              </div>

              {recentRequests.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No requests yet</p>
                  <Link href="/dashboard/hospital/create-request">
                    <Button className="bg-red-600 hover:bg-red-700">
                      Create First Request
                    </Button>
                  </Link>
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
                            {req.blood_group?.replace("_", "")} •{" "}
                            {req.units_needed} units
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {req.city} • Needed on{" "}
                            {new Date(req.needed_on).toLocaleDateString()} •{" "}
                            {req.urgency}
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
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Create Blood Request
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Submit a new blood request for your hospital
                </p>
                <Link href="/dashboard/hospital/create-request">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Create Request
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  View All Requests
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage all your hospital blood requests
                </p>
                <Link href="/dashboard/hospital/requests">
                  <Button variant="outline" className="w-full">
                    View Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Calendar className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">
                  Donation Records
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  View all donation records for your hospital
                </p>
                <Link href="/dashboard/hospital/donations">
                  <Button variant="outline" className="w-full">
                    View Donations
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
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