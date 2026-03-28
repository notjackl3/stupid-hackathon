import { useEffect, useRef, useState } from 'react';
import type { VinePost as VinePostType } from '../../types';

interface VinePostProps {
  vine: VinePostType;
}

function hashString(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function avatarSvgDataUri(vine: VinePostType) {
  const seed = hashString(`${vine.username}:${vine.displayName}`);
  const palettes = [
    ['#f8d56c', '#ef7f5f', '#31243a'],
    ['#79d9c5', '#2fbf90', '#173d3f'],
    ['#9fc7ff', '#5d7ce2', '#1f2859'],
    ['#f7b3c8', '#d45f8c', '#4c2131'],
    ['#ffd7a0', '#ff955f', '#4b2f24'],
    ['#b9f1a7', '#5bc56e', '#1d3f29'],
  ];
  const [base, accent, ink] = palettes[seed % palettes.length];
  const initial = vine.displayName.trim().charAt(0).toUpperCase() || '?';
  const offsetA = 12 + (seed % 14);
  const offsetB = 66 - (seed % 12);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="88" height="88" rx="44" fill="url(#bg)" />
      <circle cx="${offsetA}" cy="16" r="10" fill="#ffffff" fill-opacity="0.18" />
      <circle cx="${offsetB}" cy="72" r="12" fill="#ffffff" fill-opacity="0.12" />
      <path d="M23 67c2-13 11-21 21-21s19 8 21 21" fill="${ink}" fill-opacity="0.2" />
      <circle cx="44" cy="35" r="16" fill="#fff4e8" />
      <path d="M29 34c1-9 7-15 15-15 9 0 15 6 15 15-6-3-12-4-18-4-5 0-9 1-12 4z" fill="${ink}" />
      <circle cx="38" cy="36" r="1.8" fill="${ink}" />
      <circle cx="50" cy="36" r="1.8" fill="${ink}" />
      <path d="M39 43c2 2 8 2 10 0" fill="none" stroke="${ink}" stroke-linecap="round" stroke-width="2.2" />
      <circle cx="65" cy="64" r="11" fill="#ffffff" fill-opacity="0.94" />
      <text x="65" y="68" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${ink}">
        ${initial}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

export function VinePost({ vine }: VinePostProps) {
  const [playing, setPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const fallbackAvatarUrl = avatarSvgDataUri(vine);
  const avatarUrl = !imgError && vine.avatarUrl ? vine.avatarUrl : fallbackAvatarUrl;

  useEffect(() => {
    const node = articleRef.current;
    if (!node || !vine.videoId) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
          setPlaying(true);
        } else if (!entry.isIntersecting || entry.intersectionRatio < 0.45) {
          setPlaying(false);
        }
      },
      { threshold: [0, 0.45, 0.65, 0.7] }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [vine.videoId]);

  return (
    <article ref={articleRef} className="border-b border-[#e7e7e7] bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={avatarUrl}
          alt={vine.displayName}
          className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
          onError={() => setImgError(true)}
        />
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
            src={`https://www.youtube.com/embed/${vine.videoId}?autoplay=1&controls=0&loop=1&mute=0&modestbranding=1&rel=0&showinfo=0&playlist=${vine.videoId}&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`}
            className="absolute inset-0 h-full w-full pointer-events-none"
            allow="autoplay; encrypted-media; picture-in-picture"
            style={{ border: 'none', transform: 'scale(1.08)', transformOrigin: 'center center' }}
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
