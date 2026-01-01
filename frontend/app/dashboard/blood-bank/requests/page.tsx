"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function BloodBankRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const [donors, setDonors] = useState<any[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : null;

  async function loadRequests() {
    const res = await fetch("http://localhost:3001/blood-bank/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function openAssign(request: any) {
    setSelectedRequest(request);
    setOpen(true);
    setLoadingDonors(true);

    try {
      const res = await fetch(
        `http://localhost:3001/blood-bank/donors?blood_group=${request.blood_group}&city=${request.city}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch {
      setDonors([]);
    } finally {
      setLoadingDonors(false);
    }
  }

  async function assignDonor(donorUserId: string) {
    try {
      const scheduled = new Date();
      scheduled.setDate(scheduled.getDate() + 1); // tomorrow

      const res = await fetch("http://localhost:3001/blood-bank/assign-donor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          donor_user_id: donorUserId,
          scheduled_on: scheduled.toISOString(),
          notes: "Please visit blood bank for donation",
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Donor assigned successfully!");
      setOpen(false);
      setSelectedRequest(null);
      await loadRequests();
    } catch {
      toast.error("Failed to assign donor");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pending Blood Requests</h1>

      {requests.length === 0 && <p className="text-gray-500">No pending requests</p>}

      <div className="space-y-3">
        {requests.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {r.blood_group} • {r.units_needed} units
                </p>
                <p className="text-sm text-gray-500">
                  {r.city} • Needed on {new Date(r.needed_on).toLocaleDateString()} • {r.urgency}
                </p>
              </div>

              <Button onClick={() => openAssign(r)}>Assign Donor</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ASSIGN DONOR DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Donor</DialogTitle>
          </DialogHeader>

          {loadingDonors && <p>Loading donors...</p>}

          {!loadingDonors && donors.length === 0 && (
            <p className="text-gray-500">No available donors found</p>
          )}

          <div className="space-y-2">
            {donors.map((d) => (
              <Card key={d.user_id}>
                <CardContent className="p-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{d.users.full_name}</p>
                    <p className="text-xs text-gray-500">
                      {d.users.city} • {d.users.phone}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => assignDonor(d.user_id)}>
                    Assign
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
