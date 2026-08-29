import VideoCard from "../VideoCard";

export default function ChannelVideos({ videos, channelData }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Latest</h3>
      </div>
      {videos?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-10">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} logo={channelData.avatar} channelName={channelData.name} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 py-10">This channel has no videos yet.</div>
      )}
    </div>
  );
}
