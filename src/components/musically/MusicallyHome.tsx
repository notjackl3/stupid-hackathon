import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { MusicallyPost as MusicallyPostType, MusicallyQueryData } from '../../types';
import { searchMusically } from '../../lib/fuzzySearch';
import { musicallyData } from '../../lib/musicallyData';
import { MusicallyPost } from './MusicallyPost';
import { MusicallyFrame, MusicallyLogo, MusicallyStatusBar, MusicallyTabBar } from './MusicallyShell';

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
    <div className="shrink-0 border-b border-[#f0d9de] bg-[linear-gradient(180deg,#fff8f8_0%,#fff0eb_100%)] px-4 pb-3 pt-3 text-[#514b54]">
      <div className="flex items-center justify-between">
        <button className="rounded-full border border-[#f2d5db] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f05f7b]">
          Featured
        </button>
        <MusicallyLogo className="scale-[0.9]" />
        <button
          onClick={onExplore}
          className="rounded-full border border-[#f2d5db] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f05f7b]"
        >
          Discover
        </button>
      </div>

      <div className="mt-3 rounded-[22px] border border-[#f2dce0] bg-white p-2 shadow-[0_8px_20px_rgba(233,178,188,0.16)]">
        <div className="flex items-center gap-2 rounded-[18px] border border-[#f3e5e7] bg-[#fffdfd] px-3 py-2.5">
          <span className="text-[#cfadb4]">⌕</span>
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
            className="w-full bg-transparent text-[13px] text-[#47424a] outline-none placeholder:text-[#b6a8ae]"
          />
          <button
            onClick={submit}
            className="rounded-full bg-[linear-gradient(180deg,#ff768f_0%,#ff946f_100%)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
          >
            Go
          </button>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.18em]">
          <div className="rounded-full bg-[linear-gradient(180deg,#ff758e_0%,#ff9770_100%)] px-3 py-2 text-center font-bold text-white">
            Featured
          </div>
          <div className="rounded-full border border-[#f1d8de] bg-[#fff7f8] px-3 py-2 text-center font-semibold text-[#b8a3aa]">
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
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#fff1ec_0%,#ffe9e7_38%,#fde3dd_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <MusicallyFrame>
          <div className="flex h-full flex-col bg-white">
            <MusicallyStatusBar />
            <MusicallyHeader
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearch={onSearch}
              onExplore={onExplore}
            />

            {query && (
              <div className="shrink-0 border-b border-[#f0dfe2] bg-[#fffaf9] px-4 py-3 text-sm text-[#8b7881]">
                Search results for <span className="font-semibold text-[#433e45]">"{query}"</span>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#fffdfc]">
              {loading ? (
                <div className="p-10 text-center">
                  <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-[#ff8b78] border-t-transparent" />
                </div>
              ) : feedPosts.length === 0 ? (
                <div className="px-8 py-16 text-center">
                  <div className="text-5xl text-[#ff7b8d]">♬</div>
                  <p className="mt-4 text-lg font-bold text-[#433e45]">No musicallys found.</p>
                  <p className="mt-2 text-sm text-[#9d8d94]">Try a vibe like "popular", "duet", or "city-lights".</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="border-b border-[#f3e5e8] bg-[linear-gradient(90deg,#ff7a91_0%,#ffa274_100%)] px-4 py-3 text-white">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/74">hot today</div>
                      <p className="mt-1 text-[13px] font-semibold">
                        Featured musers, soft filters, and every teenager using the same five seconds of a chorus.
                      </p>
                      <p className="mt-1 text-[11px] text-white/74">Featured page • updated just now</p>
                    </div>
                  )}
                  <div className="divide-y divide-[#f3e7e9]">
                    {feedPosts.map((post, index) => (
                      <MusicallyPost
                        key={`${post.id}-${Math.floor(index / Math.max(posts.length, 1))}`}
                        post={post}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <MusicallyTabBar active="home" onDiscover={onExplore} />
          </div>
        </MusicallyFrame>
      </div>
    </div>
  );
}
