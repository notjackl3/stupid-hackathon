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
  { label: 'Text', icon: 'Aa', color: '#E8503F' },
  { label: 'Photo', icon: '📷', color: '#D9534F' },
  { label: 'Quote', icon: '❝', color: '#F2992E' },
  { label: 'Link', icon: '🔗', color: '#56BC8A' },
  { label: 'Chat', icon: '💬', color: '#529ECC' },
  { label: 'Audio', icon: '🎵', color: '#9B59B6' },
  { label: 'Video', icon: '🎬', color: '#D9534F' },
];


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


function DashboardComposer() {
  return (
    <section className="mb-5 overflow-hidden rounded-[3px] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[3px] bg-[#d95f70] text-xl font-bold text-white">
          t
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {COMPOSE_TYPES.map((item) => (
            <button key={item.label} type="button" className="flex items-center gap-1.5 rounded-[3px] px-1 py-1 hover:bg-[#f5f5f5]">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[13px] text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </span>
              <span className="hidden text-[12px] font-semibold text-[#444444] sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
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
    <section className="mb-5 overflow-hidden rounded-[3px] bg-white text-[#444444] shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
      <div className="border-b border-[#f0f0f0] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#a7a7a7]">
        {eyebrow}
      </div>
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight text-[#444444]">{title}</h1>
            {description ? (
              <div className="mt-1 text-[14px] leading-6 text-[#999999]">{description}</div>
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

  const navItems = [
    {
      label: 'Home',
      active: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2L2 9h3v7h4v-4h2v4h4V9h3L10 2z" />
        </svg>
      ),
    },
    {
      label: 'Explore',
      active: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="7.5" />
          <path d="M12.5 7.5l-5 2.5 2.5 5 5-2.5z" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Inbox',
      active: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 5l7 5 7-5" />
          <rect x="3" y="4" width="14" height="12" rx="1" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      active: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h14v10H6l-3 3V4z" />
        </svg>
      ),
    },
    {
      label: 'Activity',
      active: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3l1.5 4.5H16l-3.5 2.5 1.5 4.5L10 12l-4 2.5 1.5-4.5L4 7.5h4.5z" />
        </svg>
      ),
    },
    {
      label: 'Account',
      active: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <circle cx="10" cy="7" r="3.5" />
          <path d="M3.5 17c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
        </svg>
      ),
    },
  ];

  return (
    <header
      className="sticky top-0 z-20 bg-[#36465d] text-white shadow-[0_1px_0_rgba(0,0,0,0.34)]"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <div className="mx-auto flex h-[54px] max-w-[990px] items-center gap-3 px-3 md:px-4">
        <button
          onClick={onHome}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[3px] text-[30px] font-bold leading-none text-white"
          aria-label="Go to dashboard"
          type="button"
        >
          t
        </button>

        <div className="flex min-w-0 max-w-[280px] flex-1 items-center rounded-[3px] bg-[#4A6583] px-3 py-[7px]">
          <svg className="mr-2 flex-shrink-0 text-white/40" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M13 13l4 4" />
          </svg>
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
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/45"
          />
        </div>

        <div className="ml-auto hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.active ? onHome : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-[3px] ${
                item.active ? 'bg-white/12 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white'
              }`}
              aria-label={item.label}
              type="button"
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* New post button */}
        <button
          type="button"
          className="hidden h-8 items-center gap-1.5 rounded-[3px] bg-white/15 px-3 text-[13px] font-semibold text-white hover:bg-white/20 md:flex"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 14l8-8 3 3-8 8H3v-3z" />
          </svg>
          Write
        </button>
      </div>
    </header>
  );
}

export function TumblrSidebar({ onTagClick }: TumblrSidebarProps) {
  return (
    <aside className="hidden w-[300px] flex-shrink-0 xl:block">
      <div className="sticky top-[78px] space-y-4">
        {/* Account card */}
        <div className="flex items-center gap-3 rounded-[3px] bg-[#314359] p-4 text-white shadow-[0_1px_0_rgba(0,0,0,0.22)]">
          <div className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-[3px] bg-[#ff7f9f] text-[22px] font-bold text-white">
            t
          </div>
          <div>
            <div className="text-[14px] font-bold">timemachine2016</div>
            <div className="mt-0.5 text-[12px] text-white/50">4,216 posts</div>
          </div>
        </div>

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
      className="mx-auto flex max-w-[890px] justify-center gap-5 px-3 py-5 md:px-4"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <main className="min-w-0 w-full max-w-[540px]">{children}</main>
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

        <div className="space-y-5">
          {posts.map(({ post, renderKey }) => (
            <TumblrPost key={renderKey} post={post} onTagClick={onTagClick} />
          ))}
        </div>

        <div className="py-8 text-center text-[13px] text-white/38">loading more posts from the queue...</div>
      </TumblrPageShell>
    </div>
  );
}
