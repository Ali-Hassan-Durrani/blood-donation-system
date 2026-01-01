import { Card, CardContent } from "@/components/ui/card";
import { HeartPulse, UserPlus, Hospital, Droplet } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    title: "Register on VitaFlow",
    description:
      "Donors, seekers, hospitals, and blood banks register and create verified profiles.",
  },
  {
    icon: Droplet,
    title: "Blood Request Created",
    description:
      "Seekers or hospitals raise a blood request by selecting blood group, units, and urgency.",
  },
  {
    icon: Hospital,
    title: "Blood Bank Matches",
    description:
      "Blood banks match available donors or inventory using blood group compatibility.",
  },
  {
    icon: HeartPulse,
    title: "Donation & Fulfillment",
    description:
      "Donation is completed, inventory is updated, and the request is marked fulfilled.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <HeartPulse className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          How VitaFlow Works
        </h1>
        <p className="mt-3 text-gray-600">
          A simple, transparent, and efficient process to save lives through
          smart blood donation management.
        </p>
      </div>

      {/* STEPS */}
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map((step, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <step.icon className="mx-auto h-10 w-10 text-red-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Ready to make a difference?
        </h2>
        <p className="mt-2 text-gray-600">
          Join VitaFlow today and become part of a life-saving network.
        </p>
        <a
          href="/auth/register"
          className="inline-block mt-6 rounded-md bg-red-600 px-6 py-3 text-white font-medium hover:bg-red-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}