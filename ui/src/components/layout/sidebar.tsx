import { Link, useLocation } from "react-router";
import {
  Home,
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Departments", href: "/departments", icon: Building2 },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Classes", href: "/classes", icon: GraduationCap },
  { name: "Enrollments", href: "/enrollments", icon: Users },
  { name: "Users", href: "/users", icon: UserCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <GraduationCap className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-bold">Classroom</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Separator className="mb-4" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => {
            // TODO: Implement logout
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
