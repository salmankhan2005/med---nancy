import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Shield, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockReports, mockPatients, healthMetrics } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const stats = [
  { title: "Total Users", value: "1,247", icon: Users, change: "+45 this month", color: "text-primary" },
  { title: "Total Reports", value: "8,432", icon: FileText, change: "+312 this month", color: "text-info" },
  { title: "Active Labs", value: "24", icon: Shield, change: "All operational", color: "text-success" },
  { title: "System Health", value: "99.9%", icon: BarChart3, change: "Uptime this month", color: "text-success" },
];

const COLORS = ["hsl(174, 62%, 38%)", "hsl(210, 80%, 52%)", "hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)"];

const auditLogs = [
  { id: 1, action: "User registered", user: "emily@email.com", time: "2 min ago", type: "info" },
  { id: 2, action: "Report uploaded", user: "Metro Diagnostics", time: "15 min ago", type: "success" },
  { id: 3, action: "Role changed", user: "admin@platform.com", time: "1 hour ago", type: "warning" },
  { id: 4, action: "Report reviewed", user: "Dr. Smith", time: "2 hours ago", type: "info" },
  { id: 5, action: "Login attempt failed", user: "unknown@email.com", time: "3 hours ago", type: "error" },
];

export default function AdminDashboard() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and system management.</p>
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
            <CardHeader><CardTitle className="text-base">Reports by Category</CardTitle></CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={healthMetrics.reportsByCategory} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                    {healthMetrics.reportsByCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Audit Logs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.user}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">{log.type}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
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
