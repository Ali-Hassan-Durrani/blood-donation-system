"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Package, AlertTriangle, Pencil, Trash2 } from "lucide-react";

export default function InventoryPage() {
  const [lots, setLots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingLot, setEditingLot] = useState<any>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") || localStorage.getItem("access_token")
      : null;

  const emptyForm = {
    blood_group: "",
    units_available: "",
    expires_on: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const res = await fetch(
        "http://localhost:3001/blood-bank/inventory-lots",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setLots(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  /* ================= ADD LOT ================= */

  async function addLot(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:3001/blood-bank/inventory-lots",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            units_available: Number(formData.units_available),
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Inventory lot added");
      setOpenAdd(false);
      setFormData(emptyForm);
      loadInventory();
    } catch {
      toast.error("Failed to add inventory");
    }
  }

  /* ================= EDIT LOT ================= */

  function openEditLot(lot: any) {
    setEditingLot(lot);
    setFormData({
      blood_group: lot.blood_group,
      units_available: String(lot.units_available),
      expires_on: lot.expires_on.split("T")[0],
    });
    setOpenEdit(true);
  }

  async function updateLot(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3001/blood-bank/inventory-lots/${editingLot.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            units_available: Number(formData.units_available),
            expires_on: formData.expires_on,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Inventory updated");
      setOpenEdit(false);
      setEditingLot(null);
      loadInventory();
    } catch {
      toast.error("Failed to update inventory");
    }
  }

  /* ================= DELETE LOT ================= */

  async function deleteLot(id: string) {
    if (!confirm("Delete this inventory lot?")) return;

    try {
      const res = await fetch(
        `http://localhost:3001/blood-bank/inventory-lots/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Inventory lot deleted");
      loadInventory();
    } catch {
      toast.error("Failed to delete inventory");
    }
  }

  /* ================= HELPERS ================= */

  const isExpired = (date: string) => new Date(date) < new Date();

  const isExpiringSoon = (date: string) => {
    const diff =
      (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">
            Manage blood inventory lots
          </p>
        </div>
        <Button onClick={() => setOpenAdd(true)} className="bg-red-600">
          <Plus className="h-4 w-4 mr-2" /> Add Lot
        </Button>
      </div>

      {/* LIST */}
      {lots.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            No inventory lots yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {lots.map((lot) => (
            <Card
              key={lot.id}
              className={
                isExpired(lot.expires_on)
                  ? "border-red-500 bg-red-50"
                  : isExpiringSoon(lot.expires_on)
                  ? "border-yellow-500 bg-yellow-50"
                  : ""
              }
            >
              <CardContent className="p-6 flex justify-between">
                <div>
                  <h3 className="text-xl font-bold">
                    {lot.blood_group.replace("_", "")}
                  </h3>
                  <p>Units: {lot.units_available}</p>
                  <p>
                    Expires:{" "}
                    {new Date(lot.expires_on).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditLot(lot)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteLot(lot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      <Dialog open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={addLot} className="space-y-4">
            <Label>Blood Group</Label>
            <Select
              value={formData.blood_group}
              onValueChange={(v) =>
                setFormData({ ...formData, blood_group: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                {["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"].map(
                  (g) => (
                    <SelectItem key={g} value={g}>
                      {g.replace("_", "")}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>

            <Label>Units</Label>
            <Input
              type="number"
              min="1"
              value={formData.units_available}
              onChange={(e) =>
                setFormData({ ...formData, units_available: e.target.value })
              }
            />

            <Label>Expiry Date</Label>
            <Input
              type="date"
              value={formData.expires_on}
              onChange={(e) =>
                setFormData({ ...formData, expires_on: e.target.value })
              }
            />

            <Button type="submit" className="bg-red-600 w-full">
              Add
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
          </DialogHeader>
          <form onSubmit={updateLot} className="space-y-4">
            <Label>Units</Label>
            <Input
              type="number"
              min="1"
              value={formData.units_available}
              onChange={(e) =>
                setFormData({ ...formData, units_available: e.target.value })
              }
            />

            <Label>Expiry Date</Label>
            <Input
              type="date"
              value={formData.expires_on}
              onChange={(e) =>
                setFormData({ ...formData, expires_on: e.target.value })
              }
            />

            <Button type="submit" className="bg-red-600 w-full">
              Update
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}