import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

const users = [
  { id: "U-001", name: "Sarah Johnson", email: "sarah@email.com", role: "Patient", status: "Active", lastLogin: "2026-03-08" },
  { id: "U-002", name: "Dr. Smith", email: "smith@hospital.com", role: "Doctor", status: "Active", lastLogin: "2026-03-08" },
  { id: "U-003", name: "Metro Diagnostics", email: "lab@metro.com", role: "Lab", status: "Active", lastLogin: "2026-03-07" },
  { id: "U-004", name: "James Wilson", email: "james@email.com", role: "Patient", status: "Active", lastLogin: "2026-03-07" },
  { id: "U-005", name: "Dr. Patel", email: "patel@hospital.com", role: "Doctor", status: "Inactive", lastLogin: "2026-02-28" },
  { id: "U-006", name: "HealthFirst Labs", email: "lab@healthfirst.com", role: "Lab", status: "Active", lastLogin: "2026-03-06" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage platform users and roles.</p>
        </div>
        <Button><UserPlus className="h-4 w-4 mr-2" /> Add User</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={u.status === "Active" ? "secondary" : "destructive"}>{u.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
