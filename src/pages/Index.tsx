import { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useAISuggestions } from '@/hooks/useAISuggestions';
import { Header } from '@/components/todo/Header';
import { ProgressBar } from '@/components/todo/ProgressBar';
import { TaskInput } from '@/components/todo/TaskInput';
import { TaskFilters } from '@/components/todo/TaskFilters';
import { TaskList } from '@/components/todo/TaskList';
import { AISuggestions } from '@/components/todo/AISuggestions';

const Index = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const {
    tasks, allTasks, filters, stats,
    addTask, updateTask, toggleComplete, deleteTask,
    clearAllTasks, clearCompletedTasks, updateFilters, isOverdue,
  } = useTasks();

  const suggestions = useAISuggestions(allTasks, isOverdue);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="space-y-6 sm:space-y-8">
          <Header
            onClearAll={clearAllTasks}
            onClearCompleted={clearCompletedTasks}
            hasCompletedTasks={allTasks.some(t => t.completed)}
            hasTasks={allTasks.length > 0}
            isDark={isDark}
            onToggleTheme={() => setIsDark(!isDark)}
          />
          <ProgressBar stats={stats} />
          <AISuggestions suggestions={suggestions} />
          <TaskInput onAddTask={addTask} />
          {allTasks.length > 0 && (
            <TaskFilters filters={filters} onFilterChange={updateFilters} />
          )}
          <TaskList
            tasks={tasks}
            isOverdue={isOverdue}
            onToggleComplete={toggleComplete}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        </div>
        <footer className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>TaskFlow • Data stored locally in your browser</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
