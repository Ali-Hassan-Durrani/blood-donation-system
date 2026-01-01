"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";

const BLOOD_GROUPS = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] as const;

const COMPATIBILITY: Record<string, string[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

export default function BloodCompatibilityPage() {
  const [selected, setSelected] = useState<string | null>(null);

  const canDonateTo = selected ? COMPATIBILITY[selected] : [];

  return (
    <div className="container mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <Droplet className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Blood Compatibility Checker
        </h1>
        <p className="mt-3 text-gray-600">
          Select a blood group to see which blood types it can safely donate to.
        </p>
      </div>

      {/* SELECTOR */}
      <div className="mt-12 grid grid-cols-4 md:grid-cols-8 gap-4 justify-center max-w-3xl mx-auto">
        {BLOOD_GROUPS.map((group) => (
          <button
            key={group}
            onClick={() => setSelected(group)}
            className={`rounded-lg border py-3 text-sm font-semibold transition
              ${
                selected === group
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white hover:bg-red-50 border-gray-300"
              }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* RESULT */}
      {selected && (
        <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* CAN DONATE */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-green-600">
                Can Donate To
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {canDonateTo.map((bg) => (
                  <Badge
                    key={bg}
                    className="bg-green-100 text-green-700 hover:bg-green-100"
                  >
                    {bg}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CANNOT DONATE */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-red-600">
                Cannot Donate To
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {BLOOD_GROUPS.filter((bg) => !canDonateTo.includes(bg)).map(
                  (bg) => (
                    <Badge
                      key={bg}
                      className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                      {bg}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}