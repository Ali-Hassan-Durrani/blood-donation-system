"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Droplet, Calendar, Scale, FileText } from "lucide-react";

export default function DonorProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    blood_group: "",
    date_of_birth: "",
    weight_kg: "",
    medical_notes: "",
  });

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        const userRes = await fetch("http://localhost:3001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        const profileRes = await fetch("http://localhost:3001/donor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (profileRes.ok) {
          const text = await profileRes.text();
          const profileData = text ? JSON.parse(text) : null;

          if (profileData) {
            setProfile(profileData);
            setFormData({
              blood_group: profileData.blood_group,
              date_of_birth: new Date(profileData.date_of_birth)
                .toISOString()
                .split("T")[0],
              weight_kg: profileData.weight_kg.toString(),
              medical_notes: profileData.medical_notes || "",
            });
          } else {
            // profile does not exist yet → show form
            setEditing(true);
          }
        } else {
          setEditing(true);
        }

      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const method = profile ? "PATCH" : "POST";
      const res = await fetch("http://localhost:3001/donor/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          weight_kg: parseFloat(formData.weight_kg),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      setProfile(data);
      toast.success("Profile saved successfully");
      setEditing(false);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Failed to save profile");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donor Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your donor information and preferences
        </p>
      </div>

      {/* User Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem icon={<User />} label="Full Name" value={user?.full_name} />
            <InfoItem label="Email" value={user?.email} />
            <InfoItem label="Phone" value={user?.phone} />
            <InfoItem label="City" value={user?.city} />
          </div>
        </CardContent>
      </Card>

      {/* Donor Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Donor Information
            </h2>
            {profile && !editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="blood_group">Blood Group *</Label>
                <Select
                  value={formData.blood_group}
                  onValueChange={(value) =>
                    setFormData({ ...formData, blood_group: value })
                  }
                >
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

              <div>
                <Label htmlFor="date_of_birth">Date of Birth *</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="weight_kg">Weight (kg) *</Label>
                <Input
                  id="weight_kg"
                  type="number"
                  min="50"
                  step="0.01"
                  value={formData.weight_kg}
                  onChange={(e) =>
                    setFormData({ ...formData, weight_kg: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="medical_notes">Medical Notes (Optional)</Label>
                <Textarea
                  id="medical_notes"
                  value={formData.medical_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, medical_notes: e.target.value })
                  }
                  placeholder="Any relevant medical information..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Save Profile
                </Button>
                {profile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          ) : profile ? (
            <div className="space-y-4">
              <InfoItem
                icon={<Droplet />}
                label="Blood Group"
                value={profile.blood_group?.replace("_", "")}
              />
              <InfoItem
                icon={<Calendar />}
                label="Date of Birth"
                value={new Date(profile.date_of_birth).toLocaleDateString()}
              />
              <InfoItem
                icon={<Scale />}
                label="Weight"
                value={`${profile.weight_kg} kg`}
              />
              {profile.last_donation_date && (
                <InfoItem
                  icon={<Calendar />}
                  label="Last Donation"
                  value={new Date(profile.last_donation_date).toLocaleDateString()}
                />
              )}
              {profile.medical_notes && (
                <InfoItem
                  icon={<FileText />}
                  label="Medical Notes"
                  value={profile.medical_notes}
                />
              )}
              <InfoItem
                label="Availability Status"
                value={
                  profile.is_available ? (
                    <span className="text-green-600 font-medium">Available</span>
                  ) : (
                    <span className="text-gray-500">Not Available</span>
                  )
                }
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      {icon && <div className="text-red-600 mt-1">{icon}</div>}
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}