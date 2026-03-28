import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { MusicallyPost as MusicallyPostType, MusicallyQueryData } from '../../types';
import { searchMusically } from '../../lib/fuzzySearch';
import musicallyData from '../../data/musicallyResults.json';
import { MusicallyPost } from './MusicallyPost';
import { MusicallyFrame, MusicallyLogo, MusicallyStatusBar } from './MusicallyShell';

interface MusicallyHomeProps {
  query: string;
  onSearch: (query: string) => void;
  onExplore: () => void;
}

function MusicallyHeader({
  searchInput,
  setSearchInput,
  onSearch,
  onExplore,
}: {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: (query: string) => void;
  onExplore: () => void;
}) {
  const submit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="shrink-0 bg-[linear-gradient(180deg,#ff6e8d_0%,#ff8d68_100%)] px-4 pb-4 pt-4 text-white">
      <div className="flex items-center justify-between">
        <button className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em]">
          Featured
        </button>
        <MusicallyLogo className="scale-[0.9]" />
        <button
          onClick={onExplore}
          className="rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
        >
          Discover
        </button>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/15 bg-[#140b11]/36 p-2 backdrop-blur-[3px]">
        <div className="flex items-center gap-2 rounded-[18px] bg-white/10 px-3 py-2.5">
          <span className="text-white/70">⌕</span>
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                submit();
              }
            }}
            placeholder="Search music, musers, or moods"
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/54"
          />
          <button
            onClick={submit}
            className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ec5c78]"
          >
            Go
          </button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] uppercase tracking-[0.18em]">
          <div className="rounded-full bg-white px-3 py-2 text-center font-semibold text-[#ec5c78] shadow-[0_8px_20px_rgba(255,255,255,0.14)]">
            Featured
          </div>
          <div className="rounded-full border border-white/14 bg-white/6 px-3 py-2 text-center font-semibold text-white/72">
            Following
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicallyHome({ query, onSearch, onExplore }: MusicallyHomeProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [posts, setPosts] = useState<MusicallyPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const scrollLockRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const delay = 450 + Math.random() * 250;
    const timer = window.setTimeout(() => {
      const data = musicallyData as Record<string, MusicallyQueryData>;

      if (!query) {
        setPosts(data._featured?.posts ?? []);
        setLoading(false);
        return;
      }

      const match = searchMusically(data, query);
      setPosts(match?.results.posts ?? []);
      setLoading(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (query) {
      return;
    }

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      if (scrollLockRef.current || loading) {
        return;
      }

      const distanceFromBottom =
        scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

      if (distanceFromBottom < 900) {
        scrollLockRef.current = true;
        setVisibleCount((count) => count + 2);
        window.setTimeout(() => {
          scrollLockRef.current = false;
        }, 180);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [loading, query]);

  const feedPosts = query
    ? posts
    : Array.from({ length: visibleCount }, (_, index) => posts[index % Math.max(posts.length, 1)]).filter(Boolean);

  return (
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#ffd9cf_0%,#ffefdb_34%,#f0d5ff_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <MusicallyFrame>
          <div className="flex h-full flex-col bg-[#120910]">
            <MusicallyStatusBar />
            <MusicallyHeader
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearch={onSearch}
              onExplore={onExplore}
            />

            {query && (
              <div className="shrink-0 border-b border-white/8 bg-[#1a0f16] px-4 py-3 text-sm text-white/72">
                Search results for <span className="font-semibold text-white">"{query}"</span>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#180b13_0%,#120910_100%)]">
              {loading ? (
                <div className="p-10 text-center">
                  <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-[#ff8b78] border-t-transparent" />
                </div>
              ) : feedPosts.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="text-5xl">♬</div>
                  <p className="mt-4 text-lg font-bold text-white">No musicallys found.</p>
                  <p className="mt-2 text-sm text-white/62">Try a vibe like "popular", "duet", or "city-lights".</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="px-4 pt-4">
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-white">
                        <div className="text-[11px] uppercase tracking-[0.24em] text-white/42">hot today</div>
                        <p className="mt-2 text-[14px] font-semibold">
                          Featured Musers, soft filters, and every teen in America using the same chorus.
                        </p>
                      </div>
                    </div>
                  )}
                  {feedPosts.map((post, index) => (
                    <MusicallyPost
                      key={`${post.id}-${Math.floor(index / Math.max(posts.length, 1))}`}
                      post={post}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </MusicallyFrame>
      </div>
    </div>
  );
}
