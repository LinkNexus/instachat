import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Bell, LogOut, Menu, MessageSquare, Phone, Search, Settings, Users, Video} from "lucide-react";
import {useState} from "react";
import {Link, useLocation} from "wouter";
import {ThemeToggle} from "@/components/ThemeToggle.tsx";
import type {User} from "@/types.ts";
import {useAppStore} from "@/lib/store.ts";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  {
    href: "/chat",
    label: "Chat",
    icon: MessageSquare,
    badge: 3,
  },
  {
    href: "/friends",
    label: "Friends",
    icon: Users,
    badge: 2,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Navigation({user}: { user: User }) {
  const [location] = useLocation();
  const [isOnline, setIsOnline] = useState(true);

  const { logout } = useAppStore(state => state);

  return (
    <nav className="bg-card border-b px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary-foreground"/>
            </div>
            <span className="text-xl font-semibold">InstaChat</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-2 items-center lg:space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className="relative"
                >
                  <Icon className="h-4 w-4 mr-2"/>
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Search and User Menu */}
        <div className="flex items-center space-x-3">
          {/* Search Button */}
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4"/>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle/>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4"/>
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-4 w-4 text-xs flex items-center justify-center"
            >
              5
            </Badge>
          </Button>

          {/* Call Actions */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4"/>
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-4 w-4"/>
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-1">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png"/>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 bg-chart-1 rounded-full border-2 border-background"/>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center space-x-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png"/>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </div>
              </div>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={() => setIsOnline(!isOnline)}>
                <div className={`w-2 h-2 rounded-full mr-3 ${isOnline ? 'bg-chart-1' : 'bg-muted-foreground/40'}`}/>
                {isOnline ? 'Online' : 'Offline'}
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-3"/>
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="h-4 w-4 mr-3"/>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.startsWith(item.href);

                return (
                  <Link key={item.href} href={item.href}>
                    <DropdownMenuItem className={isActive ? "bg-accent" : ""}>
                      <Icon className="h-4 w-4 mr-3"/>
                      {item.label}
                      {item.badge && item.badge > 0 && (
                        <Badge variant="destructive" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </Link>
                );
              })}
              <DropdownMenuSeparator/>
              <DropdownMenuItem>
                <Search className="h-4 w-4 mr-3"/>
                Search
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
