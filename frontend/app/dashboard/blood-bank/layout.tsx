"use client";

import {Sidebar} from "@/components/layout/DashboardSidebar";

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="BLOOD_BANK" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}