"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:3001/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully!");
      form.reset();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-20">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto">
        <Mail className="mx-auto h-12 w-12 text-red-600" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-3 text-gray-600">
          Have a question or suggestion? We’d love to hear from you.
        </p>
      </div>

      {/* CONTENT */}
      <div className="mt-16 grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* CONTACT INFO */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 flex gap-4 items-center">
              <Phone className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-sm text-gray-600">+92 335 4428575</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4 items-center">
              <Mail className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-sm text-gray-600">support@vitaflow.com</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex gap-4 items-center">
              <MapPin className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-sm text-gray-600">
                  Islamabad, Pakistan
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CONTACT FORM */}
        <Card>
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Your Name</label>
                <Input
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  name="message"
                  placeholder="Type your message here..."
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
