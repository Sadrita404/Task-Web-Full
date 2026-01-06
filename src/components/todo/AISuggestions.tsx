import { Lightbulb, Clock, TrendingUp, Sparkles, X } from 'lucide-react';
import { AISuggestion } from '@/types/task';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
}

export function AISuggestions({ suggestions }: AISuggestionsProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleSuggestions = suggestions.filter(s => !dismissed.has(s.id));

  if (visibleSuggestions.length === 0) {
    return null;
  }

  const iconMap = {
    lightbulb: Lightbulb,
    clock: Clock,
    trending: TrendingUp,
  };

  const typeStyles = {
    productivity: 'bg-primary/10 border-primary/20',
    reminder: 'bg-warning/10 border-warning/20',
    pattern: 'bg-info/10 border-info/20',
  };

  const iconStyles = {
    productivity: 'text-primary',
    reminder: 'text-warning',
    pattern: 'text-info',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>AI Insights</span>
      </div>

      <div className="space-y-2">
        {visibleSuggestions.map((suggestion) => {
          const Icon = iconMap[suggestion.icon];
          
          return (
            <div
              key={suggestion.id}
              className={cn(
                "relative flex items-start gap-3 p-4 rounded-xl border animate-fade-in",
                typeStyles[suggestion.type]
              )}
            >
              <div className={cn(
                "p-2 rounded-lg bg-background/50",
                iconStyles[suggestion.type]
              )}>
                <Icon className="h-4 w-4" />
              </div>
              
              <p className="flex-1 text-sm leading-relaxed pr-6">
                {suggestion.message}
              </p>

              <button
                onClick={() => setDismissed(prev => new Set([...prev, suggestion.id]))}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
