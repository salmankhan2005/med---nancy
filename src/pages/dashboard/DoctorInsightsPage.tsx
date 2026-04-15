import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { healthMetrics } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Brain, TrendingUp } from "lucide-react";

const insights = [
  { title: "Blood Pressure Trend", detail: "Patient cohort shows improving systolic readings over 6 months. Average drop: 3 mmHg.", risk: "Low" },
  { title: "Diabetes Screening", detail: "15% of patients show pre-diabetic HbA1c levels (5.7-6.4%). Recommend dietary counseling.", risk: "Medium" },
  { title: "Vitamin D Deficiency", detail: "32% of patients have Vitamin D levels below 30 ng/mL. Consider supplementation protocol.", risk: "Medium" },
  { title: "Cholesterol Management", detail: "LDL levels trending down across treatment group. Statin therapy showing efficacy.", risk: "Low" },
];

export default function DoctorInsightsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Insights</h1>
        <p className="text-muted-foreground">AI-powered health trend analysis across your patients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((ins, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{ins.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{ins.detail}</p>
                  <p className="text-xs mt-2">Risk Level: <span className={ins.risk === "Low" ? "text-success" : "text-warning"}>{ins.risk}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Patient Health Trends</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={healthMetrics.bloodPressure}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--info))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
