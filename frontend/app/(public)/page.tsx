"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeartPulse, Users, Hospital, Droplet } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-6 py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight"
          >
            Donate Blood. <br />
            <span className="text-red-200">Save Lives</span> with VitaFlow
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-red-100"
          >
            VitaFlow is a smart blood donation management system connecting
            donors, hospitals, and blood banks efficiently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-100">
                Become a Donor
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-black"
              >
                How it Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-4 gap-10 text-center">
          <StatCard icon={Users} number="10,000+" label="Registered Donors" />
          <StatCard icon={Hospital} number="120+" label="Hospitals" />
          <StatCard icon={Droplet} number="75+" label="Blood Banks" />
          <StatCard icon={HeartPulse} number="25,000+" label="Lives Impacted" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Every Drop Counts
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-600">
            Join VitaFlow today and help save lives by donating blood or managing
            requests efficiently.
          </p>
          <Link href="/auth/register">
            <Button className="mt-8 bg-red-600 hover:bg-red-700">
              Join VitaFlow
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}

function StatCard({
  icon: Icon,
  number,
  label,
}: {
  icon: any;
  number: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition"
    >
      <Icon className="mx-auto h-10 w-10 text-red-600" />
      <h3 className="mt-4 text-3xl font-bold text-gray-900">{number}</h3>
      <p className="mt-1 text-gray-600">{label}</p>
    </motion.div>
  );
}
