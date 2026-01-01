"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building2 } from "lucide-react";

export default function DonationsHistoryPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonations() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        const res = await fetch("http://localhost:3001/donations/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDonations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDonations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading donations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
        <p className="text-gray-600 mt-1">
          View your complete donation history and records
        </p>
      </div>

      {donations.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No donation records yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(donation.status)}>
                        {donation.status}
                      </Badge>
                      {donation.completed_at && (
                        <span className="text-sm text-gray-600">
                          Completed on{" "}
                          {new Date(donation.completed_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Scheduled:{" "}
                          {new Date(donation.scheduled_on).toLocaleString()}
                        </span>
                      </div>

                      {donation.blood_bank_id && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          <span>Blood Bank</span>
                        </div>
                      )}
                    </div>

                    {donation.notes && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        <strong>Note:</strong> {donation.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "SCHEDULED":
      return "bg-blue-100 text-blue-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "NO_SHOW":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}