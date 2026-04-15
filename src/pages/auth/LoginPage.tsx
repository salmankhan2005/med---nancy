import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const roles: { role: UserRole; label: string; desc: string; icon: string; color: string }[] = [
  { role: "patient", label: "Patient", desc: "Access your diagnostic reports and health analytics", icon: "🏥", color: "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950" },
  { role: "lab", label: "Lab Technician", desc: "Upload and manage diagnostic reports", icon: "🔬", color: "hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950" },
  { role: "doctor", label: "Doctor", desc: "Review patient reports and add medical notes", icon: "👨‍⚕️", color: "hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950" },
  { role: "admin", label: "Administrator", desc: "Manage platform users and monitor activity", icon: "⚙️", color: "hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950" },
];

const dashboardPaths: Record<UserRole, string> = {
  patient: "/dashboard/patient",
  lab: "/dashboard/lab",
  doctor: "/dashboard/doctor",
  admin: "/dashboard/admin",
};

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState<UserRole | null>(null);

  const { login, register, loginWithGoogle, selectRole, user, isAuthenticated, needsOnboarding } = useAuthStore();
  const navigate = useNavigate();

  // Redirect once authenticated and role is set
  useEffect(() => {
    if (isAuthenticated && user && !needsOnboarding) {
      navigate(dashboardPaths[user.role] || "/dashboard/patient");
    }
  }, [isAuthenticated, user, needsOnboarding, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, name);
        toast.success("Account created! Choose your role to continue.");
      } else {
        await login(email, password);
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: UserRole) => {
    setRoleLoading(role);
    try {
      await selectRole(role);
      toast.success(`Welcome! You're set up as ${roles.find(r => r.role === role)?.label}.`);
      navigate(dashboardPaths[role]);
    } catch (error: any) {
      toast.error("Failed to set role. Please try again.");
    } finally {
      setRoleLoading(null);
    }
  };

  // —— Onboarding: Role Selection Step ——
  if (isAuthenticated && needsOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">DiagAccess</span>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
                <CardTitle className="text-2xl">Welcome, {user?.name?.split(" ")[0]}! 👋</CardTitle>
                <CardDescription className="mt-2">
                  Choose your role to personalize your experience
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {roles.map((r, i) => (
                <motion.button
                  key={r.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  onClick={() => handleRoleSelect(r.role)}
                  disabled={roleLoading !== null}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border transition-all duration-200 text-left group ${r.color} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200">
                    {roleLoading === r.role ? "⏳" : r.icon}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground text-sm">{r.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // —— Login / Register Step ——
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">DiagAccess</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {isRegister ? "Create an Account" : "Welcome back"}
            </CardTitle>
            <CardDescription>
              {isRegister ? "Sign up to access your health portal" : "Sign in to access your health portal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : (isRegister ? "Sign Up" : "Sign In")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative flex items-center gap-4 my-2">
                <div className="flex-grow border-t border-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Or</span>
                <div className="flex-grow border-t border-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <Button variant="link" onClick={() => setIsRegister(!isRegister)} className="text-xs text-muted-foreground">
              {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;


