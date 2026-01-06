import { useMemo } from 'react';
import { Task, AISuggestion } from '@/types/task';

// Generate AI-like suggestions based on task patterns
export function useAISuggestions(tasks: Task[], isOverdue: (task: Task) => boolean) {
  const suggestions = useMemo<AISuggestion[]>(() => {
    const result: AISuggestion[] = [];
    const now = new Date();
    const hour = now.getHours();

    // No tasks - suggest getting started
    if (tasks.length === 0) {
      result.push({
        id: 'empty',
        message: "Start your productivity journey! Add your first task to get organized.",
        type: 'productivity',
        icon: 'lightbulb',
      });
      return result;
    }

    // Morning productivity (6 AM - 12 PM)
    if (hour >= 6 && hour < 12) {
      const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed);
      if (highPriorityTasks.length > 0) {
        result.push({
          id: 'morning-high',
          message: `Great morning for productivity! You have ${highPriorityTasks.length} high-priority task${highPriorityTasks.length > 1 ? 's' : ''} to tackle.`,
          type: 'productivity',
          icon: 'trending',
        });
      }
    }

    // Afternoon check-in (12 PM - 5 PM)
    if (hour >= 12 && hour < 17) {
      const completedToday = tasks.filter(t => {
        if (!t.completed) return false;
        const updated = new Date(t.updatedAt);
        return updated.toDateString() === now.toDateString();
      });
      
      if (completedToday.length > 0) {
        result.push({
          id: 'afternoon-progress',
          message: `You've completed ${completedToday.length} task${completedToday.length > 1 ? 's' : ''} today. Keep up the momentum!`,
          type: 'productivity',
          icon: 'trending',
        });
      }
    }

    // Evening wind-down (5 PM - 9 PM)
    if (hour >= 17 && hour < 21) {
      const pendingForTomorrow = tasks.filter(t => !t.completed).length;
      if (pendingForTomorrow > 0) {
        result.push({
          id: 'evening-plan',
          message: `You have ${pendingForTomorrow} pending task${pendingForTomorrow > 1 ? 's' : ''}. Consider planning tomorrow's priorities.`,
          type: 'reminder',
          icon: 'clock',
        });
      }
    }

    // Overdue tasks warning
    const overdueTasks = tasks.filter(t => isOverdue(t));
    if (overdueTasks.length > 0) {
      result.push({
        id: 'overdue-warning',
        message: `⚠️ You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}. Consider rescheduling or completing them.`,
        type: 'reminder',
        icon: 'clock',
      });
    }

    // Completion rate pattern
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (completionRate >= 80 && totalTasks >= 5) {
      result.push({
        id: 'high-completion',
        message: `Amazing! You've completed ${Math.round(completionRate)}% of your tasks. You're on fire! 🔥`,
        type: 'pattern',
        icon: 'trending',
      });
    } else if (completionRate < 30 && totalTasks >= 5) {
      result.push({
        id: 'low-completion',
        message: "Try breaking down larger tasks into smaller, manageable steps.",
        type: 'productivity',
        icon: 'lightbulb',
      });
    }

    // Priority distribution insight
    const highCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const totalPending = tasks.filter(t => !t.completed).length;
    
    if (highCount > totalPending * 0.5 && totalPending >= 3) {
      result.push({
        id: 'priority-imbalance',
        message: "Many high-priority tasks detected. Consider if some can be delegated or deprioritized.",
        type: 'pattern',
        icon: 'lightbulb',
      });
    }

    // Due date clustering
    const tasksWithDueDates = tasks.filter(t => t.dueDate && !t.completed);
    const todayStr = now.toISOString().split('T')[0];
    const tomorrowStr = new Date(now.getTime() + 86400000).toISOString().split('T')[0];
    
    const dueToday = tasksWithDueDates.filter(t => t.dueDate === todayStr).length;
    const dueTomorrow = tasksWithDueDates.filter(t => t.dueDate === tomorrowStr).length;

    if (dueToday >= 3) {
      result.push({
        id: 'busy-day',
        message: `Busy day ahead! ${dueToday} tasks are due today. Prioritize wisely.`,
        type: 'reminder',
        icon: 'clock',
      });
    }

    if (dueTomorrow >= 3) {
      result.push({
        id: 'busy-tomorrow',
        message: `${dueTomorrow} tasks due tomorrow. Get a head start if you can!`,
        type: 'reminder',
        icon: 'clock',
      });
    }

    // Limit to 3 most relevant suggestions
    return result.slice(0, 3);
  }, [tasks, isOverdue]);

  return suggestions;
}
