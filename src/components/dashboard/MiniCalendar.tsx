"use client";

import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button 
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {weekDays.map(day => (
          <div key={day} className="text-[10px] font-bold text-muted-foreground/50 uppercase">
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDate = isToday(day);

          return (
            <div 
              key={idx}
              className={cn(
                "h-8 w-8 flex items-center justify-center text-xs rounded-lg transition-all",
                !isCurrentMonth && "text-muted-foreground/20",
                isCurrentMonth && !isTodayDate && "text-foreground hover:bg-muted cursor-pointer",
                isTodayDate && "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 scale-110"
              )}
            >
              {format(day, "d")}
              {isTodayDate && <div className="absolute -bottom-1 h-1 w-1 bg-white rounded-full" />}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
           <span>Sync Status</span>
           <div className="flex items-center gap-1.5">
             <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
             <span>Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
