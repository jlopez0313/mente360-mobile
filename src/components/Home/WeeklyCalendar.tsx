import { weekDays } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface WeeklyCalendarProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

export function WeeklyCalendar({ selectedDay, onSelectDay }: WeeklyCalendarProps) {
  const today = new Date().getDay();

  // Get the dates for the current week
  const getWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const dates: Date[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - currentDay + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="px-4 py-4">
      <div className="bg-card rounded-2xl p-4 shadow-card">
        <div className="flex items-center justify-between">
          {weekDays.map((day, index) => {
            const date = weekDates[index];
            const isToday = index === today;
            const isSelected = index === selectedDay;

            return (
              <button
                key={index}
                className={cn(
                  "flex flex-col items-center gap-1 !p-2 !rounded-xl transition-all min-w-[40px]",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && isToday && "bg-primary/10",
                  !isSelected && !isToday && "hover:bg-muted"
                )}
              >
                <span className={cn(
                  "text-xs font-medium",
                  isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                  {day}
                </span>
                <span className={cn(
                  "text-base font-semibold",
                  isSelected ? "text-primary-foreground" : "text-foreground"
                )}>
                  {date.getDate()}
                </span>
                {isToday && !isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
