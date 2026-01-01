"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, CheckCircle, XCircle, Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [assignDialog, setAssignDialog] = useState(false);
  const [selectedBloodBank, setSelectedBloodBank] = useState("");

  useEffect(() => {
    fetchRequests();
    fetchBloodBanks();
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.blood_group.toLowerCase().includes(search.toLowerCase()) ||
          r.city.toLowerCase().includes(search.toLowerCase()) ||
          r.users_blood_requests_requester_user_idTousers?.full_name
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [search, statusFilter, requests]);

  async function fetchRequests() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:3001/blood-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
      setFilteredRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBloodBanks() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:3001/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const banks = Array.isArray(data)
        ? data.filter((u) => u.role === "BLOOD_BANK")
        : [];
      setBloodBanks(banks);
    } catch (error) {
      console.error("Failed to fetch blood banks:", error);
    }
  }

  async function handleApprove(id: string) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:3001/blood-requests/${id}/approve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to approve");

      toast.success("Request approved successfully");
      await fetchRequests();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  }

  async function handleReject(id: string) {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:3001/blood-requests/${id}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to reject");

      toast.success("Request rejected");
      await fetchRequests();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  }

  async function handleAssignBloodBank() {
    if (!selectedBloodBank || !selectedRequest) return;

    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://localhost:3001/blood-requests/${selectedRequest.id}/assign-blood-bank`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ blood_bank_id: selectedBloodBank }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign");

      toast.success("Blood bank assigned successfully");
      setAssignDialog(false);
      setSelectedRequest(null);
      setSelectedBloodBank("");
      await fetchRequests();
    } catch (error) {
      toast.error("Failed to assign blood bank");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Blood Requests</h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor all blood requests in the system
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by blood group, city, or requester..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">
              {requests.filter((r) => r.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-blue-600">
              {requests.filter((r) => r.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Fulfilled</p>
            <p className="text-3xl font-bold text-green-600">
              {requests.filter((r) => r.status === "FULFILLED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">
              {requests.filter((r) => r.status === "REJECTED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {request.blood_group?.replace("_", "")} •{" "}
                      {request.units_needed} units
                    </h3>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge variant="outline">{request.urgency}</Badge>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 text-sm text-gray-600 mb-3">
                    <div>
                      <strong>Requester:</strong>{" "}
                      {request.users_blood_requests_requester_user_idTousers
                        ?.full_name || "N/A"}
                    </div>
                    <div>
                      <strong>City:</strong> {request.city}
                    </div>
                    <div>
                      <strong>Needed On:</strong>{" "}
                      {new Date(request.needed_on).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {request.reason && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}

                  {request.assigned_blood_bank_id && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Assigned to Blood Bank
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {request.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRequest(request);
                          setAssignDialog(true);
                        }}
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assign Blood Bank Dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Blood Bank</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Blood Bank</label>
              <Select value={selectedBloodBank} onValueChange={setSelectedBloodBank}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a blood bank..." />
                </SelectTrigger>
                <SelectContent>
                  {bloodBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.full_name} - {bank.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAssignBloodBank}
                className="bg-red-600 hover:bg-red-700"
              >
                Assign
              </Button>
              <Button variant="outline" onClick={() => setAssignDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-blue-100 text-blue-800";
    case "FULFILLED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}