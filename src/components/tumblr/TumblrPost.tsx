import { useState } from 'react';
import type { TumblrPost as TumblrPostType, TumblrReblogEntry } from '../../types';

interface TumblrPostProps {
  post: TumblrPostType;
  onTagClick: (tag: string) => void;
}

function Avatar({ label, color }: { label: string; color?: string }) {
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-[#51627a] text-sm font-bold uppercase text-white"
      style={{ backgroundColor: color ?? '#51627a' }}
    >
      {label.slice(0, 1)}
    </div>
  );
}

function UserLabel({ username, blogTitle, color }: { username: string; blogTitle?: string; color?: string }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-sm font-bold" style={{ color: color ?? '#36465d' }}>
        {username}
      </div>
      {blogTitle && (
        <div className="truncate text-xs text-[#7c8593]">
          {blogTitle}
        </div>
      )}
    </div>
  );
}

function NotesAndActions({
  notes,
  liked,
  onToggleLike,
}: {
  notes: string;
  liked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <div className="mt-4 border-t border-[#eef0f3] pt-3">
      <div className="text-sm font-semibold text-[#36465d]">{notes}</div>
      <div className="mt-3 flex items-center gap-3 text-xs text-[#7c8593]">
        <button className="cursor-pointer rounded px-2 py-1 hover:bg-[#f2f4f7]">↻ reblog</button>
        <button
          onClick={onToggleLike}
          className={`cursor-pointer rounded px-2 py-1 transition-colors ${liked ? 'text-[#e14d68]' : 'hover:bg-[#f2f4f7]'}`}
        >
          ♥ like
        </button>
        <button className="cursor-pointer rounded px-2 py-1 hover:bg-[#f2f4f7]">… share</button>
      </div>
    </div>
  );
}

function TagRow({ tags, onTagClick }: { tags: string[]; onTagClick: (tag: string) => void }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[#7c8593]">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="cursor-pointer hover:text-[#529ecc]"
        >
          #{tag.toLowerCase()}
        </button>
      ))}
    </div>
  );
}

function ReblogEntry({ entry, depth }: { entry: TumblrReblogEntry; depth: number }) {
  return (
    <div
      className="mt-3 border-l-2 border-[#d7dce2] pl-3"
      style={{ marginLeft: `${depth * 14}px` }}
    >
      <UserLabel username={entry.username} blogTitle={entry.blogTitle} color={entry.blogColor} />
      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-6 text-[#2f3a4a]">{entry.content}</p>
    </div>
  );
}

export function TumblrPost({ post, onTagClick }: TumblrPostProps) {
  const [liked, setLiked] = useState(false);

  const headerEntry = post.type === 'reblog_chain'
    ? post.chain?.[post.chain.length - 1]
    : {
        username: post.username ?? 'anonymous',
        blogTitle: post.blogTitle,
        blogColor: post.blogColor,
      };

  return (
    <article className="rounded bg-white px-5 py-4 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="flex gap-3">
        <Avatar
          label={headerEntry?.username ?? 't'}
          color={headerEntry?.blogColor}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <UserLabel
              username={headerEntry?.username ?? 'anonymous'}
              blogTitle={headerEntry?.blogTitle}
              color={headerEntry?.blogColor}
            />
            {post.sponsorLabel && (
              <span className="rounded bg-[#edf2f8] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#607289]">
                {post.sponsorLabel}
              </span>
            )}
          </div>

          {post.title && (
            <h3 className="mt-3 text-[17px] font-bold text-[#243140]">{post.title}</h3>
          )}

          {post.type === 'reblog_chain' && post.chain && (
            <div className="mt-1">
              {post.chain.map((entry, index) => (
                <ReblogEntry key={`${entry.username}-${index}`} entry={entry} depth={index} />
              ))}
            </div>
          )}

          {post.type === 'text' && post.content && (
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-[#2f3a4a]">{post.content}</p>
          )}

          {post.type === 'photo' && (
            <div className="mt-3">
              <div
                className="flex h-64 items-end rounded bg-[#7587a1] p-4 text-sm font-medium text-white shadow-inner"
                style={{ background: post.imageColor ?? '#7587a1' }}
              >
                <div className="max-w-md rounded bg-black/25 px-3 py-2 backdrop-blur-[1px]">
                  {post.imageDescription}
                </div>
              </div>
              {post.caption && (
                <p className="mt-3 text-[15px] leading-6 text-[#2f3a4a]">{post.caption}</p>
              )}
            </div>
          )}

          {post.type === 'quote' && (
            <blockquote className="mt-3 border-l-4 border-[#cfd6de] pl-4 text-[26px] leading-9 text-[#243140]">
              “{post.quote}”
              {post.quoteSource && (
                <footer className="mt-3 text-sm font-medium text-[#7c8593]">
                  {post.quoteSource}
                </footer>
              )}
            </blockquote>
          )}

          {post.type === 'link' && (
            <div className="mt-3">
              {post.content && (
                <p className="mb-3 text-[15px] leading-6 text-[#2f3a4a]">{post.content}</p>
              )}
              <div className="rounded border border-[#d7dce2] bg-[#f7f9fb] p-4">
                <div className="text-xs uppercase tracking-[0.12em] text-[#7c8593]">{post.linkUrl}</div>
                <div className="mt-1 text-lg font-bold text-[#243140]">{post.linkTitle}</div>
                <p className="mt-2 text-sm leading-6 text-[#51627a]">{post.linkDescription}</p>
              </div>
            </div>
          )}

          {post.type === 'chat' && (
            <div className="mt-3 rounded border border-[#d7dce2] bg-[#f8fafc]">
              {post.chatLines?.map((line, index) => (
                <div
                  key={`${line.speaker}-${index}`}
                  className={`flex gap-3 px-4 py-3 text-sm ${index !== 0 ? 'border-t border-[#e7ebef]' : ''}`}
                >
                  <span className="w-20 flex-shrink-0 font-bold uppercase text-[#607289]">{line.speaker}</span>
                  <span className="text-[#2f3a4a]">{line.text}</span>
                </div>
              ))}
            </div>
          )}

          {post.type === 'sponsored' && (
            <div className="mt-3 rounded border border-[#e2d5b0] bg-[#fff8de] p-4">
              <p className="text-[15px] leading-6 text-[#403529]">{post.content}</p>
              {post.ctaLabel && (
                <button className="mt-3 cursor-pointer rounded bg-[#f5c542] px-3 py-2 text-sm font-semibold text-[#2d2419]">
                  {post.ctaLabel}
                </button>
              )}
            </div>
          )}

          {post.source && (
            <div className="mt-4 text-xs text-[#7c8593]">
              Source: <span className="font-semibold text-[#36465d]">{post.source}</span>
            </div>
          )}

          <TagRow tags={post.tags} onTagClick={onTagClick} />
          <NotesAndActions notes={post.notes} liked={liked} onToggleLike={() => setLiked((value) => !value)} />
        </div>
      </div>
    </article>
  );
}
