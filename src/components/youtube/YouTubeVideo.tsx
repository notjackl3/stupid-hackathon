import { useState, useMemo, type KeyboardEvent } from 'react';
import YouTube from 'react-youtube';
import { getRandomComments } from '../../data/fakeComments';
import type { YouTubeVideoData } from '../../types';
import homepageData from '../../data/youtubeHomepage.json';
import { YouTubeLogo } from './YouTubeLogo';

interface YouTubeVideoProps {
  videoId: string;
  onSearch: (query: string) => void;
  onVideoClick: (videoId: string) => void;
}

function hashValue(seed: string, salt: number) {
  return Array.from(`${seed}-${salt}`).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1 + salt), 0);
}

export function YouTubeVideo({ videoId, onSearch, onVideoClick }: YouTubeVideoProps) {
  const [searchInput, setSearchInput] = useState('');
  const comments = useMemo(() => getRandomComments(10), []);

  // Get all videos from homepage data
  const allVideosFlat = useMemo(() => {
    const data = homepageData as Record<string, YouTubeVideoData[]>;
    return Object.values(data).flat();
  }, []);

  // Find the current video's data
  const currentVideo = useMemo(
    () => allVideosFlat.find((v) => v.videoId === videoId),
    [allVideosFlat, videoId],
  );

  const recommended = useMemo(() => {
    const others = allVideosFlat.filter((v) => v.videoId !== videoId);
    const startIndex = others.length === 0 ? 0 : hashValue(videoId, 1) % others.length;
    return Array.from({ length: Math.min(10, others.length) }, (_, index) => others[(startIndex + index) % others.length]);
  }, [allVideosFlat, videoId]);

  const fallbackViewCount = 100000 + (hashValue(videoId, 2) % 5000000);
  const fallbackLikeCount = 5000 + (hashValue(videoId, 3) % 50000);
  const fallbackDislikeCount = 200 + (hashValue(videoId, 4) % 5000);
  const subscriberCount = 100000 + (hashValue(videoId, 5) % 10000000);
  const subscriberMillions = 1 + (hashValue(videoId, 6) % 10);
  const commentCount = 1000 + (hashValue(videoId, 7) % 50000);

  // Use real stats from data, fall back to generated if video not found
  const viewCount = currentVideo ? parseInt(currentVideo.viewCount.replace(/,/g, ''), 10) : fallbackViewCount;
  const likeCount = currentVideo ? parseInt(currentVideo.likeCount.replace(/,/g, ''), 10) : fallbackLikeCount;
  const dislikeCount = currentVideo ? parseInt(currentVideo.dislikeCount.replace(/,/g, ''), 10) : fallbackDislikeCount;
  const likePercent = Math.round((likeCount / (likeCount + dislikeCount)) * 100);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <div className="min-h-full bg-[#f1f1f1]">
      {/* YouTube Header */}
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

      {/* Video + Sidebar */}
      <div className="max-w-[1200px] mx-auto flex gap-4 px-6 py-4">
        {/* Main content */}
        <div className="flex-1 max-w-[854px]">
          {/* Video Player */}
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '480',
              playerVars: { autoplay: 0 },
            }}
            className="w-full bg-black"
          />

          {/* Video Info */}
          <div className="bg-white mt-0 p-4 border border-[#e6e6e6]">
            <h1 className="text-xl text-[#333] font-normal">
              {currentVideo?.title ?? 'Amazing Video (2016)'}
            </h1>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-[#767676]">
                {viewCount.toLocaleString()} views
              </span>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-sm text-[#767676] cursor-pointer">
                  <span>&#128077;</span> {likeCount.toLocaleString()}
                </button>
                <button className="flex items-center gap-1 text-sm text-[#767676] cursor-pointer">
                  <span>&#128078;</span> {dislikeCount.toLocaleString()}
                </button>
                <button className="text-sm text-[#767676] cursor-pointer">Share</button>
                <button className="text-sm text-[#767676] cursor-pointer">Save</button>
                <button className="text-sm text-[#767676] cursor-pointer">&#8943;</button>
              </div>
            </div>

            {/* Like/dislike bar */}
            <div className="mt-2 h-0.5 bg-[#ddd] rounded overflow-hidden">
              <div className="h-full bg-[#167ac6]" style={{ width: `${likePercent}%` }} />
            </div>
          </div>

          {/* Channel info */}
          <div className="bg-white p-4 border border-t-0 border-[#e6e6e6] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ef4444] flex items-center justify-center text-white font-bold">
              {(currentVideo?.channelName ?? 'C')[0]}
            </div>
            <div className="flex-1">
              <div className="font-medium text-[#333]">
                {currentVideo?.channelName ?? 'Cool Channel'}
              </div>
              <div className="text-xs text-[#767676]">{subscriberMillions.toLocaleString()}M subscribers</div>
            </div>
            <button className="bg-[#cc181e] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#b31217] cursor-pointer">
              SUBSCRIBE {subscriberCount.toLocaleString()}
            </button>
          </div>

          {/* Autoplay toggle */}
          <div className="flex items-center justify-between mt-4 mb-2 px-1">
            <span className="text-sm font-medium text-[#333]">Comments &middot; {commentCount.toLocaleString()}</span>
            <div className="flex items-center gap-2 text-sm text-[#767676]">
              <span>Autoplay</span>
              <div className="w-10 h-5 bg-[#167ac6] rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>

          {/* Add comment */}
          <div className="bg-white p-4 border border-[#e6e6e6] flex items-start gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4285F4] flex items-center justify-center text-white text-sm">U</div>
            <input
              type="text"
              placeholder="Add a public comment..."
              className="flex-1 border-b border-[#e6e6e6] py-1 text-sm outline-none"
            />
          </div>

          {/* Comments */}
          <div className="space-y-0">
            {comments.map((comment, i) => (
              <div key={i} className="bg-white p-4 border border-t-0 border-[#e6e6e6] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs flex-shrink-0">
                  {comment.user[0].toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#333]">{comment.user}</span>
                    <span className="text-xs text-[#767676]">
                      {1 + (hashValue(`${videoId}-${comment.user}`, i + 8) % 11)} months ago
                    </span>
                  </div>
                  <p className="text-sm text-[#333] mt-1">{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-[#767676]">
                    <span className="cursor-pointer">&#128077; {comment.likes}</span>
                    <span className="cursor-pointer">&#128078;</span>
                    <span className="cursor-pointer">Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Google+ integration notice (2016 YouTube used G+ for comments) */}
          <div className="bg-[#f9f9f9] p-3 border border-[#e6e6e6] text-xs text-[#767676] text-center mt-2">
            Comments are powered by Google+ &middot; <a className="text-[#167ac6] cursor-pointer">Learn more</a>
          </div>
        </div>

        {/* Sidebar - Recommended */}
        <div className="w-[300px] flex-shrink-0">
          <div className="text-sm font-medium text-[#333] mb-3">Up next</div>
          <div className="space-y-3">
            {recommended.map((video, i) => (
              <div
                key={video.videoId + i}
                className="flex gap-2 cursor-pointer group"
                onClick={() => onVideoClick(video.videoId)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-[168px] h-[94px] object-cover bg-gray-200"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 rounded">
                    {video.duration ?? '10:01'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-[#333] group-hover:text-[#167ac6] line-clamp-2 leading-tight">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-[#767676] mt-1">{video.channelName}</p>
                  <p className="text-[11px] text-[#767676]">{video.viewCount} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
