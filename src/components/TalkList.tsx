import { Fragment, useEffect, useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import '../App.css';
import TalkCard from './TalkCard';

interface TalkListProps {
  searchQuery?: string;
  topicFilter?: string;
}

export function TalkList({ searchQuery, topicFilter }: TalkListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useVideos({
    searchQuery,
    topicFilter,
  });

  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex(prevIndex => {
        const videos = data?.pages[page].videos.edges;
        if (!videos) return prevIndex;

        const nextIndex = prevIndex + 1;
        const pageLength = videos.length;
        const pageIndex = data?.pages.length - 1;

        // Load next page when halfway through current page
        if (hasNextPage && !isFetchingNextPage && nextIndex === Math.floor((pageLength + 1) / 2)) {
          fetchNextPage();
        } else if (nextIndex >= pageLength - 1 && pageIndex > page) {
          setPage(pageIndex);
          return 0;
        }

        if (nextIndex < pageLength && videos[nextIndex]) {
          return nextIndex;
        }
        return 0;
      })
    }, 1000 * 5);
    return () => clearInterval(intervalId);
  }, [data])

  useEffect(() => {
    setIndex(0);
  }, [searchQuery, topicFilter])

  if (isLoading) {
    return (
      <div role="alert" aria-busy="true" className="loading-state">
        <span className="sr-only">Loading talks...</span>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const videos = data?.pages[page].videos.edges;

  if (error || !videos) {
    return (
      <div role="alert" className="error-state">
        <h2>Error Loading Talks</h2>
        <p>{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.videos.edges.map(({ cursor, node }) => (
              <TalkCard key={node.id} isDisplayed={videos[index].cursor === cursor} video={node} />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
