import { useState } from 'react';
import type { VinePost as VinePostType } from '../../types';

interface VinePostProps {
  vine: VinePostType;
}

export function VinePost({ vine }: VinePostProps) {
  const [playing, setPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <article className="border-b border-[#e7e7e7] bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        {vine.avatarUrl && !imgError ? (
          <img
            src={vine.avatarUrl}
            alt={vine.displayName}
            className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: vine.videoColor }}
          >
            {vine.displayName[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate font-bold text-[15px] text-[#0f2320]">{vine.displayName}</span>
            {vine.verified && (
              <span className="text-[#00b488] text-xs">&#10003;</span>
            )}
          </div>
          <span className="text-xs text-[#7d8785]">@{vine.username}</span>
        </div>
        <div className="text-right">
          <div className="text-[12px] font-semibold text-[#2f3c38]">{vine.loops.toLocaleString()}</div>
          <div className="text-[11px] text-[#88928f]">Loops</div>
        </div>
      </div>

      <div
        className="relative aspect-square w-full overflow-hidden bg-black"
        style={{
          backgroundColor: vine.videoColor,
          ...(vine.videoId && !playing
            ? {
                backgroundImage: `url(https://img.youtube.com/vi/${vine.videoId}/hqdefault.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}),
        }}
      >
        {playing && vine.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${vine.videoId}?autoplay=1&controls=0&loop=1&mute=1&modestbranding=1&rel=0&showinfo=0&playlist=${vine.videoId}&playsinline=1&disablekb=1&fs=0&iv_load_policy=3`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media"
            style={{ border: 'none' }}
            title={vine.caption}
          />
        ) : (
          <button
            className="absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
            onClick={() => vine.videoId && setPlaying(true)}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/35">
              <div className="ml-1 h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-white" />
            </div>
            {!vine.videoId && (
              <p className="mt-4 px-8 text-center text-xs italic text-white/80">
                {vine.videoDescription}
              </p>
            )}
            <div className="absolute bottom-3 right-3 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
              0:06
            </div>
          </button>
        )}
      </div>

      <div className="px-4 py-3">
        <p className="text-[15px] leading-6 text-[#192623]">{vine.caption}</p>

        <div className="mt-3 flex items-center justify-between text-[#7b8683]">
          <div className="flex items-center gap-5 text-xs">
            <button className="flex cursor-pointer items-center gap-1 hover:text-[#e0245e]">
              <span>&#9829;</span> {vine.likes.toLocaleString()}
            </button>
            <button className="flex cursor-pointer items-center gap-1 hover:text-[#00b488]">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
              {vine.revines.toLocaleString()}
            </button>
            <button className="flex cursor-pointer items-center gap-1 hover:text-[#1da1f2]">
              <span>&#128172;</span> {vine.comments.length}
            </button>
          </div>
          <span className="rounded-full bg-[#effaf6] px-2 py-1 text-[11px] font-semibold text-[#00b488]">
            looping
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          {vine.comments.slice(0, 2).map((comment, i) => (
            <div key={i} className="text-xs text-[#66716e]">
              <span className="font-bold text-[#1d2b28]">{comment.user}</span>{' '}
              {comment.text}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
