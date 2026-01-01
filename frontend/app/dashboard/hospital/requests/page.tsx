"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";

export default function HospitalRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRequests() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        const res = await fetch("http://localhost:3001/hospital/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
          <p className="text-gray-600 mt-1">
            Manage all hospital blood requests
          </p>
        </div>
        <Link href="/dashboard/seeker/create-request">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-blue-600">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Fulfilled</p>
            <p className="text-3xl font-bold text-green-600">
              {requests.filter((r) => r.status === "FULFILLED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No blood requests yet</p>
            <Link href="/dashboard/seeker/create-request">
              <Button className="bg-red-600 hover:bg-red-700">
                Create First Request
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {request.blood_group?.replace("_", "")} •{" "}
                        {request.units_needed} units
                      </h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge variant="outline">{request.urgency}</Badge>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600">
                      <div>
                        <strong>City:</strong> {request.city}
                      </div>
                      <div>
                        <strong>Needed On:</strong>{" "}
                        {new Date(request.needed_on).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Created:</strong>{" "}
                        {new Date(request.created_at).toLocaleDateString()}
                      </div>
                      {request.requested_for_patient_name && (
                        <div>
                          <strong>Patient:</strong>{" "}
                          {request.requested_for_patient_name}
                        </div>
                      )}
                    </div>

                    {request.reason && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-3">
                        <strong>Reason:</strong> {request.reason}
                      </p>
                    )}

                    {request.assigned_blood_bank_id && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ Assigned to Blood Bank
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