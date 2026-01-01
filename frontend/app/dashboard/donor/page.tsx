"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Droplet, Calendar, CheckCircle, Clock, User, Heart } from "lucide-react";

export default function DonorDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });
  const [profile, setProfile] = useState<any>(null);
  const [upcomingDonations, setUpcomingDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        // Fetch stats
        const statsRes = await fetch(
          "http://localhost:3001/donations/my/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const statsData = await statsRes.json();
        setStats({
          total: statsData?.total ?? 0,
          scheduled: statsData?.scheduled ?? 0,
          completed: statsData?.completed ?? 0,
          cancelled: statsData?.cancelled ?? 0,
        });

        // Fetch profile
        const profileRes = await fetch("http://localhost:3001/donor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }

        // Fetch upcoming donations
        const donationsRes = await fetch(
          "http://localhost:3001/donations/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const donationsData = await donationsRes.json();
        setUpcomingDonations(
          Array.isArray(donationsData) ? donationsData.slice(0, 5) : []
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
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your donations and help save lives
          </p>
        </div>
        <Link href="/dashboard/donor/availability">
          <Button className="bg-red-600 hover:bg-red-700">
            Manage Availability
          </Button>
        </Link>
      </div>

      {/* Profile Card */}
      {profile ? (
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <Droplet className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Blood Group: {profile.blood_group?.replace("_", "")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {profile.is_available ? (
                      <span className="text-green-600 font-medium">
                        ✓ Available for Donation
                      </span>
                    ) : (
                      <span className="text-gray-500">Not Available</span>
                    )}
                  </p>
                  {profile.last_donation_date && (
                    <p className="text-sm text-gray-600 mt-1">
                      Last donation:{" "}
                      {new Date(profile.last_donation_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <Link href="/dashboard/donor/profile">
                <Button variant="outline">View Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                Complete Your Donor Profile
              </h3>
              <p className="text-gray-600 mb-4">
                Create your donor profile to start saving lives
              </p>
              <Link href="/dashboard/donor/profile">
                <Button className="bg-red-600 hover:bg-red-700">
                  Create Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations"
          value={stats.total}
          icon={<Heart className="h-8 w-8" />}
          color="red"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Calendar className="h-8 w-8" />}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="h-8 w-8" />}
          color="green"
        />
        <StatCard
          title="Cancelled"
          value={stats.cancelled}
          icon={<Clock className="h-8 w-8" />}
          color="gray"
        />
      </div>

      {/* Upcoming Donations */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Upcoming Donation Requests
            </h2>
            <Link
              href="/dashboard/donor/requests"
              className="text-red-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>

          {upcomingDonations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming donation requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDonations.map((donation) => (
                <div
                  key={donation.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Donation Request
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Scheduled:{" "}
                        {new Date(donation.scheduled_on).toLocaleString()}
                      </p>
                      {donation.blood_requests && (
                        <p className="text-sm text-gray-600">
                          Location: {donation.blood_requests.city}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href="/dashboard/donor/requests">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Impact Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">Your Impact</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lives Potentially Saved</span>
                <span className="text-2xl font-bold text-red-600">
                  {(stats.completed ?? 0) * 3}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Blood Units Donated</span>
                <span className="text-2xl font-bold text-red-600">
                  {stats.completed ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              Donation Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Minimum 90 days between donations</li>
              <li>• Must be at least 18 years old</li>
              <li>• Weight should be above 50 kg</li>
              <li>• Should be in good health</li>
            </ul>
            <Link href="/how-it-works" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: "red" | "blue" | "green" | "gray" }) {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value ?? 0}</p>
          </div>
          <div className={`${colors[color]} p-3 rounded-lg`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}