"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // ✅ ADD
import { Calendar } from "lucide-react";
import { toast } from "sonner"; // ✅ ADD

export default function DonationsPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : null;

  async function fetchDonations() {
    try {
      const res = await fetch("http://localhost:3001/blood-bank/donations", {
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

  useEffect(() => {
    fetchDonations();
  }, []);

  // ✅ NEW: Complete donation handler
  async function completeDonation(donation: any) {
    try {
      const res = await fetch("http://localhost:3001/donations/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          donation_id: donation.id,
          blood_group: donation.blood_group,
          units_collected: 1, // demo default
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Donation completed successfully!");
      await fetchDonations(); // refresh list
    } catch {
      toast.error("Failed to complete donation");
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Donation Records</h1>
        <p className="text-gray-600 mt-1">
          View and manage all donation records
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
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(donation.status)}>
                    {donation.status}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Scheduled:{" "}
                    {new Date(donation.scheduled_on).toLocaleString()}
                  </span>
                </div>

                {donation.completed_at && (
                  <p className="text-sm text-gray-600">
                    Completed:{" "}
                    {new Date(donation.completed_at).toLocaleString()}
                  </p>
                )}

                {donation.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {donation.notes}
                  </p>
                )}

                {/* ✅ COMPLETE BUTTON */}
                {donation.status === "SCHEDULED" && (
                  <Button onClick={() => completeDonation(donation)}>
                    Complete Donation
                  </Button>
                )}
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
    default:
      return "bg-gray-100 text-gray-800";
  }
}
