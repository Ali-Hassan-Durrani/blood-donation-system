"use client";

import { Sidebar } from "@/components/layout/DashboardSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}