import { useState, type KeyboardEvent } from 'react';
import type { YouTubeVideoData } from '../../types';
import homepageData from '../../data/youtubeHomepage.json';

interface YouTubeHomeProps {
  onSearch: (query: string) => void;
  onVideoClick: (videoId: string) => void;
}

function VideoCard({ video, onClick }: { video: YouTubeVideoData; onClick: () => void }) {
  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-[140px] object-cover bg-gray-200"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration ?? '10:01'}
        </span>
      </div>
      <div className="mt-2">
        <h3 className="text-sm font-medium text-[#333] group-hover:text-[#167ac6] line-clamp-2 leading-tight">
          {video.title}
        </h3>
        <p className="text-xs text-[#767676] mt-1">{video.channelName}</p>
        <p className="text-xs text-[#767676]">{video.viewCount} views</p>
      </div>
    </div>
  );
}

function VideoSection({ title, videos, onVideoClick }: { title: string; videos: YouTubeVideoData[]; onVideoClick: (id: string) => void }) {
  if (!videos || videos.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-[#333] mb-3 flex items-center gap-2">
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            onClick={() => onVideoClick(video.videoId)}
          />
        ))}
      </div>
    </div>
  );
}

const data = homepageData as Record<string, YouTubeVideoData[]>;

export function YouTubeHome({ onSearch, onVideoClick }: YouTubeHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-full bg-[#f1f1f1]">
      {/* YouTube 2016 Header - RED */}
      <div className="bg-[#cc181e] h-[50px] flex items-center px-4 gap-4 shadow-sm">
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <span className="text-white text-xl cursor-pointer">&#9776;</span>
          <div className="flex items-center cursor-pointer">
            <div className="bg-[#ff0000] rounded px-1.5 py-0.5 mr-0.5">
              <span className="text-white font-bold text-sm">&#9654;</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">YouTube</span>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-[530px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="flex-1 px-3 py-1.5 border border-[#999] rounded-l text-sm outline-none"
            />
            <button
              onClick={() => searchQuery.trim() && onSearch(searchQuery.trim())}
              className="bg-[#e9e9e9] border border-l-0 border-[#999] px-5 rounded-r text-[#666] hover:bg-[#ddd] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="text-white text-sm border border-white/50 px-3 py-1 rounded hover:bg-white/10 cursor-pointer">
            Upload
          </button>
          <span className="text-white cursor-pointer">&#128276;</span>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer">
            U
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1100px] mx-auto px-6 py-6">
        {/* What to Watch */}
        <div className="bg-white rounded shadow-sm mb-6 p-4 border-t-4 border-[#cc181e]">
          <h1 className="text-xl font-medium text-[#333] mb-1">What to Watch</h1>
          <p className="text-sm text-[#767676] mb-0">Recommended videos for you</p>
        </div>

        <VideoSection title="Trending" videos={data.trending} onVideoClick={onVideoClick} />
        <VideoSection title="Music" videos={data.music} onVideoClick={onVideoClick} />
        <VideoSection title="Gaming" videos={data.gaming} onVideoClick={onVideoClick} />
        <VideoSection title="Recommended" videos={data.recommended} onVideoClick={onVideoClick} />
      </div>
    </div>
  );
}
