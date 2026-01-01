"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, FileText, MapPin, Mail, Phone, User } from "lucide-react";

export default function BloodBankProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    bank_name: "",
    license_no: "",
    address: "",
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

        // Try to fetch blood bank profile
        const profileRes = await fetch(
          "http://localhost:3001/blood-bank/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setFormData({
            bank_name: profileData.bank_name,
            license_no: profileData.license_no,
            address: profileData.address,
          });
        } else {
          setEditing(true);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setEditing(true);
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
      const res = await fetch("http://localhost:3001/blood-bank/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
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
        <h1 className="text-3xl font-bold text-gray-900">Blood Bank Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your blood bank information
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem icon={<User />} label="Contact Name" value={user?.full_name} />
            <InfoItem icon={<Mail />} label="Email" value={user?.email} />
            <InfoItem icon={<Phone />} label="Phone" value={user?.phone} />
            <InfoItem icon={<MapPin />} label="City" value={user?.city} />
          </div>
        </CardContent>
      </Card>

      {/* Blood Bank Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Blood Bank Information
            </h2>
            {profile && !editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {!profile && !editing ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Complete your blood bank profile to access all features
              </p>
              <Button
                onClick={() => setEditing(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Create Profile
              </Button>
            </div>
          ) : editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bank_name">Blood Bank Name *</Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name}
                  onChange={(e) =>
                    setFormData({ ...formData, bank_name: e.target.value })
                  }
                  required
                  placeholder="e.g., City Blood Bank"
                />
              </div>

              <div>
                <Label htmlFor="license_no">License Number *</Label>
                <Input
                  id="license_no"
                  value={formData.license_no}
                  onChange={(e) =>
                    setFormData({ ...formData, license_no: e.target.value })
                  }
                  required
                  placeholder="e.g., BB-12345"
                />
              </div>

              <div>
                <Label htmlFor="address">Complete Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  placeholder="Full address with landmarks"
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
                icon={<Building2 />}
                label="Bank Name"
                value={profile.bank_name}
              />
              <InfoItem
                icon={<FileText />}
                label="License Number"
                value={profile.license_no}
              />
              <InfoItem
                icon={<MapPin />}
                label="Address"
                value={profile.address}
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