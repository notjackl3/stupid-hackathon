import { useState, useEffect, type KeyboardEvent } from 'react';
import type { YouTubeVideoData } from '../../types';
import { searchYouTube } from '../../lib/youtube';
import homepageData from '../../data/youtubeHomepage.json';
import { YouTubeLogo } from './YouTubeLogo';

interface YouTubeResultsProps {
  query: string;
  onSearch: (query: string) => void;
  onVideoClick: (videoId: string) => void;
}

function ResultCard({ video, onClick }: { video: YouTubeVideoData; onClick: () => void }) {
  return (
    <div className="flex gap-3 cursor-pointer group py-3 border-b border-[#e6e6e6]" onClick={onClick}>
      <div className="relative flex-shrink-0">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-[246px] h-[138px] object-cover bg-gray-200"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration ?? '10:01'}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-lg text-[#167ac6] group-hover:underline leading-tight">
          {video.title}
        </h3>
        <p className="text-xs text-[#767676] mt-1">
          by <span className="text-[#333]">{video.channelName}</span> &middot; {video.viewCount} views
        </p>
        <p className="text-xs text-[#767676] mt-0.5">{video.publishedAt}</p>
      </div>
    </div>
  );
}

export function YouTubeResults({ query, onSearch, onVideoClick }: YouTubeResultsProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<YouTubeVideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    searchYouTube(query).then((videos) => {
      if (cancelled) return;

      if (videos.length === 0) {
        // Fallback to homepage data
        const allVideos = Object.values(homepageData as Record<string, YouTubeVideoData[]>).flat();
        const filtered = allVideos.filter((v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.channelName.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.length > 0 ? filtered : allVideos.slice(0, 8));
      } else {
        setResults(videos);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="min-h-full bg-[#f1f1f1]">
      {/* YouTube 2016 Header */}
      <div className="bg-[#cc181e] h-[50px] flex items-center px-4 gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-white text-xl cursor-pointer">&#9776;</span>
          <div className="flex items-center cursor-pointer" onClick={() => onSearch('')}>
            <YouTubeLogo variant="white" />
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-[530px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="flex-1 px-3 py-1.5 border border-[#999] rounded-l text-sm outline-none"
            />
            <button
              onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
              className="bg-[#e9e9e9] border border-l-0 border-[#999] px-5 rounded-r text-[#666] hover:bg-[#ddd] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="text-white text-sm border border-white/50 px-3 py-1 rounded hover:bg-white/10 cursor-pointer">Upload</button>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer">U</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#e6e6e6] px-6 py-2">
        <div className="max-w-[800px] mx-auto flex items-center gap-4 text-sm text-[#767676]">
          <span className="font-medium text-[#333]">Filters</span>
          <span className="cursor-pointer hover:text-[#333]">Upload date &#9662;</span>
          <span className="cursor-pointer hover:text-[#333]">Type &#9662;</span>
          <span className="cursor-pointer hover:text-[#333]">Duration &#9662;</span>
          <span className="ml-auto text-xs">About {results.length.toLocaleString()} results</span>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[800px] mx-auto bg-white mt-2 px-6">
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-[#cc181e] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#767676] mt-3">Loading 2016 videos...</p>
          </div>
        ) : (
          results.map((video) => (
            <ResultCard
              key={video.videoId}
              video={video}
              onClick={() => onVideoClick(video.videoId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
