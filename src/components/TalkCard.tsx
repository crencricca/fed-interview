import type { Video } from '../types/talk';
import '../App.css';

interface TalkCardProps {
  isDisplayed: boolean,
  video: Video;
}

function TalkCard({ isDisplayed, video }: TalkCardProps) {
  const imageURL = video.primaryImageSet[0].url;
  const views = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(video.viewedCount)
  return (
    <article
      className="flex h-screen w-screen object-cover rounded shadow hover:shadow-md transition-shadow overflow-hidden"
      style={isDisplayed ? {} : { display: 'none' }}
    >
      <img
        src={imageURL}
        alt={video.title}
        className="w-full bg-cover bg-center rounded align-end"
        loading={!isDisplayed ? "lazy" : undefined}
      />
      <div className="absolute w-full bottom-0 left-0 text-left bg-blue-800 px-4 py-2 ">
        <div className="flex flex-col gap-2">
          <h3 className="text-6xl font-bold mt-2 text-white uppercase">{video.title}</h3>
          <p className="text-2xl text-white">{video.presenterDisplayName}</p>
          <div className="text-lg text-pink-300 ">
            {Math.floor(video.duration / 60)} minutes {video.viewedCount > 10000 ? <>• {views} views</> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

export default TalkCard