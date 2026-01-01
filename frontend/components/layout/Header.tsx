"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeartPulse, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Blood Compatibility", href: "/blood-compatibility" },
  { label: "Centers", href: "/centers" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <HeartPulse className="h-7 w-7 text-red-600" />
          <span className="text-xl font-bold text-gray-900">VitaFlow</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition ${
                pathname === link.href
                  ? "text-red-600 font-semibold"
                  : "text-gray-700 hover:text-red-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex gap-2">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-red-600 hover:bg-red-700">
              Donate
            </Button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-700"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <nav className="flex flex-col px-6 py-4 gap-4 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`${
                  pathname === link.href
                    ? "text-red-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 flex gap-2">
              <Link href="/auth/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register" className="w-full">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Donate
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
