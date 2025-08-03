"use client";

import { useEffect, useState } from "react";
import { adminApi, User } from "@/app/client/lib/api";
import { Switch } from "@/components/ui/switch"; // Shadcn switch
import { toast } from "sonner";

export default function AdminDashboard() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all clients
  const fetchClients = async () => {
    try {
      const data = await adminApi.listClients();
      setClients(data);
    } catch {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlacklist = async (clientId: string) => {
    try {
      const updated = await adminApi.toggleBlacklist(clientId);
      toast.success(
        updated.isBlacklisted
          ? `${updated.name} has been blacklisted`
          : `${updated.name} is no longer blacklisted`
      );
      // Update local state
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId ? { ...c, isBlacklisted: updated.isBlacklisted } : c
        )
      );
    } catch {
      toast.error("Failed to toggle blacklist");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--color-cream)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-primary)" }}>
        Admin Dashboard
      </h1>

      <div className="overflow-x-auto rounded-lg shadow border bg-white">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="py-3 px-4 font-medium text-gray-700">Email</th>
              <th className="py-3 px-4 font-medium text-gray-700">Blacklisted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No clients found
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-b last:border-none">
                  <td className="py-3 px-4">{client.name}</td>
                  <td className="py-3 px-4">{client.email}</td>
                  <td className="py-3 px-4">
                    <Switch
                      checked={client.isBlacklisted}
                      onCheckedChange={() => toggleBlacklist(client.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}