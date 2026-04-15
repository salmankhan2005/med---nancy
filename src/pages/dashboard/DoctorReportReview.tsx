import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockReports } from "@/data/mockData";
import { Stethoscope, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DoctorReportReview() {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const reviewable = mockReports.filter(r => r.status === "completed" || r.status === "reviewed");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Report Review</h1>
        <p className="text-muted-foreground">Review patient reports and add clinical notes.</p>
      </div>

      <div className="space-y-4">
        {reviewable.map((r) => (
          <Card key={r.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{r.testName}</p>
                  <p className="text-sm text-muted-foreground">{r.patientName} · {r.date} · {r.labName}</p>
                </div>
                <Badge variant={r.doctorNotes ? "secondary" : "outline"}>{r.doctorNotes ? "Reviewed" : "Pending"}</Badge>
              </div>

              {r.results && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {Object.entries(r.results).map(([key, val]) => (
                    <div key={key} className="p-2 rounded bg-secondary/50 text-xs">
                      <span className="text-muted-foreground">{key}</span>
                      <div className="font-medium text-foreground">{val.value} {val.unit}</div>
                    </div>
                  ))}
                </div>
              )}

              {r.doctorNotes && (
                <div className="p-3 rounded bg-accent/50 text-sm text-foreground mb-3">
                  <MessageSquare className="h-3 w-3 inline mr-1" /> {r.doctorNotes}
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  placeholder="Add clinical notes..."
                  value={notes[r.id] || ""}
                  onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                  className="text-sm"
                  rows={2}
                />
                <Button
                  variant="outline"
                  className="shrink-0"
                  onClick={() => { toast.success("Notes saved for " + r.id); setNotes({ ...notes, [r.id]: "" }); }}
                >
                  <Stethoscope className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
