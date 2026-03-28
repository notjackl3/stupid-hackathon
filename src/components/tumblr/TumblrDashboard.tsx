import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
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

interface TumblrPageShellProps {
  onTagClick: (tag: string) => void;
  children: ReactNode;
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

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-sm border border-white/10 bg-[#223047] text-white shadow-[0_1px_0_rgba(0,0,0,0.18)]">
      <h3 className="border-b border-white/10 bg-[#1b273b] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        {title}
      </h3>
      <div className="p-4">{children}</div>
    </section>
  );
}

function TumblrIdentityRail() {
  return (
    <aside className="hidden w-[230px] flex-shrink-0 lg:block">
      <div className="sticky top-20">
        <div className="overflow-hidden rounded-sm border border-white/10 bg-[#223047] text-white shadow-[0_1px_0_rgba(0,0,0,0.18)]">
          <div className="h-20 bg-[linear-gradient(135deg,#6e8db5_0%,#435c7e_45%,#24344f_100%)]" />
          <div className="px-4 pb-4">
            <div className="-mt-8 flex h-16 w-16 items-center justify-center rounded-sm border-4 border-[#223047] bg-[#ff7c93] text-2xl font-bold text-white">
              t
            </div>
            <div className="mt-3 text-[22px] font-bold leading-none">dashboard</div>
            <p className="mt-2 text-sm leading-6 text-white/65">
              chaotic posts from blogs you follow, plus one brand behaving strangely.
            </p>

            <div className="mt-5 space-y-2 text-sm">
              {[
                { label: 'posts', value: '4,216' },
                { label: 'following', value: '318' },
                { label: 'queue', value: '96' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-t border-white/10 py-2 first:border-t-0 first:pt-0"
                >
                  <span className="uppercase tracking-[0.12em] text-white/45">{item.label}</span>
                  <span className="font-semibold text-white/88">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function TumblrHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <section className="mb-4 overflow-hidden rounded-sm border border-white/10 bg-[#223047] text-white shadow-[0_1px_0_rgba(0,0,0,0.18)]">
      <div className="border-b border-white/8 bg-[linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
        {eyebrow}
      </div>
      <div className="px-5 py-4">
        <h1 className="text-[28px] font-bold leading-tight">{title}</h1>
        {description ? (
          <div className="mt-2 max-w-2xl text-sm leading-6 text-white/68">{description}</div>
        ) : null}
      </div>
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
    <header
      className="sticky top-0 z-10 border-b border-white/10 bg-[#001935] text-white shadow-[0_1px_0_rgba(0,0,0,0.3)]"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-3 px-3 md:px-4">
        <button
          onClick={onHome}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm text-[30px] font-bold leading-none text-white"
          aria-label="Go to dashboard"
        >
          t
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {[
            { label: 'home', active: true },
            { label: 'explore' },
            { label: 'inbox' },
            { label: 'activity' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.active ? onHome : undefined}
              className={`cursor-pointer rounded-sm px-3 py-2 text-[13px] font-bold capitalize transition-colors ${
                item.active ? 'bg-white/8 text-white' : 'text-white/58 hover:bg-white/6 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex w-full max-w-[420px] items-center rounded-sm border border-white/10 bg-[#102542] px-3 py-2 focus-within:border-white/18 focus-within:bg-[#183153]">
          <span className="pr-2 text-[13px] text-white/45">Search</span>
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
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/35"
          />
          <button onClick={submit} className="cursor-pointer pl-2 text-[14px] font-semibold text-white/58 hover:text-white">
            Go
          </button>
        </div>
      </div>
    </header>
  );
}

export function TumblrSidebar({ onTagClick }: TumblrSidebarProps) {
  return (
    <aside className="hidden w-[300px] flex-shrink-0 xl:block">
      <div className="sticky top-20 space-y-4">
        <SidebarSection title="Radar">
          <div className="rounded-sm border border-white/10 bg-[#31435f] p-4 text-white">
            <div className="text-[11px] uppercase tracking-[0.12em] text-white/45">featured post</div>
            <div className="mt-2 text-sm font-semibold">dennys</div>
            <p className="mt-2 text-sm leading-6 text-white/76">
              “what if pancakes were just breakfast coasters with ambition”
            </p>
            <div className="mt-3 text-xs text-white/42">289,044 notes</div>
          </div>
        </SidebarSection>

        <SidebarSection title="Trending Tags">
          <div className="space-y-3">
            {TRENDING_TAGS.map((tag, index) => (
              <div key={tag} className="flex items-baseline justify-between gap-4">
                <button
                  onClick={() => onTagClick(tag)}
                  className="block cursor-pointer text-left text-[14px] text-[#7ec8ff] hover:text-white"
                >
                  #{tag}
                </button>
                <span className="text-[11px] text-white/35">{12 + index}k</span>
              </div>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="Recommended Blogs">
          <div className="space-y-4">
            {RECOMMENDED_BLOGS.map((blog) => (
              <div key={blog.username} className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{blog.username}</div>
                  <div className="mt-1 text-xs leading-5 text-white/52">{blog.blurb}</div>
                </div>
                <button className="cursor-pointer rounded-sm border border-white/16 bg-white/5 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80 hover:bg-white/10">
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

export function TumblrPageShell({ onTagClick, children }: TumblrPageShellProps) {
  return (
    <div
      className="mx-auto flex max-w-[1180px] gap-5 px-3 py-5 md:px-4"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <TumblrIdentityRail />
      <main className="min-w-0 w-full max-w-[540px] flex-1">{children}</main>
      <TumblrSidebar onTagClick={onTagClick} />
    </div>
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
    <div className="min-h-full bg-[#0d2138] bg-[radial-gradient(circle_at_top,#20334d_0%,#12243d_32%,#0d2138_70%)]">
      <TumblrHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        onHome={onHome}
      />

      <TumblrPageShell onTagClick={onTagClick}>
        <TumblrHero
          eyebrow="dashboard"
          title="Everyone is online and nobody should be."
          description="Peak 2016 Tumblr: fandom spirals, aesthetic oversharing, improbable discourse, and one terrible sponsored post that somehow became beloved."
        />

        <div className="space-y-4">
          {posts.map(({ post, renderKey }) => (
            <TumblrPost key={renderKey} post={post} onTagClick={onTagClick} />
          ))}
        </div>

        <div className="py-8 text-center text-sm text-white/42">loading more posts from the queue...</div>
      </TumblrPageShell>
    </div>
  );
}
