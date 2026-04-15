import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { appointmentsService } from "@/services/apiService";

const statusColors: Record<string, string> = {
  scheduled: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AppointmentsPage() {
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsService.getAppointments(),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">Manage your upcoming and past appointments.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((a: any) => (
            <Card key={a.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{a.type} · {a.patientName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.date} at {a.time}
                    </div>
                  </div>
                </div>
                <Badge className={statusColors[a.status] || ""} variant="secondary">{a.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}

