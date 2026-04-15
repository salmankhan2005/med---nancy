import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { mockPatients } from "@/data/mockData";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const filtered = mockPatients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Patient Directory</h1>
        <p className="text-muted-foreground">Search and manage patients.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search patients..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Age</TableHead>
                <TableHead className="hidden md:table-cell">Gender</TableHead>
                <TableHead className="hidden md:table-cell">Blood Type</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-medium">{p.name.charAt(0)}</div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{p.age}</TableCell>
                  <TableCell className="hidden md:table-cell">{p.gender}</TableCell>
                  <TableCell className="hidden md:table-cell"><Badge variant="outline">{p.bloodType}</Badge></TableCell>
                  <TableCell>{p.reportsCount}</TableCell>
                  <TableCell className="text-muted-foreground">{p.lastVisit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
