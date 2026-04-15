import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Bell, Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-border bg-card px-4 shrink-0">
            <SidebarTrigger />
            <div className="flex-1 flex items-center gap-4">
              <div className="relative max-w-md flex-1 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reports, patients..." className="pl-9 bg-secondary border-0" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setDark(!dark)}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground leading-none">{user?.name}</p>
                  <Badge variant="secondary" className="mt-0.5 text-xs capitalize">{user?.role}</Badge>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
