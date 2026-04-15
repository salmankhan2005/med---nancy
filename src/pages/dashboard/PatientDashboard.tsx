import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Activity, Calendar, AlertTriangle, TrendingUp, Clock, Sparkles, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsService, appointmentsService } from "@/services/apiService";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  processing: "bg-info/10 text-info",
  pending: "bg-warning/10 text-warning",
  reviewed: "bg-primary/10 text-primary",
};

export default function PatientDashboard() {
  const { data: reports = [] } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsService.getReports()
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsService.getAppointments()
  });

  const qc = useQueryClient();

  const seedMutation = useMutation({
    mutationFn: () => fetchApi("/api/seed", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reports"] });
      qc.invalidateQueries({ queryKey: ["appointments"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Demo data loaded! Dashboard is now live.");
    },
    onError: () => toast.error("Failed to load demo data."),
  });

  const { unreadCount } = useRealtimeNotifications();
  const recentReports = reports.slice(0, 5);
  const upcomingAppointments = appointments.filter((a: any) => a.status === "scheduled").slice(0, 3);
  const statCards = [
    { title: "Total Reports", value: reports.length.toString(), icon: FileText, change: "All time", color: "text-primary" },
    { title: "Health Score", value: "86", icon: Activity, change: "+3 from last month", color: "text-success" },
    { title: "Upcoming Visits", value: upcomingAppointments.length.toString(), icon: Calendar, change: "Next scheduled", color: "text-info" },
    { title: "Alerts", value: unreadCount.toString(), icon: AlertTriangle, change: unreadCount > 0 ? "Action needed" : "All caught up", color: "text-warning" },
  ];
  const isEmpty = reports.length === 0 && appointments.length === 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your health overview.</p>
      </motion.div>

      {isEmpty && (
        <motion.div variants={item}>
          <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-foreground">Your dashboard is empty</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Load realistic demo data to see reports, appointments, and notifications in action.</p>
              </div>
              <Button
                onClick={() => seedMutation.mutate()}
                disabled={seedMutation.isPending}
                className="shrink-0"
              >
                {seedMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...</> : <><Sparkles className="h-4 w-4 mr-2" /> Load Demo Data</>}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
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
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Blood Pressure Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={[
                  { month: "Oct", systolic: 122, diastolic: 80 },
                  { month: "Nov", systolic: 118, diastolic: 76 },
                  { month: "Dec", systolic: 125, diastolic: 82 },
                  { month: "Jan", systolic: 120, diastolic: 78 },
                  { month: "Feb", systolic: 117, diastolic: 75 },
                  { month: "Mar", systolic: 118, diastolic: 76 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--info))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.length > 0 ? recentReports.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.testName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()} · {r.labName}</p>
                    </div>
                    <Badge className={statusColors[r.status] || "bg-secondary text-foreground"} variant="secondary">{r.status}</Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">No reports found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Blood Sugar Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { month: "Oct", fasting: 95, postMeal: 130 },
                  { month: "Nov", fasting: 92, postMeal: 125 },
                  { month: "Dec", fasting: 98, postMeal: 140 },
                  { month: "Jan", fasting: 94, postMeal: 128 },
                  { month: "Feb", fasting: 90, postMeal: 122 },
                  { month: "Mar", fasting: 92, postMeal: 124 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="fasting" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="postMeal" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.length > 0 ? upcomingAppointments.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.doctorName}</p>
                      <p className="text-xs text-muted-foreground">{a.date} at {a.time} · {a.type}</p>
                    </div>
                    <Badge variant="outline">{a.status}</Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground py-4 text-center">No upcoming appointments.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
