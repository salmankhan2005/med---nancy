import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, User, FileText } from "lucide-react";

const logs = [
  { id: 1, action: "User Login", user: "sarah@email.com", role: "Patient", time: "2026-03-08 14:32", ip: "192.168.1.45", type: "auth" },
  { id: 2, action: "Report Uploaded", user: "lab@metro.com", role: "Lab", time: "2026-03-08 13:15", ip: "10.0.0.12", type: "data" },
  { id: 3, action: "Role Changed", user: "admin@platform.com", role: "Admin", time: "2026-03-08 12:00", ip: "10.0.0.1", type: "security" },
  { id: 4, action: "Report Reviewed", user: "smith@hospital.com", role: "Doctor", time: "2026-03-08 11:30", ip: "172.16.0.8", type: "data" },
  { id: 5, action: "Password Reset", user: "james@email.com", role: "Patient", time: "2026-03-07 16:45", ip: "192.168.1.67", type: "security" },
  { id: 6, action: "User Registered", user: "newuser@email.com", role: "Patient", time: "2026-03-07 14:20", ip: "192.168.1.90", type: "auth" },
  { id: 7, action: "Report Deleted", user: "admin@platform.com", role: "Admin", time: "2026-03-07 10:00", ip: "10.0.0.1", type: "data" },
  { id: 8, action: "Failed Login Attempt", user: "unknown@email.com", role: "Unknown", time: "2026-03-06 22:15", ip: "203.0.113.5", type: "security" },
];

const typeColors: Record<string, string> = { auth: "bg-info/10 text-info", data: "bg-success/10 text-success", security: "bg-warning/10 text-warning" };

export default function AuditLogsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-muted-foreground">System activity and security logs.</p>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  {log.type === "security" ? <Shield className="h-4 w-4 text-warning" /> : log.type === "auth" ? <User className="h-4 w-4 text-info" /> : <FileText className="h-4 w-4 text-success" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.user} · {log.role}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={typeColors[log.type]} variant="secondary">{log.type}</Badge>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {log.time}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
