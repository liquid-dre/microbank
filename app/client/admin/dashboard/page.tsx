"use client";

import { useEffect, useState, useMemo } from "react";
import { adminApi, User } from "@/app/client/lib/api";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Users, Slash, CheckCircle } from "lucide-react";

// Sortable keys
type SortKey = 'name' | 'email' | 'isBlacklisted';

export default function AdminDashboard() {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination & Sorting
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);

  // Fetch data
  useEffect(() => {
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
    fetchClients();
  }, []);

  // Search filter
  const filtered = useMemo(
    () => clients.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    ),
    [clients, search]
  );

  // Sorting logic
  const sorted = useMemo(() => {
    if (!sortConfig) return filtered;
    const { key, direction } = sortConfig;
    const normalize = (val: any) => {
      if (val == null) return '';
      if (typeof val === 'boolean') return val ? '1' : '0';
      return String(val).toLowerCase();
    };
    return [...filtered].sort((a, b) => {
      const aVal = normalize(a[key]);
      const bVal = normalize(b[key]);
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortConfig]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  // Sorting handler
  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  // Blacklist toggle
  const toggleBlacklist = async (id: string) => {
    try {
      const updated = await adminApi.toggleBlacklist(id);
      toast.success(
        updated.isBlacklisted
          ? `${updated.name} has been blacklisted`
          : `${updated.name} is no longer blacklisted`
      );
      setClients(prev => prev.map(c => c.id === id ? { ...c, isBlacklisted: updated.isBlacklisted } : c));
    } catch {
      toast.error("Toggle failed");
    }
  };

  // Stats calculations
  const totalCount = clients.length;
  const blacklistedCount = clients.filter(c => c.isBlacklisted).length;
  const activeCount = totalCount - blacklistedCount;

  return (
    <div className="min-h-screen p-6 bg-[var(--color-cream)]">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[var(--color-primary)]">Admin Dashboard</h1>
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="max-w-xs"
        />
      </div>

      {/* Engaging Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Clients', value: totalCount, Icon: Users, color: 'var(--color-primary)', progress: 100 },
          { label: 'Blacklisted', value: blacklistedCount, Icon: Slash, color: '#DC2626', progress: totalCount ? Math.round((blacklistedCount / totalCount) * 100) : 0 },
          { label: 'Active', value: activeCount, Icon: CheckCircle, color: '#059669', progress: totalCount ? Math.round((activeCount / totalCount) * 100) : 0 },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 * idx, duration: 0.5 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-2xl shadow-lg border-t-4"
            style={{ borderColor: stat.color }}
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.Icon className="w-6 h-6" style={{ color: stat.color }} />
              <h3 className="text-lg font-semibold text-gray-800">{stat.label}</h3>
            </div>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: stat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">{stat.progress}% of total</p>
          </motion.div>
        ))}
      </div>

      {/* Client Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {['name', 'email', 'isBlacklisted'].map(col => (
                <th
                  key={col}
                  className="p-4 text-left font-medium text-gray-700 cursor-pointer select-none"
                  onClick={() => handleSort(col as SortKey)}
                >
                  <div className="flex items-center gap-1">
                    {col === 'isBlacklisted' ? 'Blacklisted' : col.charAt(0).toUpperCase() + col.slice(1)}
                    {sortConfig?.key === col && (
                      sortConfig.direction === 'asc'
                        ? <ChevronUp className="w-4 h-4 text-gray-600" />
                        : <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr><td colSpan={3} className="py-6 text-center text-gray-500">Loading...</td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={3} className="py-6 text-center text-gray-500">No clients found</td></tr>
              ) : paginated.map(client => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="border-b last:border-none even:bg-gray-50 hover:bg-[var(--color-cream)]"
                >
                  <td className="p-4">{client.name}</td>
                  <td className="p-4">{client.email}</td>
                  <td className="p-4"><Switch checked={client.isBlacklisted} onCheckedChange={() => toggleBlacklist(client.id)} /></td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-3 mt-4">
        <Button variant="outline" size="sm" onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1}>Previous</Button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}
