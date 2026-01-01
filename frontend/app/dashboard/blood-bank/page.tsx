"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, AlertTriangle, FileText, CheckCircle, Users } from "lucide-react";

export default function BloodBankDashboard() {
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        // Fetch inventory summary
        const inventoryRes = await fetch(
          "http://localhost:3001/blood-bank/inventory-summary",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData);

        // Fetch pending requests
        const requestsRes = await fetch(
          "http://localhost:3001/blood-bank/requests?status=PENDING",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const requestsData = await requestsRes.json();
        setRequests(
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

  const totalUnits = Object.values(inventory).reduce((a, b) => a + b, 0);
  const lowStockGroups = Object.entries(inventory).filter(
    ([_, count]) => count < 5
  );

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
            Blood Bank Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage inventory, requests, and donations
          </p>
        </div>
        <Link href="/dashboard/blood-bank/inventory">
          <Button className="bg-red-600 hover:bg-red-700">
            <Package className="h-4 w-4 mr-2" />
            Manage Inventory
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={<Package className="h-8 w-8" />}
          color="blue"
        />
        <StatCard
          title="Blood Groups"
          value={Object.keys(inventory).length}
          icon={<FileText className="h-8 w-8" />}
          color="purple"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockGroups.length}
          icon={<AlertTriangle className="h-8 w-8" />}
          color="red"
        />
        <StatCard
          title="Pending Requests"
          value={requests.length}
          icon={<Users className="h-8 w-8" />}
          color="yellow"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockGroups.length > 0 && (
        <Card className="border-l-4 border-l-red-600">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">
                  Low Stock Alert
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  The following blood groups have low inventory (less than 5
                  units):
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockGroups.map(([group, count]) => (
                    <div
                      key={group}
                      className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {group.replace("_", "")}: {count} units
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Inventory Summary
            </h2>
            <Link
              href="/dashboard/blood-bank/inventory"
              className="text-red-600 hover:underline text-sm"
            >
              View Details
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(inventory).map(([group, count]) => (
              <div
                key={group}
                className={`p-4 border rounded-lg ${
                  count < 5
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {group.replace("_", "")}
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      count < 5 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {count}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">units available</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Pending Blood Requests
            </h2>
            <Link
              href="/dashboard/blood-bank/requests"
              className="text-red-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {req.blood_group?.replace("_", "")} • {req.units_needed}{" "}
                        units
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {req.city} • Needed on{" "}
                        {new Date(req.needed_on).toLocaleDateString()} •{" "}
                        {req.urgency}
                      </p>
                      {req.users_blood_requests_requester_user_idTousers && (
                        <p className="text-sm text-gray-600">
                          Requester:{" "}
                          {
                            req.users_blood_requests_requester_user_idTousers
                              .full_name
                          }
                        </p>
                      )}
                    </div>
                    <Link href="/dashboard/blood-bank/requests">
                      <Button size="sm">Assign Donor</Button>
                    </Link>
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
            <Package className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Add Inventory</h3>
            <p className="text-gray-600 text-sm mb-4">
              Add new blood units to your inventory
            </p>
            <Link href="/dashboard/blood-bank/inventory">
              <Button variant="outline" className="w-full">
                Add Stock
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Users className="h-10 w-10 text-green-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">View Donors</h3>
            <p className="text-gray-600 text-sm mb-4">
              Find and contact available donors
            </p>
            <Link href="/dashboard/blood-bank/requests">
              <Button variant="outline" className="w-full">
                Browse Donors
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <FileText className="h-10 w-10 text-purple-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">View Donations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Track and manage donation records
            </p>
            <Link href="/dashboard/blood-bank/donations">
              <Button variant="outline" className="w-full">
                View Records
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: "blue" | "purple" | "red" | "yellow" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
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