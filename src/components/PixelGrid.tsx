import { useMemo } from 'react';
import { TrackerKey } from '@/types/tracker';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, startOfYear, endOfYear, eachDayOfInterval, getMonth, isToday, isFuture } from 'date-fns';

interface PixelGridProps {
  entries: Record<string, string | null>;
  keys: TrackerKey[];
  onDayClick: (date: string) => void;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PixelGrid = ({ entries, keys, onDayClick }: PixelGridProps) => {
  const currentYear = new Date().getFullYear();
  
  const days = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [currentYear]);

  const getKeyById = (keyId: string | null) => {
    if (!keyId) return null;
    return keys.find(k => k.id === keyId);
  };

  const getPixelColor = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const keyId = entries[dateStr];
    const key = getKeyById(keyId);
    return key?.color || null;
  };

  // Group days by month
  const monthGroups = useMemo(() => {
    const groups: Date[][] = Array.from({ length: 12 }, () => []);
    days.forEach(day => {
      groups[getMonth(day)].push(day);
    });
    return groups;
  }, [days]);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[900px]">
        <TooltipProvider delayDuration={100}>
          <div className="space-y-4">
            {monthGroups.map((monthDays, monthIndex) => (
              <div key={monthIndex} className="flex items-start gap-3">
                <div className="w-10 text-sm text-muted-foreground font-medium pt-1">
                  {monthNames[monthIndex]}
                </div>
                <div className="flex flex-wrap gap-1">
                  {monthDays.map((day) => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const color = getPixelColor(day);
                    const isCurrentDay = isToday(day);
                    const isFutureDay = isFuture(day);
                    const keyId = entries[dateStr];
                    const key = getKeyById(keyId);

                    return (
                      <Tooltip key={dateStr}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => !isFutureDay && onDayClick(dateStr)}
                            disabled={isFutureDay}
                            className={`
                              w-5 h-5 rounded-sm transition-all duration-150
                              ${isFutureDay ? 'opacity-30 cursor-not-allowed' : 'hover:scale-125 hover:z-10 cursor-pointer'}
                              ${isCurrentDay ? 'ring-2 ring-primary ring-offset-1' : ''}
                              ${!color ? 'bg-muted hover:bg-muted/80' : ''}
                            `}
                            style={color ? { backgroundColor: color } : undefined}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <p className="font-medium">{format(day, 'EEEE, MMMM d')}</p>
                          {key && <p className="text-muted-foreground">{key.name}</p>}
                          {!key && !isFutureDay && <p className="text-muted-foreground">No entry</p>}
                          {isFutureDay && <p className="text-muted-foreground">Future date</p>}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
};
