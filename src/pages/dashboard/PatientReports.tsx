import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { reportsService } from "@/services/apiService";

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  processing: "bg-info/10 text-info",
  pending: "bg-warning/10 text-warning",
  reviewed: "bg-primary/10 text-primary",
};

export default function PatientReports() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsService.getReports(),
  });

  const filtered = reports.filter((r: any) => {
    const matchSearch = r.testName?.toLowerCase().includes(search.toLowerCase()) || r.labName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Reports</h1>
        <p className="text-muted-foreground">View and manage your diagnostic reports.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Lab</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.testName}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{r.category}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{r.labName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell><Badge className={statusColors[r.status]} variant="secondary">{r.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReport(r)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReport?.testName} — {selectedReport?.id}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Patient:</span> <span className="text-foreground">{selectedReport.patientName}</span></div>
                <div><span className="text-muted-foreground">Date:</span> <span className="text-foreground">{selectedReport.date}</span></div>
                <div><span className="text-muted-foreground">Lab:</span> <span className="text-foreground">{selectedReport.labName}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="text-foreground">{selectedReport.category}</span></div>
              </div>
              {selectedReport.results && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Test Results</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedReport.results).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded bg-secondary/50 text-sm">
                        <span className="text-foreground font-medium">{key}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{val.value} {val.unit}</span>
                          <Badge variant={val.status === "normal" ? "secondary" : "destructive"} className="text-xs">{val.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedReport.doctorNotes && (
                <div>
                  <h4 className="font-medium text-foreground mb-1">Doctor Notes</h4>
                  <p className="text-sm text-muted-foreground bg-accent/50 p-3 rounded">{selectedReport.doctorNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
