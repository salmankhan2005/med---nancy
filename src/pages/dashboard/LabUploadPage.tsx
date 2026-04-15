import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsService, reportsService } from "@/services/apiService";

export default function LabUploadPage() {
  const [dragging, setDragging] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [category, setCategory] = useState("");
  const [testName, setTestName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const qc = useQueryClient();

  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => patientsService.getPatients(),
  });

  const submitMutation = useMutation({
    mutationFn: () => reportsService.createReport({ patientId, testName, category, labName: "Current Lab", status: "pending" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report submitted successfully!");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setPatientId(""); setCategory(""); setTestName("");
    },
    onError: () => toast.error("Failed to submit report. Try again."),
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    toast.info("File received — fill in the details below and submit.");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Report</h1>
        <p className="text-muted-foreground">Upload diagnostic reports for patients.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Patient</Label>
              <Select value={patientId} onValueChange={setPatientId}>
                <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                <SelectContent>
                  {patients.length === 0 && <SelectItem value="_">No patients found</SelectItem>}
                  {patients.map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.name || p.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Test Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hematology">Hematology</SelectItem>
                  <SelectItem value="biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="microbiology">Microbiology</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Test Name</Label>
            <Input placeholder="e.g. Complete Blood Count" value={testName} onChange={e => setTestName(e.target.value)} />
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragging ? "border-primary bg-accent/50" : "border-border"}`}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Drag &amp; drop report PDF here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
            <Button variant="outline" size="sm" className="mt-3">
              <FileText className="h-4 w-4 mr-1" /> Browse Files
            </Button>
          </div>

          <Button
            className="w-full"
            disabled={!patientId || !category || !testName || submitMutation.isPending}
            onClick={() => submitMutation.mutate()}
          >
            {submitMutation.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
            ) : submitted ? (
              <><CheckCircle2 className="h-4 w-4 mr-2" /> Submitted!</>
            ) : "Submit Report"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
