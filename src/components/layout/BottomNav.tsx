"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, FileText, User, Calendar, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { label: "Todos", href: "/dashboard/todos", icon: CheckSquare },
  { label: "Notes", href: "/dashboard/notes", icon: FileText },
  { label: "DSA", href: "/dashboard/dsa", icon: Code },
  { label: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface/85 backdrop-blur-xl z-50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 mx-1"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute top-0 w-10 h-1 bg-primary rounded-b-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn("h-[22px] w-[22px] transition-colors relative z-10", isActive ? "text-primary" : "text-muted-foreground")} 
              />
              <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
