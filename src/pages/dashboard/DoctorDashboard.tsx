import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, AlertTriangle, Calendar, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockReports, mockPatients, mockAppointments } from "@/data/mockData";

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const stats = [
  { title: "Total Patients", value: "48", icon: Users, change: "+3 this week", color: "text-primary" },
  { title: "Pending Reviews", value: "5", icon: FileText, change: "2 urgent", color: "text-warning" },
  { title: "Today's Appointments", value: "6", icon: Calendar, change: "Next at 10:00 AM", color: "text-info" },
  { title: "Critical Alerts", value: "2", icon: AlertTriangle, change: "Requires attention", color: "text-destructive" },
];

export default function DoctorDashboard() {
  const pendingReports = mockReports.filter(r => r.status === "completed" && !r.doctorNotes);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Review patient reports and manage your schedule.</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.title}</span>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Reports Needing Review</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingReports.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.testName}</p>
                      <p className="text-xs text-muted-foreground">{r.patientName} · {r.date}</p>
                    </div>
                    <Badge variant="outline">Needs Review</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader><CardTitle className="text-base">Today's Schedule</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAppointments.filter(a => a.status === "scheduled").map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.time} · {a.type}</p>
                    </div>
                    <Badge variant="secondary">{a.date}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Patients</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockPatients.slice(0, 6).map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">{p.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.age}y · {p.bloodType} · {p.reportsCount} reports</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
