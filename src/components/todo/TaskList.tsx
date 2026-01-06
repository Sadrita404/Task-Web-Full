import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { ListTodo } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isOverdue: (task: Task) => boolean;
  onToggleComplete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ 
  tasks, 
  isOverdue, 
  onToggleComplete, 
  onUpdate, 
  onDelete 
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
          <ListTodo className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">
          Add your first task to get started with your productivity journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div 
          key={task.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TaskItem
            task={task}
            isOverdue={isOverdue(task)}
            onToggleComplete={onToggleComplete}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
