import { Fragment } from 'react';
import { useVideos } from '../hooks/useVideos';
import type { Video } from '../types/talk';
import '../App.css';

interface TalkCardProps {
  video: Video;
}

function TalkCard({ video }: TalkCardProps) {
  // TODO: update so selects url based off aspect ratio
  const imageURL = video.primaryImageSet[0].url;
  const views = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(video.viewedCount)
  return (
    <article className="p-4 border rounded shadow hover:shadow-md transition-shadow">
      <img
        src={imageURL}
        alt={video.title}
        className="w-full object-cover rounded"
        loading="lazy"
      />
      <h3 className="text-lg font-bold mt-2">{video.title}</h3>
      <p className="text-sm text-gray-600">{video.presenterDisplayName}</p>
      <div className="mt-2 text-sm text-gray-500">
        {Math.floor(video.duration / 60)} minutes • {video.viewedCount > 10000 ? <>{views} views</> : null}
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
    <div>
      <div className="flex flex-col">
        {data?.pages.map((page, i) => (
          <Fragment key={i}>
            {page.videos.edges.map(({ node }) => (
              <TalkCard key={node.id} video={node} />
            ))}
          </Fragment>
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
