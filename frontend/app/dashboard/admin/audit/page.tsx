"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (actionFilter !== "ALL") {
      filtered = filtered.filter((log) => log.action === actionFilter);
    }

    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(search.toLowerCase()) ||
          log.entity_type.toLowerCase().includes(search.toLowerCase()) ||
          log.users?.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [search, actionFilter, logs]);

  async function fetchLogs() {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    try {
      const res = await fetch("http://localhost:3001/audit", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch logs");
      }

      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      setFilteredLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading audit logs...</div>
      </div>
    );
  }

  const uniqueActions = [...new Set(logs.map((log) => log.action))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">
          Track all system activities and changes
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by action, entity, or user..."
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No audit logs found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline">{log.action}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        {log.entity_type}
                      </Badge>
                      {log.users && (
                        <span className="text-sm text-gray-600">
                          by {log.users.email} ({log.users.role})
                        </span>
                      )}
                    </div>

                    <div className="grid gap-2 md:grid-cols-3 text-sm text-gray-600">
                      {log.entity_id && (
                        <div>
                          <strong>Entity ID:</strong> {log.entity_id.slice(0, 8)}...
                        </div>
                      )}
                      {log.ip_address && (
                        <div>
                          <strong>IP:</strong> {log.ip_address}
                        </div>
                      )}
                      <div>
                        <strong>Time:</strong>{" "}
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>

                    {log.meta && (
                      <pre className="mt-2 text-xs bg-gray-50 p-3 rounded overflow-x-auto max-h-40">
                        {JSON.stringify(log.meta, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}