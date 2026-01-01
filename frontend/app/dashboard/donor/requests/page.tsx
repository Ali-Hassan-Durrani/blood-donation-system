"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

export default function DonationRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:3001/donations/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to load");
      }

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleAccept(donationId: string) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:3001/donations/${donationId}/accept`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to accept");

      toast.success("Donation accepted");
      await loadRequests();
    } catch (error) {
      toast.error("Failed to accept donation");
    }
  }

  async function handleReject(donationId: string) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:3001/donations/${donationId}/reject`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to reject");

      toast.success("Donation rejected");
      await loadRequests();
    } catch (error) {
      toast.error("Failed to reject donation");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donation Requests</h1>
        <p className="text-gray-600 mt-1">
          Manage incoming donation requests from blood banks
        </p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No donation requests</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-2">
                      Donation Request
                    </p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <strong>Scheduled:</strong>{" "}
                        {new Date(r.scheduled_on).toLocaleString()}
                      </p>
                      {r.blood_requests && (
                        <>
                          <p>
                            <strong>Blood Group:</strong>{" "}
                            {r.blood_requests.blood_group?.replace("_", "")}
                          </p>
                          <p>
                            <strong>Location:</strong> {r.blood_requests.city}
                          </p>
                        </>
                      )}
                      {r.notes && (
                        <p className="mt-2 bg-gray-50 p-2 rounded">
                          <strong>Note:</strong> {r.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(r.id)}
                    >
                      Reject
                    </Button>
                    <Button size="sm" onClick={() => handleAccept(r.id)}>
                      Accept
                    </Button>
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