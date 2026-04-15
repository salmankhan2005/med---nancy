import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockAppointments } from "@/data/mockData";
import { Calendar, Clock } from "lucide-react";

export default function DoctorSchedulePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
        <p className="text-muted-foreground">Your appointment calendar.</p>
      </div>

      <div className="space-y-3">
        {mockAppointments.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.patientName}</p>
                  <p className="text-xs text-muted-foreground">{a.type}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {a.date} at {a.time}</div>
                </div>
              </div>
              <Badge variant={a.status === "scheduled" ? "secondary" : a.status === "completed" ? "outline" : "destructive"}>{a.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
