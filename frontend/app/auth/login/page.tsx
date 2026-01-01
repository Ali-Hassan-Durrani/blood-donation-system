"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeartPulse, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Invalid email or password");
        return;
      }

      // ✅ token could be in different shapes
      const token =
        data?.access_token || data?.token || data?.jwt || data?.accessToken;

      if (!token) {
        toast.error("Login succeeded but token missing (backend response issue)");
        console.error("Login response:", data);
        return;
      }

      // ✅ SAVE BOTH (so old + new code works)
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);

      // ✅ role could also be in different shapes
      const role = data?.role || data?.user?.role;
      if (role) localStorage.setItem("role", role);

      toast.success("Logged in successfully");

      // ✅ direct to dashboard (for now)
      if (role === "SEEKER") router.push("/dashboard/seeker");
      else if (role === "DONOR") router.push("/dashboard/donor");
      else if (role === "ADMIN") router.push("/dashboard/admin");
      else if (role === "BLOOD_BANK") router.push("/dashboard/blood-bank");
      else if (role === "HOSPITAL") router.push("/dashboard/hospital");
      else router.push("/dashboard/seeker");
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-red-600 to-red-700 text-white p-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <HeartPulse className="h-14 w-14 mx-auto mb-4" />
          <h1 className="text-4xl font-bold">VitaFlow</h1>
          <p className="mt-4 text-red-100 max-w-sm">
            A smarter way to connect donors, seekers, hospitals and blood banks.
          </p>
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 mb-6">
            ← Back to Home
          </Link>

          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Login to your VitaFlow account</p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-red-600 hover:underline font-medium">
              Register
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}