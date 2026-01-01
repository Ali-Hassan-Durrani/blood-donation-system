"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type Request = {
  id: string;
  blood_group: string;
  units_needed: number;
  city: string;
  status: string;
  urgency: string;
  needed_on: string;
};

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("http://localhost:3001/blood-requests/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.requests)) {
        setRequests(data.requests);
      } else {
        setRequests([]);
      }
    })
    .finally(() => setLoading(false));
}, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">My Blood Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">
          You have not created any blood requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Link
              key={req.id}
              href={`/dashboard/seeker/requests/${req.id}`}
            >
              <Card className="hover:shadow-md transition">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {req.blood_group} • {req.units_needed} units
                    </p>
                    <p className="text-sm text-gray-600">
                      {req.city} • Needed on{" "}
                      {new Date(req.needed_on).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="outline">{req.urgency}</Badge>
                    <Badge
                      className={
                        req.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : req.status === "APPROVED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}