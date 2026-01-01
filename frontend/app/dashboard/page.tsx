"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      router.replace("/auth/login");
      return;
    }

    switch (role) {
      case "ADMIN":
        router.replace("/dashboard/admin");
        break;
      case "DONOR":
        router.replace("/dashboard/donor");
        break;
      case "SEEKER":
        router.replace("/dashboard/seeker");
        break;
      case "BLOOD_BANK":
        router.replace("/dashboard/blood-bank");
        break;
      case "HOSPITAL":
        router.replace("/dashboard/hospital");
        break;
      default:
        router.replace("/auth/login");
    }
  }, [router]);

  return null;
}