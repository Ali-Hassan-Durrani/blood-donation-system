"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartPulse, Mail, Lock, User, UserPlus, Phone } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("DONOR");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register({ full_name, email, password, role, phone, city });
      toast.success("Account created! Please login.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error("Registration failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-red-600 to-red-700 text-white p-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <HeartPulse className="h-14 w-14 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">VitaFlow</h1>
          <p className="mt-4 text-red-100 max-w-sm">
            Join VitaFlow and be part of a smarter blood donation ecosystem.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 mb-6"
          >
            ← Back to Home
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-gray-600">Register to start using VitaFlow</p>

          {/* ✅ IMPORTANT: onSubmit */}
          <form className="mt-8 space-y-5" onSubmit={handleRegister}>
            {/* FULL NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="03xx-xxxxxxx"
                  className="pl-10"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* CITY */}
            <div>
              <label className="text-sm font-medium text-gray-700">City</label>
              <Input
                type="text"
                placeholder="Karachi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="text-sm font-medium text-gray-700">Register as</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="DONOR">Donor</option>
                <option value="SEEKER">Seeker</option>
                <option value="BLOOD_BANK">Blood Bank</option>
                <option value="HOSPITAL">Hospital</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 flex gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-red-600 hover:underline font-medium">
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
