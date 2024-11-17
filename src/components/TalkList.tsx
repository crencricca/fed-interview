import { Fragment, useEffect, useState } from 'react';
import { useVideos } from '../hooks/useVideos';
import type { Video } from '../types/talk';
import '../App.css';

interface TalkCardProps {
  isDisplayed: boolean,
  video: Video;
}

function TalkCard({ isDisplayed, video }: TalkCardProps) {
  // TODO: update so selects url based off aspect ratio
  const imageURL = video.primaryImageSet[0].url;
  const views = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(video.viewedCount)
  return (
    <article
      className="border rounded shadow hover:shadow-md transition-shadow"
      style={isDisplayed ? {} : { display: 'none' }}
    >
      <img
        src={imageURL}
        alt={video.title}
        className="object-cover max-h-full bg-center bg-cover rounded"
        loading="lazy"
      />
      <div className="absolute w-full bottom-0 left-0 text-left bg-slate-50">
        <div className="flex flex-col gap-2">
          <h3 className="text-8xl font-bold mt-2 text-black">{video.title}</h3>
          <p className="text-2xl text-gray-600">{video.presenterDisplayName}</p>
          <div className="text-lg text-gray-500">
            {Math.floor(video.duration / 60)} minutes • {video.viewedCount > 10000 ? <>{views} views</> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

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

  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrent(prev => {
        const next = prev + 1;
        const endCursor = Number(data?.pages[0].videos.pageInfo.endCursor);
        if (next === endCursor) fetchNextPage();
        if (next < endCursor) {
          return next;
        }
        else return 1;
      })
      // TODO: if cursor == endCursor + 2, call next page
    }, 1000 * 5);
    return () => clearInterval(intervalId);
  }, [data, fetchNextPage])

  if (isLoading) {
    return (
      <div role="alert" aria-busy="true" className="loading-state">
        <span className="sr-only">Loading talks...</span>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="error-state">
        <h2>Error Loading Talks</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col object-cover">
      <div>
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.videos.edges.map(({ cursor, node }) => (
              <TalkCard key={node.id} isDisplayed={current === Number(cursor)} video={node} />
            ))}
          </Fragment>
        ))}
      </div>

      {/* {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )} */}
    </div>
  );
}
