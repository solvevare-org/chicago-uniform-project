import { useState, useEffect } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService, type User as UserType } from "@/lib/auth";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-foreground">
              {user?.username || "Admin User"}
            </span>
          </div>
        </div>
      </div>

      {/* Categories Dropdown - Assuming this is part of the Header */}
      <div className="absolute top-full left-0 right-0 bg-card border-t border-border mt-2">
        <div className="flex flex-col p-4">
          {/* Category Links - Update these links as per your routing */}
          <a href="/category1" className="text-[#222] hover:text-[#2563eb] py-2">
            Category 1
          </a>
          <a href="/category2" className="text-[#222] hover:text-[#2563eb] py-2">
            Category 2
          </a>
          <a href="/category3" className="text-[#222] hover:text-[#2563eb] py-2">
            Category 3
          </a>
          
          {/* Show All Categories Button */}
          <Button 
            variant="outline" 
            className="mt-2 bg-white text-[#222] border-[#2563eb] hover:bg-white"
            onClick={() => {/* Your logic to show all categories */}}
          >
            Show All Categories
          </Button>
        </div>
      </div>
    </header>
  );
}
