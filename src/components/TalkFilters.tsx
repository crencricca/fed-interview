import { useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface TalkFiltersProps {
  onSearch: (query: string) => void;
  onTopicChange: (topic: string) => void;
  selectedTopic?: string;
}

export function TalkFilters({ onSearch, onTopicChange, selectedTopic }: TalkFiltersProps) {
  const debouncedSearch = useDebounce(onSearch, 300);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="search"
          placeholder="Search talks..."
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search talks"
        />
      </div>
      <div className="w-full sm:w-48 p-2">
        <select
          value={selectedTopic || ''}
          onChange={(e) => onTopicChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by topic"
        >
          <option value="">All Topics</option>
          <option value="Technology">Technology</option>
          <option value="Science">Science</option>
          <option value="Global Issues">Global Issues</option>
          <option value="Design">Design</option>
        </select>
      </div>
    </div>
  );
}
