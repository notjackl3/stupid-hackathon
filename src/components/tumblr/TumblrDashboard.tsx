import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import tumblrData from '../../data/tumblrResults.json';
import type { TumblrData } from '../../types';
import { TumblrPost } from './TumblrPost';

interface TumblrDashboardProps {
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
  onHome: () => void;
}

interface TumblrHeaderProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: (query: string) => void;
  onHome: () => void;
}

interface TumblrSidebarProps {
  onTagClick: (tag: string) => void;
}

const TRENDING_TAGS = [
  'Harambe',
  'Pokemon GO',
  'Supernatural',
  'Steven Universe',
  'Hamilton',
  'election 2016',
  'aesthetic',
  'twenty one pilots',
  'Voltron',
  'discourse',
];

const RECOMMENDED_BLOGS = [
  { username: 'soft-gay-aesthetic', blurb: 'pastels, yearning, and carefully curated chaos' },
  { username: 'sherlock-is-not-dead', blurb: 'still posting theories with no evidence' },
  { username: 'my-chemical-bromance', blurb: 'emo revival before it was cool again' },
];

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded bg-[#f7f9fb] p-4 text-[#36465d] shadow-[0_1px_0_rgba(0,0,0,0.03)] ring-1 ring-black/5">
      <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#7c8593]">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function TumblrHeader({ searchInput, setSearchInput, onSearch, onHome }: TumblrHeaderProps) {
  const submit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#001935] text-white">
      <div className="mx-auto flex h-14 max-w-[1120px] items-center gap-4 px-4">
        <button onClick={onHome} className="cursor-pointer text-3xl font-bold leading-none">
          t
        </button>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <button onClick={onHome} className="cursor-pointer font-semibold text-white">Dashboard</button>
          <span className="cursor-pointer hover:text-white">Explore</span>
          <span className="cursor-pointer hover:text-white">Inbox</span>
        </div>
        <div className="ml-auto flex w-full max-w-[360px] items-center rounded bg-white/10 px-3 py-2 ring-1 ring-white/10 focus-within:bg-white/14">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                submit();
              }
            }}
            placeholder="Search Tumblr"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
          />
          <button onClick={submit} className="cursor-pointer text-sm text-white/75">
            ⌕
          </button>
        </div>
      </div>
    </header>
  );
}

export function TumblrSidebar({ onTagClick }: TumblrSidebarProps) {
  return (
    <aside className="hidden w-[320px] flex-shrink-0 lg:block">
      <div className="sticky top-20 space-y-4">
        <SidebarSection title="Radar">
          <div className="rounded bg-[#36465d] p-4 text-white">
            <div className="text-xs uppercase tracking-[0.12em] text-white/55">featured post</div>
            <div className="mt-2 text-sm font-semibold">dennys</div>
            <p className="mt-2 text-sm leading-6 text-white/80">
              “what if pancakes were just breakfast coasters with ambition”
            </p>
            <div className="mt-3 text-xs text-white/50">289,044 notes</div>
          </div>
        </SidebarSection>

        <SidebarSection title="Trending Tags">
          <div className="space-y-2">
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className="block cursor-pointer text-left text-sm text-[#529ecc] hover:text-[#36465d]"
              >
                #{tag}
              </button>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="Recommended Blogs">
          <div className="space-y-3">
            {RECOMMENDED_BLOGS.map((blog) => (
              <div key={blog.username} className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-[#36465d]">{blog.username}</div>
                  <div className="mt-1 text-xs leading-5 text-[#7c8593]">{blog.blurb}</div>
                </div>
                <button className="cursor-pointer rounded border border-[#d7dce2] px-2 py-1 text-xs font-semibold text-[#36465d]">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </SidebarSection>
      </div>
    </aside>
  );
}

export function TumblrDashboard({ onSearch, onTagClick, onHome }: TumblrDashboardProps) {
  const data = tumblrData as TumblrData;
  const [searchInput, setSearchInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const lockRef = useRef(false);

  useEffect(() => {
    const scrollContainer = document.getElementById('browser-content-scroll');
    if (!scrollContainer) {
      return;
    }

    const onScroll = () => {
      if (lockRef.current) {
        return;
      }

      const distanceFromBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

      if (distanceFromBottom < 640) {
        lockRef.current = true;
        setVisibleCount((count) => count + 8);
        window.setTimeout(() => {
          lockRef.current = false;
        }, 180);
      }
    };

    scrollContainer.addEventListener('scroll', onScroll);
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, []);

  const posts = Array.from({ length: visibleCount }, (_, index) => {
    const post = data.dashboard[index % data.dashboard.length];
    const round = Math.floor(index / data.dashboard.length);
    return {
      post,
      renderKey: `${post.id}-${round}`,
    };
  });

  return (
    <div className="min-h-full bg-[#e8edf2]">
      <TumblrHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        onHome={onHome}
      />

      <div className="mx-auto flex max-w-[1120px] gap-6 px-4 py-6">
        <main className="min-w-0 flex-1">
          <div className="mb-4 rounded bg-[#36465d] px-5 py-4 text-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
            <div className="text-xs uppercase tracking-[0.16em] text-white/55">dashboard</div>
            <h1 className="mt-2 text-2xl font-bold">Everyone is online and nobody should be.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
              Peak 2016 Tumblr: fandom spirals, aesthetic oversharing, improbable discourse, and one terrible sponsored post that somehow became beloved.
            </p>
          </div>

          <div className="space-y-4">
            {posts.map(({ post, renderKey }) => (
              <TumblrPost key={renderKey} post={post} onTagClick={onTagClick} />
            ))}
          </div>

          <div className="py-8 text-center text-sm text-[#7c8593]">
            loading more posts from the queue...
          </div>
        </main>

        <TumblrSidebar onTagClick={onTagClick} />
      </div>
    </div>
  );
}
