"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HeartPulse, LogOut } from "lucide-react";

export default function DashboardHeader({ title }: { title: string }) {
  const router = useRouter();

  function logout() {
    localStorage.clear();
    router.push("/");
  }

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <HeartPulse className="h-6 w-6 text-red-600" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      <Button variant="outline" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </header>
  );
}