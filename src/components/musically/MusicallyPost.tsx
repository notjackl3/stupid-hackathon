import { useEffect, useRef, useState } from 'react';
import type { MusicallyPost as MusicallyPostType } from '../../types';

interface MusicallyPostProps {
  post: MusicallyPostType;
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatClipLength(startSeconds?: number, endSeconds?: number) {
  if (typeof startSeconds === 'number' && typeof endSeconds === 'number' && endSeconds > startSeconds) {
    return `0:${String(endSeconds - startSeconds).padStart(2, '0')}`;
  }

  return '0:05';
}

export function MusicallyPost({ post }: MusicallyPostProps) {
  const [playing, setPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);
  const clipLength = formatClipLength(post.startSeconds, post.endSeconds);
  const clipParams =
    typeof post.startSeconds === 'number' && typeof post.endSeconds === 'number'
      ? `&start=${post.startSeconds}&end=${post.endSeconds}`
      : '';

  useEffect(() => {
    const node = articleRef.current;
    if (!node || !post.videoId) {
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
  }, [post.videoId]);

  return (
    <article ref={articleRef} className="bg-white">
      <div className="px-3 py-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-3">
            {post.avatarUrl && !imgError ? (
              <img
                src={post.avatarUrl}
                alt={post.displayName}
                className="h-11 w-11 rounded-full border border-[#f0dfe3] object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#f0dfe3] text-sm font-bold text-white"
                style={{ backgroundColor: post.videoColor }}
              >
                {post.displayName[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[15px] font-bold text-[#39363d]">{post.displayName}</span>
                {post.verified && (
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ffd36b] text-[10px] text-[#6a3b08]">
                    ♛
                  </span>
                )}
              </div>
              <div className="truncate text-[11px] text-[#9b8d94]">
                @{post.username} • {post.fans}
              </div>
            </div>
          </div>

          <div className="rounded-full border border-[#f1d8de] bg-[#fff7f8] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f05f7b]">
            {post.category}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[20px] border border-[#efe4e6] bg-black">
          <div
            className="relative aspect-[9/16] w-full overflow-hidden"
            style={{
              backgroundColor: post.videoColor,
              ...(post.videoId && !playing
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.28)), url(https://img.youtube.com/vi/${post.videoId}/hqdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}),
            }}
          >
            {playing && post.videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${post.videoId}?autoplay=1&controls=0&loop=1&mute=0&modestbranding=1&rel=0&showinfo=0&playlist=${post.videoId}&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0${clipParams}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                style={{ border: 'none', transform: 'scale(1.08)', transformOrigin: 'center center' }}
                title={post.caption}
              />
            ) : (
              <button
                onClick={() => post.videoId && setPlaying(true)}
                className="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center"
              >
                <div className="rounded-full bg-white/92 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f05f7b] shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
                  Play Clip
                </div>
              </button>
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/32 via-black/8 to-transparent px-4 pb-6 pt-4">
              <div className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f05f7b]">
                featured
              </div>
              <div className="rounded-full bg-black/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                {clipLength}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[76px] flex-col items-center justify-end gap-4 bg-gradient-to-l from-black/18 via-black/4 to-transparent px-3 pb-5">
              <div className="flex flex-col items-center gap-1 text-white">
                <div className="text-xl leading-none">♥</div>
                <span className="text-[11px] font-semibold">{formatCompact(post.hearts)}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white">
                <div className="text-xl leading-none">💬</div>
                <span className="text-[11px] font-semibold">{post.comments.length}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-white">
                <div className="text-xl leading-none">↗</div>
                <span className="text-[11px] font-semibold">{formatCompact(post.shares)}</span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/74 via-black/28 to-transparent px-4 pb-4 pt-16 text-white">
              <div className="max-w-[78%]">
                <p className="text-[15px] font-semibold leading-5">{post.caption}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-medium text-white/86">
                  {post.hashtags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
                <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-white/14 px-3 py-2 text-[11px]">
                  <span className="text-[13px]">♪</span>
                  <span className="truncate">
                    {post.songTitle} • {post.artist}
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-4 text-white/68">
                  {post.city ? `${post.city} • ` : ''}
                  {post.videoDescription}
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-3 right-[76px] rounded-full bg-black/22 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/82">
              musical.ly
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-[18px] border border-[#f2e3e7] bg-[#fffafb] px-3 py-3">
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#c0abb1]">hot comments</div>
          <div className="mt-2 space-y-1.5">
            {post.comments.slice(0, 2).map((comment, index) => (
              <div key={`${comment.user}-${index}`} className="text-[12px] leading-5 text-[#6e646b]">
                <span className="font-semibold text-[#403b42]">{comment.user}</span> {comment.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
