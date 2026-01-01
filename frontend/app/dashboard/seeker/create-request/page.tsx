"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { getToken } from "@/lib/token";

export default function CreateBloodRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ✅ IMPORTANT: Select values must be state-based
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      requested_for_patient_name:
        (formData.get("patient_name") as string) || null,
      blood_group: bloodGroup,
      units_needed: Number(formData.get("units")),
      city: formData.get("city"),
      needed_on: formData.get("needed_on"),
      urgency: urgency,
      reason: (formData.get("reason") as string) || null,
    };

    if (!payload.blood_group) {
      toast.error("Please select blood group");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/blood-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        toast.error(data.message || "Failed to create request");
        return;
      }

      toast.success("Blood request created successfully");
      router.push("/dashboard/seeker/requests");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create Blood Request</h1>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PATIENT NAME */}
            <div>
              <label className="text-sm font-medium">Patient Name</label>
              <Input name="patient_name" placeholder="Optional" />
            </div>

            {/* BLOOD GROUP */}
            <div>
              <label className="text-sm font-medium">Blood Group *</label>
              <Select onValueChange={setBloodGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A_POS">A+</SelectItem>
                  <SelectItem value="A_NEG">A-</SelectItem>
                  <SelectItem value="B_POS">B+</SelectItem>
                  <SelectItem value="B_NEG">B-</SelectItem>
                  <SelectItem value="AB_POS">AB+</SelectItem>
                  <SelectItem value="AB_NEG">AB-</SelectItem>
                  <SelectItem value="O_POS">O+</SelectItem>
                  <SelectItem value="O_NEG">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* UNITS */}
            <div>
              <label className="text-sm font-medium">Units Required *</label>
              <Input name="units" type="number" min={1} required />
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm font-medium">City *</label>
              <Input name="city" required />
            </div>

            {/* DATE */}
            <div>
              <label className="text-sm font-medium">Needed On *</label>
              <Input name="needed_on" type="date" required />
            </div>

            {/* URGENCY */}
            <div>
              <label className="text-sm font-medium">Urgency *</label>
              <Select defaultValue="MEDIUM" onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REASON */}
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Input name="reason" placeholder="Optional" />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
