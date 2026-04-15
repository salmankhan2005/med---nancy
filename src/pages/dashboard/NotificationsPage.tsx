import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

const typeConfig: Record<string, { icon: any; color: string }> = {
  info:    { icon: Info,         color: "text-info" },
  warning: { icon: AlertTriangle, color: "text-warning" },
  success: { icon: CheckCircle,  color: "text-success" },
  error:   { icon: XCircle,      color: "text-destructive" },
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useRealtimeNotifications();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4 mr-1" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : notifications.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.info;
          const Icon = cfg.icon;
          return (
            <Card key={n.id} className={`transition-all ${!n.read ? "border-primary/30 bg-accent/30" : ""}`}>
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${cfg.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      {!n.read && <Badge className="h-4 bg-primary text-primary-foreground text-[10px] px-1">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.createdAt ? new Date(n.createdAt).toLocaleString() : n.date}</p>
                  </div>
                </div>
                {!n.read && (
                  <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="shrink-0">
                    Mark Read
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
