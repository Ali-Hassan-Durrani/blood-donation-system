"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function HospitalCreateRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("MEDIUM");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (!token) {
      toast.error("You are not logged in");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      requested_for_patient_name: (formData.get("patient_name") as string) || null,
      blood_group: bloodGroup,
      units_needed: Number(formData.get("units")),
      city: formData.get("city"),
      needed_on: formData.get("needed_on"),
      urgency: urgency,
      reason: (formData.get("reason") as string) || null,
    };

    if (!payload.blood_group) {
      toast.error("Please select blood group");
      setLoading(false);
      return;
    }

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
      router.push("/dashboard/hospital/requests");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Create Blood Request
      </h1>
      <p className="text-gray-600 mb-6">
        Submit a new blood request for your hospital
      </p>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* PATIENT NAME */}
            <div>
              <Label htmlFor="patient_name">Patient Name (Optional)</Label>
              <Input
                id="patient_name"
                name="patient_name"
                placeholder="Enter patient name"
              />
            </div>

            {/* BLOOD GROUP */}
            <div>
              <Label htmlFor="blood_group">Blood Group *</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
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
              <Label htmlFor="units">Units Required *</Label>
              <Input
                id="units"
                name="units"
                type="number"
                min={1}
                required
                placeholder="Enter number of units"
              />
            </div>

            {/* CITY */}
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                name="city"
                required
                placeholder="Enter city name"
              />
            </div>

            {/* DATE */}
            <div>
              <Label htmlFor="needed_on">Needed On *</Label>
              <Input id="needed_on" name="needed_on" type="date" required />
            </div>

            {/* URGENCY */}
            <div>
              <Label htmlFor="urgency">Urgency Level *</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REASON */}
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Enter reason for blood request"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}