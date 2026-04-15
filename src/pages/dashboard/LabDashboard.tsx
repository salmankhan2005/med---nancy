import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockReports, healthMetrics } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const stats = [
  { title: "Reports Uploaded", value: "156", icon: Upload, change: "+12 this week", color: "text-primary" },
  { title: "Pending Processing", value: "8", icon: Clock, change: "3 urgent", color: "text-warning" },
  { title: "Completed Today", value: "14", icon: CheckCircle, change: "+5 from yesterday", color: "text-success" },
  { title: "Total Patients", value: "342", icon: Users, change: "+8 new this month", color: "text-info" },
];

export default function LabDashboard() {
  const processingReports = mockReports.filter(r => r.status === "processing" || r.status === "pending");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Lab Dashboard</h1>
        <p className="text-muted-foreground">Manage diagnostic reports and lab operations.</p>
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
            <CardHeader><CardTitle className="text-base">Reports by Month</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={healthMetrics.reportsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader><CardTitle className="text-base">Processing Queue</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {processingReports.length === 0 && <p className="text-sm text-muted-foreground">All reports processed!</p>}
                {processingReports.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.testName}</p>
                      <p className="text-xs text-muted-foreground">{r.patientName} · {r.date}</p>
                    </div>
                    <Badge variant={r.status === "pending" ? "destructive" : "secondary"}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
