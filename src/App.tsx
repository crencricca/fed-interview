import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TalkFilters } from './components/TalkFilters';
import { TalkList } from './components/TalkList';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="text-center bg-blue-800">
          <main className="w-screen h-screen overflow-hidden">
            <TalkFilters
              onSearch={setSearchQuery}
              onTopicChange={setSelectedTopic}
              selectedTopic={selectedTopic}
            />
            <TalkList
              searchQuery={searchQuery}
              topicFilter={selectedTopic}
            />
          </main>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
