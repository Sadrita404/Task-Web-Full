import { useState, KeyboardEvent } from 'react';
import { Plus, Calendar, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Priority } from '@/types/task';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskInputProps {
  onAddTask: (
    title: string,
    priority: Priority,
    dueDate?: string,
    dueTime?: string
  ) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [dueTime, setDueTime] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onAddTask(
      title,
      priority,
      dueDate ? format(dueDate, 'yyyy-MM-dd') : undefined,
      dueTime || undefined
    );
    
    // Reset form
    setTitle('');
    setPriority('medium');
    setDueDate(undefined);
    setDueTime('');
    setIsExpanded(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const priorityColors = {
    high: 'text-priority-high',
    medium: 'text-priority-medium',
    low: 'text-priority-low',
  };

  return (
    <div className="glass rounded-xl p-4 space-y-3 animate-fade-in">
      {/* Main input row */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a new task... (Press Enter to add)"
            className="bg-secondary/50 border-border/50 focus:border-primary pr-10 h-12 text-base"
          />
          <Plus className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Button 
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="h-12 px-6 bg-primary hover:bg-primary/90"
        >
          Add Task
        </Button>
      </div>

      {/* Expanded options */}
      {isExpanded && (
        <div className="flex flex-wrap gap-3 animate-fade-in">
          {/* Priority selector */}
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
            <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
              <Flag className={cn("h-4 w-4 mr-2", priorityColors[priority])} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-priority-high" />
                  High
                </span>
              </SelectItem>
              <SelectItem value="medium">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-priority-medium" />
                  Medium
                </span>
              </SelectItem>
              <SelectItem value="low">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-priority-low" />
                  Low
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Due date picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={cn(
                  "bg-secondary/50 border-border/50",
                  dueDate && "text-foreground"
                )}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Due date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Due time */}
          {dueDate && (
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="pl-10 w-[140px] bg-secondary/50 border-border/50"
              />
            </div>
          )}

          {/* Clear date */}
          {dueDate && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setDueDate(undefined);
                setDueTime('');
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear date
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
