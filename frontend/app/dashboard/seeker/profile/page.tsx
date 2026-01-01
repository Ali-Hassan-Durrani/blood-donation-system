"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

export default function SeekerProfile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    identity_cnic: "",
    emergency_contact: "",
  });

  useEffect(() => {
    async function fetchData() {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");

      try {
        // Fetch user data
        const userRes = await fetch("http://localhost:3001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // Fetch seeker profile
        const profileRes = await fetch(
          "http://localhost:3001/seeker/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
          setFormData({
            identity_cnic: profileData.identity_cnic || "",
            emergency_contact: profileData.emergency_contact || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:3001/seeker/profile", {
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
      toast.success("Profile created successfully");
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
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
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and settings
        </p>
      </div>

      {/* User Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Account Information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <InfoItem icon={<User />} label="Full Name" value={user?.full_name} />
            <InfoItem icon={<Mail />} label="Email" value={user?.email} />
            <InfoItem icon={<Phone />} label="Phone" value={user?.phone} />
            <InfoItem icon={<MapPin />} label="City" value={user?.city} />
            <InfoItem
              icon={<Calendar />}
              label="Member Since"
              value={new Date(user?.created_at).toLocaleDateString()}
            />
            <InfoItem
              icon={<Shield />}
              label="Role"
              value={user?.role}
            />
          </div>
        </CardContent>
      </Card>

      {/* Seeker Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Seeker Profile
            </h2>
            {profile && !editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>

          {!profile && !editing ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                Complete your seeker profile to access all features
              </p>
              <Button
                onClick={() => setEditing(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Create Profile
              </Button>
            </div>
          ) : editing ? (
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <Label htmlFor="identity_cnic">CNIC (Optional)</Label>
                <Input
                  id="identity_cnic"
                  value={formData.identity_cnic}
                  onChange={(e) =>
                    setFormData({ ...formData, identity_cnic: e.target.value })
                  }
                  placeholder="xxxxx-xxxxxxx-x"
                />
              </div>

              <div>
                <Label htmlFor="emergency_contact">
                  Emergency Contact (Optional)
                </Label>
                <Input
                  id="emergency_contact"
                  value={formData.emergency_contact}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact: e.target.value,
                    })
                  }
                  placeholder="+92 3xx xxxxxxx"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700"
                >
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
          ) : (
            <div className="space-y-4">
              <InfoItem
                label="CNIC"
                value={profile?.identity_cnic || "Not provided"}
              />
              <InfoItem
                label="Emergency Contact"
                value={profile?.emergency_contact || "Not provided"}
              />
            </div>
          )}
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