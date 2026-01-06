import { useState, useEffect, useCallback, useMemo } from 'react';
import { Task, Priority, SortBy, TaskFilters } from '@/types/task';

const STORAGE_KEY = 'todo-tasks';
const FILTERS_KEY = 'todo-filters';

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Load tasks from localStorage
const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Load filters from localStorage
const loadFilters = (): TaskFilters => {
  try {
    const stored = localStorage.getItem(FILTERS_KEY);
    return stored ? JSON.parse(stored) : {
      search: '',
      sortBy: 'priority' as SortBy,
      showCompleted: true,
    };
  } catch {
    return {
      search: '',
      sortBy: 'priority' as SortBy,
      showCompleted: true,
    };
  }
};

// Priority weight for sorting
const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filters, setFilters] = useState<TaskFilters>(loadFilters);

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Persist filters to localStorage
  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  // Add a new task
  const addTask = useCallback((
    title: string,
    priority: Priority = 'medium',
    dueDate?: string,
    dueTime?: string,
    description?: string
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description,
      completed: false,
      priority,
      dueDate,
      dueTime,
      createdAt: now,
      updatedAt: now,
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  // Update an existing task
  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  // Toggle task completion
  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  }, []);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  // Clear completed tasks
  const clearCompletedTasks = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Check if a task is overdue
  const isOverdue = useCallback((task: Task): boolean => {
    if (!task.dueDate || task.completed) return false;
    
    const now = new Date();
    const dueDateTime = task.dueTime 
      ? new Date(`${task.dueDate}T${task.dueTime}`)
      : new Date(`${task.dueDate}T23:59:59`);
    
    return now > dueDateTime;
  }, []);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by completion status
    if (!filters.showCompleted) {
      result = result.filter(task => !task.completed);
    }

    // Apply sorting
    result.sort((a, b) => {
      // Completed tasks always at the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      switch (filters.sortBy) {
        case 'priority':
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        
        case 'completed':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [tasks, filters]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => isOverdue(t)).length;
    const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    
    return {
      total,
      completed,
      pending: total - completed,
      overdue,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks, isOverdue]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filters,
    stats,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    clearAllTasks,
    clearCompletedTasks,
    updateFilters,
    isOverdue,
  };
}
