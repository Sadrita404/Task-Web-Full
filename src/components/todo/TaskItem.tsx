import { useState } from 'react';
import { Check, Trash2, Edit3, Calendar, Clock, Flag, X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Priority } from '@/types/task';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  isOverdue: boolean;
  onToggleComplete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ 
  task, 
  isOverdue, 
  onToggleComplete, 
  onUpdate, 
  onDelete 
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [editDueTime, setEditDueTime] = useState(task.dueTime || '');

  const handleSave = () => {
    if (!editTitle.trim()) return;
    
    onUpdate(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      dueDate: editDueDate ? format(editDueDate, 'yyyy-MM-dd') : undefined,
      dueTime: editDueTime || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    setEditDueTime(task.dueTime || '');
    setIsEditing(false);
  };

  const priorityConfig = {
    high: {
      color: 'text-priority-high',
      bg: 'priority-high-bg',
      label: 'High',
    },
    medium: {
      color: 'text-priority-medium',
      bg: 'priority-medium-bg',
      label: 'Medium',
    },
    low: {
      color: 'text-priority-low',
      bg: 'priority-low-bg',
      label: 'Low',
    },
  };

  const config = priorityConfig[task.priority];

  if (isEditing) {
    return (
      <div className="glass rounded-xl p-4 space-y-3 animate-scale-in">
        <Input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="bg-secondary/50 border-border/50"
          autoFocus
        />
        
        <div className="flex flex-wrap gap-3">
          <Select value={editPriority} onValueChange={(v) => setEditPriority(v as Priority)}>
            <SelectTrigger className="w-[130px] bg-secondary/50">
              <Flag className={cn("h-4 w-4 mr-2", priorityConfig[editPriority].color)} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-secondary/50">
                <Calendar className="h-4 w-4 mr-2" />
                {editDueDate ? format(editDueDate, 'MMM d') : 'Due date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={editDueDate}
                onSelect={setEditDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {editDueDate && (
            <Input
              type="time"
              value={editDueTime}
              onChange={(e) => setEditDueTime(e.target.value)}
              className="w-[120px] bg-secondary/50"
            />
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "glass rounded-xl p-4 transition-all duration-200 hover:shadow-lg animate-slide-in group",
        task.completed && "opacity-60",
        isOverdue && !task.completed && "overdue"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-all",
              task.completed 
                ? "bg-primary border-primary" 
                : cn("border-muted-foreground/50", config.color)
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn(
              "font-medium text-base",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            
            {/* Priority badge */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
              config.bg,
              config.color
            )}>
              <Flag className="h-3 w-3" />
              {config.label}
            </span>

            {/* Overdue badge */}
            {isOverdue && !task.completed && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/20 text-destructive border border-destructive/30">
                Overdue
              </span>
            )}
          </div>

          {/* Due date/time */}
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-2 mt-2 text-sm",
              isOverdue && !task.completed ? "text-destructive" : "text-muted-foreground"
            )}>
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              {task.dueTime && (
                <>
                  <Clock className="h-3.5 w-3.5 ml-2" />
                  <span>{task.dueTime}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
