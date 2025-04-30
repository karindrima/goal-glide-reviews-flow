
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, UserRole } from '@/types';
import { Calendar, FileText, Home, LogOut, Settings, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard', roles: ['admin', 'manager', 'employee'] },
    { label: 'Cycles', icon: Calendar, path: '/cycles', roles: ['admin'] },
    { label: 'Goals', icon: FileText, path: '/goals', roles: ['admin', 'manager', 'employee'] },
    { label: 'Reviews', icon: FileText, path: '/reviews', roles: ['admin', 'manager', 'employee'] },
    { label: 'Team', icon: Users, path: '/team', roles: ['manager'] },
    { label: 'Users', icon: Users, path: '/users', roles: ['admin'] },
    { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin'] },
  ];
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));
  
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-sidebar fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold text-sidebar-foreground">KRA System</h1>
            ) : (
              <h1 className="text-xl font-bold text-sidebar-foreground">KRA</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isSidebarOpen ? "←" : "→"}
            </Button>
          </div>
          
          <Separator className="bg-sidebar-border" />
          
          {/* Navigation */}
          <div className="p-4 flex-1">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
          
          <Separator className="bg-sidebar-border" />
          
          {/* User info */}
          <div className="p-4 flex flex-col">
            {isSidebarOpen && (
              <>
                <div className="mb-2">
                  <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
                </div>
                <p className="text-xs mb-3 capitalize text-sidebar-foreground/70">
                  Role: {user.role}
                </p>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/70"
            >
              <LogOut className="h-4 w-4" />
              {isSidebarOpen && "Logout"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <main className="container p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
