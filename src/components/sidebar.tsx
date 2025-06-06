import { Link, useLocation } from "wouter";
import { Building, Search, Edit, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActivePage = (path: string) => {
    if (path === "/search" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location.includes(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="text-primary-foreground text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-primary">Chicago Uniform</h2>
            <p className="text-xs text-muted-foreground">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <Link href="/search" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActivePage("/search")
                ? "bg-accent border border-primary text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}>
          <Search className="w-5 h-5" />
          <span>Search Products</span>
        </Link>

        <Link href="/update" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActivePage("/update")
                ? "bg-accent border border-primary text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}>
          <Edit className="w-5 h-5" />
          <span>Update Products</span>
        </Link>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Analytics</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
