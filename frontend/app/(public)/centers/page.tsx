import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, MapPin } from "lucide-react";

const CENTERS = [
  {
    name: "Red Crescent Blood Bank",
    city: "Karachi",
    type: "Blood Bank",
  },
  {
    name: "Indus Hospital",
    city: "Karachi",
    type: "Hospital",
  },
  {
    name: "Shaukat Khanum Memorial Hospital",
    city: "Lahore",
    type: "Hospital",
  },
  {
    name: "Pakistan Institute of Medical Sciences (PIMS)",
    city: "Islamabad",
    type: "Hospital",
  },
  {
    name: "Fatmid Foundation Blood Center",
    city: "Rawalpindi",
    type: "Blood Bank",
  },
  {
    name: "Jinnah Hospital",
    city: "Lahore",
    type: "Hospital",
  },
];

export default function CentersPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <Hospital className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Blood Centers & Hospitals
        </h1>
        <p className="mt-3 text-gray-600">
          Verified hospitals and blood banks connected with VitaFlow.
        </p>
      </div>

      {/* CENTERS GRID */}
      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {CENTERS.map((center, index) => (
          <Card key={index} className="hover:shadow-lg transition">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {center.name}
                </h3>
                <Badge
                  className={
                    center.type === "Blood Bank"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }
                >
                  {center.type}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {center.city}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
