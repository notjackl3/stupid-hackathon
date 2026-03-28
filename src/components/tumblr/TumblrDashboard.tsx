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

const COMPOSE_TYPES = [
  { label: 'Text', icon: 'Aa', color: '#56bc8a' },
  { label: 'Photo', icon: '▣', color: '#faaa5f' },
  { label: 'Quote', icon: '❝', color: '#e87d88' },
  { label: 'Link', icon: '∞', color: '#7c8cff' },
  { label: 'Chat', icon: '☰', color: '#56b7d7' },
  { label: 'Audio', icon: '♪', color: '#a77dc2' },
];

const DASHBOARD_TABS = ['Dashboard', 'Queue', 'Drafts', 'Trending'];

function SidebarSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[3px] bg-[#314359] text-white shadow-[0_1px_0_rgba(0,0,0,0.22)]">
      <h3 className="border-b border-white/8 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        {title}
      </h3>
      <div className="p-4">{children}</div>
    </section>
  );
}

function TumblrIdentityRail() {
  return (
    <aside className="hidden w-[228px] flex-shrink-0 lg:block">
      <div className="sticky top-[78px]">
        <div className="overflow-hidden rounded-[3px] bg-[#314359] text-white shadow-[0_1px_0_rgba(0,0,0,0.22)]">
          <div className="h-28 bg-[radial-gradient(circle_at_top_left,rgba(164,194,255,0.55),transparent_32%),linear-gradient(135deg,#61789d_0%,#334962_50%,#223247_100%)]" />
          <div className="px-4 pb-4">
            <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-[4px] border-[5px] border-[#314359] bg-[#ff7f9f] text-[34px] font-bold text-white shadow-[0_6px_12px_rgba(0,0,0,0.2)]">
              t
            </div>
            <div className="mt-3 text-[24px] font-bold leading-none">dashboard</div>
            <p className="mt-2 text-[13px] leading-6 text-white/65">
              your mutuals are posting through it and one brand account is doing better than you.
            </p>

            <div className="mt-5 border-t border-white/8 pt-4 text-[11px] uppercase tracking-[0.12em] text-white/45">
              this blog
            </div>
            <div className="mt-3 space-y-3 text-sm">
              {[
                { label: 'Posts', value: '4,216' },
                { label: 'Following', value: '318' },
                { label: 'Followers', value: '16.4k' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-white/52">{item.label}</span>
                  <span className="font-bold text-white/92">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DashboardComposer() {
  return (
    <section className="mb-4 overflow-hidden rounded-[4px] bg-white text-[#36465d] shadow-[0_1px_0_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3 border-b border-[#edf0f4] px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#d95f70] text-xl font-bold text-white">
          t
        </div>
        <button
          type="button"
          className="flex-1 rounded-full bg-[#f3f6f9] px-4 py-2 text-left text-[14px] text-[#7c8593]"
        >
          What chaos are you posting today?
        </button>
      </div>
      <div className="grid grid-cols-3 gap-y-4 px-5 py-4 sm:grid-cols-6">
        {COMPOSE_TYPES.map((item) => (
          <button key={item.label} type="button" className="flex flex-col items-center gap-2 text-center">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-full text-[22px] font-bold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.14)]"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </span>
            <span className="text-[12px] font-semibold text-[#52657e]">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function TumblrHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-4 overflow-hidden rounded-[4px] bg-white text-[#36465d] shadow-[0_1px_0_rgba(0,0,0,0.15)]">
      <div className="border-b border-[#eef1f4] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c8593]">
        {eyebrow}
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold leading-tight text-[#243140]">{title}</h1>
            {description ? (
              <div className="mt-1 text-[14px] leading-6 text-[#607289]">{description}</div>
            ) : null}
          </div>
          {actions}
        </div>
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
      className="sticky top-0 z-20 bg-[#36465d] text-white shadow-[0_1px_0_rgba(0,0,0,0.34)]"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="mx-auto flex h-[54px] max-w-[1220px] items-center gap-3 px-3 md:px-4">
        <button
          onClick={onHome}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[3px] text-[34px] font-bold leading-none text-white"
          aria-label="Go to dashboard"
        >
          t
        </button>

        <div className="flex min-w-0 flex-1 items-center rounded-[3px] bg-[#51627a] px-3 py-2">
          <span className="pr-2 text-sm text-white/40">⌕</span>
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
            className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-white/42"
          />
        </div>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {[
            { label: 'Home', icon: '⌂', active: true },
            { label: 'Explore', icon: '#', active: false },
            { label: 'Inbox', icon: '◌', active: false },
            { label: 'Account', icon: '⚙', active: false },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.active ? onHome : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-[3px] text-lg ${
                item.active ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/6 hover:text-white'
              }`}
              aria-label={item.label}
              type="button"
            >
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function TumblrSidebar({ onTagClick }: TumblrSidebarProps) {
  return (
    <aside className="hidden w-[300px] flex-shrink-0 xl:block">
      <div className="sticky top-[78px] space-y-4">
        <SidebarSection title="Radar">
          <div className="overflow-hidden rounded-[3px] bg-[#24364e]">
            <div className="h-40 bg-[linear-gradient(135deg,#ffaf6c_0%,#f66e86_42%,#6670ff_100%)]" />
            <div className="p-4">
              <div className="text-sm font-bold text-white">dennys</div>
              <p className="mt-2 text-[13px] leading-6 text-white/72">
                what if pancakes were just breakfast coasters with ambition
              </p>
              <div className="mt-3 text-[11px] text-white/42">289,044 notes</div>
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="Trending">
          <div className="space-y-3">
            {TRENDING_TAGS.map((tag, index) => (
              <div key={tag} className="flex items-center justify-between gap-4">
                <button
                  onClick={() => onTagClick(tag)}
                  className="cursor-pointer text-left text-[14px] font-medium text-[#74c1ff] hover:text-white"
                >
                  #{tag}
                </button>
                <span className="text-[11px] text-white/34">{12 + index}k</span>
              </div>
            ))}
          </div>
        </SidebarSection>

        <SidebarSection title="Recommended Blogs">
          <div className="space-y-4">
            {RECOMMENDED_BLOGS.map((blog) => (
              <div key={blog.username} className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[3px] bg-[#5f7aa3] text-sm font-bold text-white">
                  {blog.username.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-white">{blog.username}</div>
                  <div className="mt-1 text-[12px] leading-5 text-white/52">{blog.blurb}</div>
                </div>
                <button className="rounded-[3px] bg-white/8 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/80 hover:bg-white/12">
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
      className="mx-auto flex max-w-[1220px] gap-5 px-3 py-5 md:px-4"
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
    <div className="min-h-full bg-[#2f4158] bg-[radial-gradient(circle_at_top,rgba(102,125,155,0.45)_0%,rgba(70,91,118,0.16)_20%,rgba(47,65,88,0)_32%),linear-gradient(180deg,#34465d_0%,#2f4158_240px,#2f4158_100%)]">
      <TumblrHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        onHome={onHome}
      />

      <TumblrPageShell onTagClick={onTagClick}>
        <DashboardComposer />

        <TumblrHero
          eyebrow="Following"
          title="Your dashboard"
          description="A fast-moving pile of fandom jokes, aesthetic photosets, and discourse nobody can close."
          actions={
            <div className="flex flex-wrap gap-2">
              {DASHBOARD_TABS.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
                    index === 0 ? 'bg-[#44546b] text-white' : 'bg-[#edf2f7] text-[#607289]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          }
        />

        <div className="space-y-4">
          {posts.map(({ post, renderKey }) => (
            <TumblrPost key={renderKey} post={post} onTagClick={onTagClick} />
          ))}
        </div>

        <div className="py-8 text-center text-sm text-white/38">loading more posts from the queue...</div>
      </TumblrPageShell>
    </div>
  );
}
