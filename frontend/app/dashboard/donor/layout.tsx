"use client";

import { Sidebar} from "@/components/layout/DashboardSidebar";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="DONOR" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}