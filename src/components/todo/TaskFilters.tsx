import { Search, SlidersHorizontal, ArrowUpDown, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskFilters as FilterType, SortBy } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: Partial<FilterType>) => void;
}

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'createdAt', label: 'Created' },
    { value: 'completed', label: 'Status' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search tasks..."
          className="pl-10 bg-secondary/50 border-border/50"
        />
      </div>

      <div className="flex gap-2">
        {/* Sort selector */}
        <Select 
          value={filters.sortBy} 
          onValueChange={(v) => onFilterChange({ sortBy: v as SortBy })}
        >
          <SelectTrigger className="w-[140px] bg-secondary/50 border-border/50">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle completed visibility */}
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "bg-secondary/50 border-border/50",
            !filters.showCompleted && "text-muted-foreground"
          )}
          onClick={() => onFilterChange({ showCompleted: !filters.showCompleted })}
          title={filters.showCompleted ? 'Hide completed' : 'Show completed'}
        >
          {filters.showCompleted ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
