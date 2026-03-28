import { useState } from 'react';
import type { TumblrPost as TumblrPostType, TumblrReblogEntry } from '../../types';

interface TumblrPostProps {
  post: TumblrPostType;
  onTagClick: (tag: string) => void;
}

function Avatar({ label, color, size = 32 }: { label: string; color?: string; size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-[3px] font-bold uppercase text-white"
      style={{
        backgroundColor: color ?? '#51627a',
        width: size,
        height: size,
        fontSize: size * 0.42,
      }}
    >
      {label.slice(0, 1)}
    </div>
  );
}

function ReblogEntry({ entry, depth }: { entry: TumblrReblogEntry; depth: number }) {
  return (
    <div className="border-l-[2px] border-[#d4dae2] pl-4" style={{ marginLeft: `${depth * 12}px` }}>
      <div className="text-[14px] font-bold" style={{ color: entry.blogColor ?? '#444444' }}>
        {entry.username}
      </div>
      {entry.blogTitle ? <div className="text-[12px] text-[#a7a7a7]">{entry.blogTitle}</div> : null}
      <p className="mt-1 whitespace-pre-wrap text-[14px] leading-[1.65] text-[#444444]">{entry.content}</p>
    </div>
  );
}

function TagRow({ tags, onTagClick }: { tags: string[]; onTagClick: (tag: string) => void }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 px-5 pb-3 text-[13px] text-[#a7a7a7]">
      {tags.map((tag) => (
        <button key={tag} onClick={() => onTagClick(tag)} className="cursor-pointer hover:text-[#529ecc]">
          #{tag.toLowerCase()}
        </button>
      ))}
    </div>
  );
}

