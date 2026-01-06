// Task type definitions for the to-do app

export type Priority = 'high' | 'medium' | 'low';

export type SortBy = 'priority' | 'dueDate' | 'completed' | 'createdAt';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO string
  dueTime?: string; // HH:mm format
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TaskFilters {
  search: string;
  sortBy: SortBy;
  showCompleted: boolean;
}

export interface AISuggestion {
  id: string;
  message: string;
  type: 'productivity' | 'reminder' | 'pattern';
  icon: 'lightbulb' | 'clock' | 'trending';
}
