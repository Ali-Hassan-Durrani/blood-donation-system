"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AvailabilityPage() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token =
          localStorage.getItem("token") || localStorage.getItem("access_token");

        if (!token) {
          toast.error("You are not logged in");
          return;
        }

        const res = await fetch("http://localhost:3001/donor/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 404) {
          setHasProfile(false);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();
        setAvailable(Boolean(data?.is_available));
        setHasProfile(true);
      } catch (error) {
        console.error("Load error:", error);
        toast.error("Failed to load availability");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function toggleAvailability(value: boolean) {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      
      if (!token) {
        toast.error("Not logged in");
        return;
      }

      const res = await fetch("http://localhost:3001/donor/availability", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_available: value }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update");
      }

      const data = await res.json();
      setAvailable(data.is_available);
      toast.success(`You are now ${value ? "available" : "unavailable"} for donations`);
    } catch (error: any) {
      console.error("Toggle error:", error);
      toast.error(error.message || "Failed to update availability");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!hasProfile) {
    return (
      <Card className="max-w-xl">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                Profile Required
              </h2>
              <p className="text-gray-600 mb-4">
                Please create your donor profile first before managing availability.
              </p>
              <Link href="/dashboard/donor/profile">
                <Button className="bg-red-600 hover:bg-red-700">
                  Create Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donation Availability</h1>
        <p className="text-gray-600 mt-1">
          Manage your availability for blood donations
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg text-gray-900 mb-2">
                {available ? "You are Available" : "You are Not Available"}
              </h2>
              <p className="text-sm text-gray-600">
                {available
                  ? "Blood banks can see you as an available donor and may contact you for donations."
                  : "You won't appear in available donor lists. Toggle on when ready to donate."}
              </p>
            </div>
            <Switch
              checked={available}
              onCheckedChange={toggleAvailability}
              className="data-[state=checked]:bg-green-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardContent className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Important Notes</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• You must wait 90 days between donations</li>
            <li>• Blood banks can see your availability status</li>
            <li>• You can toggle availability anytime</li>
            <li>• Your availability persists across sessions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}