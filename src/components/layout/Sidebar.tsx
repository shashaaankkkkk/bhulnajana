"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, FileText, User, LogOut, Calendar, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

import { Logo } from "@/components/ui/Logo";

const navItems = [
  { label: "Todos", href: "/dashboard/todos", icon: CheckSquare },
  { label: "Notes", href: "/dashboard/notes", icon: FileText },
  { label: "DSA", href: "/dashboard/dsa", icon: Code },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-surface px-4 py-6">
      <div className="mb-8 px-4 py-2">
        <Logo />
      </div>
      
      <nav className="flex-1 space-y-1 block">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/[0.08] text-primary" 
                  : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pb-4">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
