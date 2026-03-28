import { useState } from 'react';
import type { TumblrPost as TumblrPostType, TumblrReblogEntry } from '../../types';

interface TumblrPostProps {
  post: TumblrPostType;
  onTagClick: (tag: string) => void;
}

function Avatar({ label, color }: { label: string; color?: string }) {
  return (
    <div
      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm text-[26px] font-bold uppercase text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      style={{ backgroundColor: color ?? '#51627a' }}
    >
      {label.slice(0, 1)}
    </div>
  );
}

function UserLabel({
  username,
  blogTitle,
  color,
  subtle = false,
}: {
  username: string;
  blogTitle?: string;
  color?: string;
  subtle?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div
        className={`truncate text-[14px] font-bold ${subtle ? 'text-[#36465d]' : ''}`}
        style={{ color: subtle ? undefined : color ?? '#36465d' }}
      >
        {username}
      </div>
      {blogTitle ? <div className="truncate text-xs text-[#7c8593]">{blogTitle}</div> : null}
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
    <div className="mt-4 border-t border-[#e8ebef] pt-3">
      <div className="text-[13px] font-bold text-[#36465d]">{notes}</div>
      <div className="mt-3 flex items-center gap-4 text-[13px] text-[#7c8593]">
        <button className="cursor-pointer font-semibold hover:text-[#36465d]">↻ Reblog</button>
        <button
          onClick={onToggleLike}
          className={`cursor-pointer font-semibold ${liked ? 'text-[#da4f67]' : 'hover:text-[#36465d]'}`}
        >
          ♥ Like
        </button>
        <button className="cursor-pointer font-semibold hover:text-[#36465d]">Share</button>
      </div>
    </div>
  );
}

function TagRow({ tags, onTagClick }: { tags: string[]; onTagClick: (tag: string) => void }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-[13px] text-[#7c8593]">
      {tags.map((tag) => (
        <button key={tag} onClick={() => onTagClick(tag)} className="cursor-pointer hover:text-[#529ecc]">
          #{tag.toLowerCase()}
        </button>
      ))}
    </div>
  );
}

function ReblogEntry({ entry, depth }: { entry: TumblrReblogEntry; depth: number }) {
  return (
    <div className="border-l border-[#d8dde4] pl-4" style={{ marginLeft: `${depth * 12}px` }}>
      <UserLabel username={entry.username} blogTitle={entry.blogTitle} color={entry.blogColor} subtle />
      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-[#2f3a4a]">{entry.content}</p>
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

  return (
    <article
      className="flex gap-3 text-[#36465d]"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <Avatar label={headerEntry?.username ?? 't'} color={headerEntry?.blogColor} />

      <div className="min-w-0 flex-1 rounded-sm border border-white/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.12)]">
        <div className="border-b border-[#eef1f4] px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <UserLabel
              username={headerEntry?.username ?? 'anonymous'}
              blogTitle={headerEntry?.blogTitle}
              color={headerEntry?.blogColor}
            />
            {post.sponsorLabel ? (
              <span className="rounded-sm bg-[#edf2f8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#607289]">
                {post.sponsorLabel}
              </span>
            ) : (
              <span className="text-[18px] leading-none text-[#9aa6b3]">...</span>
            )}
          </div>

          {post.title ? <h3 className="mt-3 text-[18px] font-bold text-[#243140]">{post.title}</h3> : null}

          {post.type === 'reblog_chain' && post.chain ? (
            <div className="mt-3 space-y-3">
              {post.chain.map((entry, index) => (
                <ReblogEntry key={`${entry.username}-${index}`} entry={entry} depth={index} />
              ))}
            </div>
          ) : null}

          {post.type === 'text' && post.content ? (
            <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-[#2f3a4a]">{post.content}</p>
          ) : null}

          {post.type === 'photo' ? (
            <div className="mt-3">
              <div
                className="flex h-72 items-end overflow-hidden rounded-sm p-4 text-sm font-medium text-white shadow-inner"
                style={{ background: post.imageColor ?? '#7587a1' }}
              >
                <div className="max-w-md bg-black/30 px-3 py-2 leading-6">
                  {post.imageDescription}
                </div>
              </div>
              {post.caption ? (
                <p className="mt-3 text-[15px] leading-6 text-[#2f3a4a]">{post.caption}</p>
              ) : null}
            </div>
          ) : null}

          {post.type === 'quote' ? (
            <blockquote className="mt-3 border-l-[3px] border-[#d4dae2] pl-4 text-[28px] leading-10 text-[#243140]">
              “{post.quote}”
              {post.quoteSource ? (
                <footer className="mt-3 text-sm font-medium text-[#7c8593]">{post.quoteSource}</footer>
              ) : null}
            </blockquote>
          ) : null}

          {post.type === 'link' ? (
            <div className="mt-3">
              {post.content ? (
                <p className="mb-3 text-[15px] leading-6 text-[#2f3a4a]">{post.content}</p>
              ) : null}
              <div className="rounded-sm border border-[#d7dce2] bg-[#f7f9fb] p-4">
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#7c8593]">{post.linkUrl}</div>
                <div className="mt-1 text-lg font-bold text-[#243140]">{post.linkTitle}</div>
                <p className="mt-2 text-sm leading-6 text-[#51627a]">{post.linkDescription}</p>
              </div>
            </div>
          ) : null}

          {post.type === 'chat' ? (
            <div className="mt-3 rounded-sm border border-[#d7dce2] bg-[#f8fafc]">
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
          ) : null}

          {post.type === 'sponsored' ? (
            <div className="mt-3 rounded-sm border border-[#e2d5b0] bg-[#fff8de] p-4">
              <p className="text-[15px] leading-6 text-[#403529]">{post.content}</p>
              {post.ctaLabel ? (
                <button className="mt-3 cursor-pointer rounded-sm bg-[#f5c542] px-3 py-2 text-sm font-semibold text-[#2d2419]">
                  {post.ctaLabel}
                </button>
              ) : null}
            </div>
          ) : null}

          {post.source ? (
            <div className="mt-4 text-[12px] text-[#7c8593]">
              Source: <span className="font-semibold text-[#36465d]">{post.source}</span>
            </div>
          ) : null}

          <TagRow tags={post.tags} onTagClick={onTagClick} />
          <NotesAndActions
            notes={post.notes}
            liked={liked}
            onToggleLike={() => setLiked((value) => !value)}
          />
        </div>
      </div>
    </article>
  );
}
