"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ------------------ helpers ------------------ */

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatEnum(value?: string | null) {
  if (!value) return "—";
  return value.replace(/_/g, " ");
}

/* ------------------ UI row ------------------ */

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between py-3 border-b last:border-b-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}

/* ------------------ page ------------------ */

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequest() {
      const token = getToken();
      if (!token) {
        toast.error("You are not logged in");
        router.push("/auth/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3001/blood-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Failed to load request");
          return;
        }

        setRequest(data);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadRequest();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-gray-600">
        Loading request details…
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-gray-600">
        Request not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.back()}
      >
        ← Back
      </Button>

      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Request Details</h1>

          <Row
            label="Patient Name"
            value={request.requested_for_patient_name || "—"}
          />
          <Row
            label="Blood Group"
            value={formatEnum(request.blood_group)}
          />
          <Row
            label="Units Required"
            value={request.units_needed}
          />
          <Row label="City" value={request.city} />
          <Row
            label="Needed On"
            value={formatDate(request.needed_on)}
          />
          <Row
            label="Urgency"
            value={formatEnum(request.urgency)}
          />
          <Row
            label="Status"
            value={formatEnum(request.status)}
          />
          <Row
            label="Reason"
            value={request.reason || "—"}
          />
          <Row
            label="Created At"
            value={formatDate(request.created_at)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
