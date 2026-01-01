"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Building2, FileText, MapPin, Shield } from "lucide-react";

export default function HospitalProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    hospital_name: "",
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

        const profileRes = await fetch(
          "http://localhost:3001/hospital/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.ok) {
          const text = await profileRes.text();
          const profileData = text ? JSON.parse(text) : null;

          if (profileData) {
            setProfile(profileData);
            setFormData({
              hospital_name: profileData.hospital_name,
              license_no: profileData.license_no,
              address: profileData.address,
            });
          } else {
            // profile does not exist → show create form
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
      const res = await fetch("http://localhost:3001/hospital/profile", {
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
        <h1 className="text-3xl font-bold text-gray-900">Hospital Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your hospital information
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem label="Email" value={user?.email} />
            <InfoItem label="Phone" value={user?.phone} />
            <InfoItem label="City" value={user?.city} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Hospital Information
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
                <Label htmlFor="hospital_name">Hospital Name *</Label>
                <Input
                  id="hospital_name"
                  value={formData.hospital_name}
                  onChange={(e) =>
                    setFormData({ ...formData, hospital_name: e.target.value })
                  }
                  required
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
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
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
                label="Hospital Name"
                value={profile.hospital_name}
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
              <InfoItem
                icon={<Shield />}
                label="Verification Status"
                value={
                  profile.is_verified ? (
                    <span className="text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="text-yellow-600">Pending Verification</span>
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