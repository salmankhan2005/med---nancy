import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Droplets, Activity, Moon } from "lucide-react";

const goals = [
  { id: 1, title: "Walk 10,000 steps daily", progress: 72, icon: Activity, target: "10,000 steps", current: "7,200 steps" },
  { id: 2, title: "Drink 8 glasses of water", progress: 62, icon: Droplets, target: "8 glasses", current: "5 glasses" },
  { id: 3, title: "Maintain blood pressure", progress: 90, icon: Heart, target: "<120/80", current: "117/77" },
  { id: 4, title: "Sleep 8 hours nightly", progress: 85, icon: Moon, target: "8 hours", current: "6.8 hours" },
];

export default function HealthGoalsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Health Goals</h1>
        <p className="text-muted-foreground">Track your personal health objectives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => (
          <Card key={g.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <g.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{g.title}</p>
                  <p className="text-xs text-muted-foreground">{g.current} / {g.target}</p>
                </div>
              </div>
              <Progress value={g.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 text-right">{g.progress}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
