import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-medium text-foreground">Profile</h3>
          <div className="space-y-3">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>
            <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-medium text-foreground">Notifications</h3>
          <div className="space-y-3">
            {["Email notifications", "Report ready alerts", "Appointment reminders", "Health tips"].map((label) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{label}</span>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
