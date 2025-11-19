import { useContext, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LucideBell,
  LucideHome,
  LucideMessageCircle,
  LucideSettings,
  LucideDoorOpen,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils/cn";
import { supabase } from "../../config/env";
import {
  ParentContext,
  InstituteContext,
  SidenavContext,
} from "../../context/contexts";
import { useNotifications } from "../../context/notificationContext";

const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: LucideHome,
    description: "Overview of your children and institute",
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: LucideBell,
    description: "Updates from your institute",
  },
  {
    title: "Chat",
    to: "/chat",
    icon: LucideMessageCircle,
    description: "Instantly talk to institute staff",
  },
  {
    title: "Profile Settings",
    to: "/settings",
    icon: LucideSettings,
    description: "Manage your parent profile",
  },
];

export function Sidenav({ onNavigate, isMobile = false }) {
  const { parentState } = useContext(ParentContext);
  const { instituteState } = useContext(InstituteContext);
  const { unreadCount } = useNotifications();
  const { isMinimized, setIsMinimized } = useContext(SidenavContext);
  const navigate = useNavigate();
  const location = useLocation();

  const initials = useMemo(() => {
    if (!parentState?.first_name) return "P";
    const first = parentState.first_name?.[0] || "";
    const last = parentState.last_name?.[0] || "";
    return `${first}${last}`.toUpperCase() || "P";
  }, [parentState]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("students");
      localStorage.removeItem("parent");
      localStorage.removeItem("user_id");
      localStorage.removeItem("session");
      localStorage.removeItem("staff_id");
      localStorage.removeItem("student_id");
      localStorage.removeItem("entryCreated");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleCollapseToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const showText = !isMinimized || isMobile;

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.to;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={() => {
          onNavigate?.();
        }}
        className={({ isActive: navActive }) =>
          cn(
            "group relative flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
            navActive || isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )
        }
      >
        <Icon className="mr-3 h-5 w-5 shrink-0" />
        {showText && (
          <div className="flex flex-1 flex-col">
            <span>{item.title}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {item.description}
            </span>
          </div>
        )}
        {item.title === "Notifications" && unreadCount > 0 && (
          <Badge className="ml-auto">{unreadCount}</Badge>
        )}
      </NavLink>
    );
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r bg-gradient-to-b from-white/90 to-slate-50/70 p-4 backdrop-blur",
        !isMobile && "transition-all duration-300",
        !isMobile && (isMinimized ? "w-[80px]" : "w-72")
      )}
    >
      <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/80 px-3 py-2 shadow-sm">
        {showText && (
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              MEducation
            </p>
            <p className="text-sm font-semibold text-foreground">
              Parent Portal
            </p>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapseToggle}
            className="h-8 w-8"
            title={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMinimized ? <LucideChevronRight size={16} /> : <LucideChevronLeft size={16} />}
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">{navItems.map(renderNavItem)}</div>
      <div className="mt-auto space-y-4">
        <Separator />
        <div
          className={cn(
            "rounded-2xl border border-border/40 bg-white/80 p-3 shadow-inner",
            isMinimized && "px-2 py-2 text-center"
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-primary/10 text-primary">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {showText && (
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {parentState
                    ? `${parentState?.first_name ?? ""} ${
                        parentState?.last_name ?? ""
                      }`
                    : "Parent"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {instituteState?.name || "Institute"}
                </p>
              </div>
            )}
          </div>
          {showText && parentState?.email && (
            <p className="mt-3 text-xs text-muted-foreground">
              {parentState.email}
            </p>
          )}
          {showText && (
            <Button
              variant="outline"
              className="mt-3 w-full text-sm font-medium"
              onClick={() => navigate("/settings")}
            >
              Manage profile
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-center gap-2 text-sm font-semibold text-destructive hover:text-destructive",
            !showText && "px-2"
          )}
          onClick={handleLogout}
        >
          <LucideDoorOpen className="h-4 w-4" />
          {showText && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
