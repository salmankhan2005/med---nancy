import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Activity, Shield, FileText, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  { icon: FileText, title: "Digital Reports", desc: "Access your diagnostic reports anytime, anywhere." },
  { icon: Shield, title: "Secure & Private", desc: "HIPAA-compliant data protection for all your medical records." },
  { icon: BarChart3, title: "Health Analytics", desc: "Track health trends with interactive charts and insights." },
  { icon: CheckCircle, title: "Verified Results", desc: "All reports verified by certified laboratories." },
];

const stats = [
  { value: "50K+", label: "Reports Processed" },
  { value: "1,200+", label: "Healthcare Providers" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User Rating" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">DiagAccess</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>Sign In</Button>
            <Button onClick={() => navigate("/login")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
            Your Diagnostic Reports, <span className="text-primary">Digitally Delivered</span>
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            Access lab results instantly. No more waiting in queues. Secure, fast, and always available.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button size="lg" onClick={() => navigate("/login")}>
              Start Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">Learn More</Button>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-secondary/50">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why DiagAccess?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to go digital?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">Join thousands of patients and healthcare providers on DiagAccess.</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/login")}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 DiagAccess. All rights reserved. · Privacy · Terms
        </div>
      </footer>
    </div>
  );
}