function PostActions({
  notes,
  liked,
  onToggleLike,
}: {
  notes: string;
  liked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-[#f0f0f0] px-5 py-2.5">
      <div className="text-[12px] text-[#a7a7a7]">{notes}</div>
      <div className="flex items-center gap-3.5">
        {/* Share */}
        <button className="cursor-pointer text-[#a8b1ba] hover:text-[#444444]" aria-label="Share">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 7l-5-5-5 5" />
            <path d="M10 2v12" />
            <path d="M3 14v3h14v-3" />
          </svg>
        </button>
        {/* Reply */}
        <button className="cursor-pointer text-[#a8b1ba] hover:text-[#444444]" aria-label="Reply">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 4h14v10H6l-3 3V4z" />
          </svg>
        </button>
        {/* Reblog */}
        <button className="cursor-pointer text-[#a8b1ba] hover:text-[#56BC8A]" aria-label="Reblog">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13.5 3.5L16 6l-2.5 2.5" />
            <path d="M4 10V6h12" />
            <path d="M6.5 16.5L4 14l2.5-2.5" />
            <path d="M16 10v4H4" />
          </svg>
        </button>
        {/* Like */}
        <button
          onClick={onToggleLike}
          className={`cursor-pointer transition-transform ${liked ? 'scale-110' : 'text-[#a8b1ba] hover:text-[#EC5A49]'}`}
          aria-label="Like"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill={liked ? '#EC5A49' : 'none'} stroke={liked ? '#EC5A49' : 'currentColor'} strokeWidth="1.6">
            <path d="M10 17S3 12.65 3 8.5C3 5.46 5.46 3 8.5 3c1.39 0 1.5.5 1.5.5S10.61 3 11.5 3C14.54 3 17 5.46 17 8.5 17 12.65 10 17 10 17z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function TumblrPost({ post, onTagClick }: TumblrPostProps) {
  const [liked, setLiked] = useState(false);

  const headerEntry =
    post.type === 'reblog_chain'
      ? post.chain?.[post.chain.length - 1]
      : {
          username: post.username ?? 'anonymous',
          blogTitle: post.blogTitle,
          blogColor: post.blogColor,
        };

  const username = headerEntry?.username ?? 'anonymous';
  const isReblog = post.type === 'reblog_chain' && post.chain && post.chain.length > 1;
  const originalPoster = isReblog ? post.chain![0].username : null;

  return (
    <article
      className="overflow-hidden rounded-[3px] bg-white text-[#444444] shadow-[0_1px_5px_rgba(0,0,0,0.09)]"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Post header */}
      <div className="flex items-center gap-2.5 px-5 py-3">
        <Avatar label={username} color={headerEntry?.blogColor} size={32} />
        <div className="flex min-w-0 items-center gap-1.5 text-[14px]">
          <span className="font-bold text-[#444444]">{username}</span>
          {isReblog && originalPoster ? (
            <>
              <svg className="text-[#a7a7a7]" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 3.5L16 6l-2.5 2.5" />
                <path d="M4 10V6h12" />
                <path d="M6.5 16.5L4 14l2.5-2.5" />
                <path d="M16 10v4H4" />
              </svg>
              <span className="truncate text-[#a7a7a7]">{originalPoster}</span>
            </>
          ) : null}
        </div>
        {post.sponsorLabel ? (
          <span className="ml-auto rounded-[3px] bg-[#edf2f8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#999999]">
            {post.sponsorLabel}
          </span>
        ) : (
          <button className="ml-auto cursor-pointer text-[16px] leading-none text-[#a7a7a7] hover:text-[#444444]" type="button">
            •••
          </button>
        )}
      </div>

      {/* Post content */}
      <div className="px-5 pb-3">
        {post.title ? <h3 className="mb-2 text-[20px] font-bold leading-tight text-[#444444]">{post.title}</h3> : null}

        {post.type === 'reblog_chain' && post.chain ? (
          <div className="space-y-3">
            {post.chain.map((entry, index) => (
              <ReblogEntry key={`${entry.username}-${index}`} entry={entry} depth={index} />
            ))}
          </div>
        ) : null}

        {post.type === 'text' && post.content ? (
          <p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-[#444444]">{post.content}</p>
        ) : null}

        {post.type === 'photo' ? (
          <div>
            <div
              className="-mx-5 flex h-72 items-end p-4 text-sm font-medium text-white"
              style={{ background: post.imageColor ?? '#7587a1' }}
            >
              <div className="max-w-md bg-black/30 px-3 py-2 leading-6">{post.imageDescription}</div>
            </div>
            {post.caption ? (
              <p className="mt-3 text-[14px] leading-[1.6] text-[#444444]">{post.caption}</p>
            ) : null}
          </div>
        ) : null}

        {post.type === 'quote' ? (
          <blockquote className="border-l-[3px] border-[#a7a7a7] pl-4">
            <p className="text-[22px] leading-[1.4] text-[#444444]">"{post.quote}"</p>
            {post.quoteSource ? (
              <footer className="mt-2 text-[13px] text-[#999999]">— {post.quoteSource}</footer>
            ) : null}
          </blockquote>
        ) : null}

        {post.type === 'link' ? (
          <div>
            {post.content ? (
              <p className="mb-3 text-[14px] leading-[1.6] text-[#444444]">{post.content}</p>
            ) : null}
            <div className="rounded-[3px] border border-[#e8e8e8] bg-[#f9f9f9] p-4">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[#999999]">{post.linkUrl}</div>
              <div className="mt-1 text-[16px] font-bold text-[#529ecc]">{post.linkTitle}</div>
              <p className="mt-1 text-[13px] leading-[1.5] text-[#999999]">{post.linkDescription}</p>
            </div>
          </div>
        ) : null}

        {post.type === 'chat' ? (
          <div className="overflow-hidden rounded-[3px] border border-[#e8e8e8]">
            {post.chatLines?.map((line, index) => (
              <div
                key={`${line.speaker}-${index}`}
                className={`flex gap-3 px-4 py-2.5 text-[14px] ${index % 2 === 1 ? 'bg-[#f9f9f9]' : 'bg-white'} ${index !== 0 ? 'border-t border-[#e8e8e8]' : ''}`}
              >
                <span className="flex-shrink-0 font-bold text-[#444444]">{line.speaker}:</span>
                <span className="text-[#444444]">{line.text}</span>
              </div>
            ))}
          </div>
        ) : null}

        {post.type === 'sponsored' ? (
          <div className="rounded-[3px] border border-[#e2d5b0] bg-[#fff8de] p-4">
            <p className="text-[14px] leading-[1.6] text-[#444444]">{post.content}</p>
            {post.ctaLabel ? (
              <button className="mt-3 cursor-pointer rounded-[3px] bg-[#f5c542] px-3 py-2 text-[13px] font-semibold text-[#2d2419]">
                {post.ctaLabel}
              </button>
            ) : null}
          </div>
        ) : null}

        {post.source ? (
          <div className="mt-3 text-[12px] text-[#a7a7a7]">
            Source: <span className="font-semibold text-[#444444]">{post.source}</span>
          </div>
        ) : null}
      </div>

      {/* Tags */}
      <TagRow tags={post.tags} onTagClick={onTagClick} />

      {/* Actions */}
      <PostActions
        notes={post.notes}
        liked={liked}
        onToggleLike={() => setLiked((v) => !v)}
      />
    </article>
  );
}
