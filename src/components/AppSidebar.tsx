import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useAuthStore, UserRole } from "@/stores/authStore";
import { Activity, LayoutDashboard, FileText, Upload, Users, BarChart3, Bell, Settings, HelpCircle, Calendar, Heart, Stethoscope, Shield, ClipboardList, FlaskConical, UserCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<UserRole, NavItem[]> = {
  patient: [
    { title: "Dashboard", url: "/dashboard/patient", icon: LayoutDashboard },
    { title: "My Reports", url: "/dashboard/patient/reports", icon: FileText },
    { title: "Health Analytics", url: "/dashboard/patient/analytics", icon: BarChart3 },
    { title: "Appointments", url: "/dashboard/patient/appointments", icon: Calendar },
    { title: "Health Goals", url: "/dashboard/patient/goals", icon: Heart },
    { title: "Notifications", url: "/dashboard/patient/notifications", icon: Bell },
    { title: "Settings", url: "/dashboard/patient/settings", icon: Settings },
  ],
  lab: [
    { title: "Dashboard", url: "/dashboard/lab", icon: LayoutDashboard },
    { title: "Upload Report", url: "/dashboard/lab/upload", icon: Upload },
    { title: "Report Management", url: "/dashboard/lab/reports", icon: FileText },
    { title: "Patient Directory", url: "/dashboard/lab/patients", icon: Users },
    { title: "Lab Performance", url: "/dashboard/lab/performance", icon: BarChart3 },
    { title: "Notifications", url: "/dashboard/lab/notifications", icon: Bell },
  ],
  doctor: [
    { title: "Dashboard", url: "/dashboard/doctor", icon: LayoutDashboard },
    { title: "Patient Records", url: "/dashboard/doctor/patients", icon: Users },
    { title: "Report Review", url: "/dashboard/doctor/reports", icon: ClipboardList },
    { title: "Medical Insights", url: "/dashboard/doctor/insights", icon: Stethoscope },
    { title: "Schedule", url: "/dashboard/doctor/schedule", icon: Calendar },
    { title: "Notifications", url: "/dashboard/doctor/notifications", icon: Bell },
  ],
  admin: [
    { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "User Management", url: "/dashboard/admin/users", icon: Users },
    { title: "All Reports", url: "/dashboard/admin/reports", icon: FileText },
    { title: "Audit Logs", url: "/dashboard/admin/audit", icon: Shield },
    { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
    { title: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const role = user?.role || "patient";
  const items = navByRole[role];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="font-bold text-foreground text-lg">DiagAccess</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{collapsed ? "" : role.charAt(0).toUpperCase() + role.slice(1) + " Menu"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button variant="ghost" size={collapsed ? "icon" : "default"} onClick={logout} className="w-full justify-start text-muted-foreground hover:text-destructive">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Log Out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
