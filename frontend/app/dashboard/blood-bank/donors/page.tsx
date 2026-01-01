"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, User, Phone, MapPin, Droplet, Calendar } from "lucide-react";

export default function AvailableDonorsPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [city, setCity] = useState("");

  async function searchDonors() {
    if (!bloodGroup) {
      toast.error("Please select a blood group");
      return;
    }

    setLoading(true);
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const params = new URLSearchParams();
      params.append("blood_group", bloodGroup);
      if (city) params.append("city", city);

      const res = await fetch(
        `http://localhost:3001/blood-bank/donors?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to load donors");

      const data = await res.json();
      setDonors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search donors");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Donors</h1>
        <p className="text-gray-600 mt-1">
          Search and find available donors by blood group and location
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Blood Group *
              </label>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                City (Optional)
              </label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={searchDonors}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? "Searching..." : "Search Donors"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {donors.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Found {donors.length} Available Donor{donors.length !== 1 ? "s" : ""}
              </h2>
            </div>

            <div className="space-y-4">
              {donors.map((donor) => (
                <Card key={donor.user_id} className="border-l-4 border-l-green-600">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900">
                            {donor.users.full_name}
                          </h3>
                          <Badge className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                          <Badge variant="outline">
                            {donor.blood_group?.replace("_", "")}
                          </Badge>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{donor.users.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{donor.users.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Droplet className="h-4 w-4" />
                            <span>Weight: {donor.weight_kg} kg</span>
                          </div>
                          {donor.last_donation_date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Last: {new Date(donor.last_donation_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {donor.medical_notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Notes:</strong> {donor.medical_notes}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(donor.users.phone);
                          toast.success("Phone number copied!");
                        }}
                      >
                        Copy Phone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {donors.length === 0 && bloodGroup && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No available donors found for the selected criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}