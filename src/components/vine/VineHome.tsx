import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { VinePost as VinePostType, VineQueryData } from '../../types';
import { searchVine } from '../../lib/fuzzySearch';
import { VineLogo } from './VineLogo';
import { VinePost } from './VinePost';
import vineData from '../../data/vineResults.json';

interface VineHomeProps {
  query: string;
  onSearch: (query: string) => void;
  onExplore: () => void;
}

function VineFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-full w-full max-w-[430px] rounded-[54px] bg-[#f6f4ef] p-[18px] shadow-[0_34px_80px_rgba(0,0,0,0.22)] ring-1 ring-black/8">
      <div className="pointer-events-none absolute left-[-3px] top-[118px] h-10 w-[3px] rounded-l-full bg-[#d9d5cf]" />
      <div className="pointer-events-none absolute left-[-3px] top-[168px] h-16 w-[3px] rounded-l-full bg-[#d9d5cf]" />
      <div className="pointer-events-none absolute left-[-3px] top-[254px] h-16 w-[3px] rounded-l-full bg-[#d9d5cf]" />
      <div className="pointer-events-none absolute right-[-3px] top-[186px] h-20 w-[3px] rounded-r-full bg-[#d9d5cf]" />

      <div className="flex h-full flex-col rounded-[42px] bg-[#fbfaf7] px-5 pb-4 pt-4 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]">
        <div className="flex shrink-0 items-center justify-center pb-3 pt-1">
          <div className="mr-3 h-2.5 w-2.5 rounded-full bg-[#2d2d2d]" />
          <div className="h-2.5 w-16 rounded-full bg-[#2f2f2f]" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[8px] border-[3px] border-[#161616] bg-white">
          {children}
        </div>

        <div className="flex shrink-0 items-center justify-center pt-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 border-[#c8c4bc] bg-gradient-to-b from-[#faf8f4] to-[#ece8e2] shadow-[0_2px_4px_rgba(0,0,0,0.1)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]">
            <div className="h-[14px] w-[14px] rounded-[4px] border-[1.5px] border-[#b5b0a8]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function IOSStatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between bg-[#0fa882] px-4 py-[3px] text-[10px] font-medium text-white/90">
      <div className="flex items-center gap-1">
        <span className="font-semibold">AT&T</span>
        <span className="text-[8px]">LTE</span>
      </div>
      <span className="text-[11px] font-semibold text-white">9:41 AM</span>
      <div className="flex items-center gap-1 text-[9px]">
        <span>100%</span>
        <svg viewBox="0 0 25 12" className="h-[10px] w-[20px]" fill="white">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="white" strokeWidth="1" fill="none" />
          <rect x="2" y="3" width="17" height="6" rx="0.5" fill="white" />
          <rect x="22" y="4" width="2" height="4" rx="0.5" fill="white" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function VineHeader({
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
    <div className="shrink-0">
      <div className="flex items-center justify-between bg-[#11bf95] px-4 py-3 text-white">
        <span className="text-xl">←</span>
        <VineLogo className="h-7 w-[92px] object-contain brightness-0 invert" />
        <span className="rounded bg-white/15 px-2 py-1 text-sm">💬</span>
      </div>
      <div className="border-b border-[#dce6e2] bg-[#f8fbfa] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-full border border-[#d8e5df] bg-white px-3 py-2 text-sm text-[#29413c]">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  submit();
                }
              }}
              placeholder="Search Vine"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <button
            onClick={onExplore}
            className="rounded-full border border-[#cfe0d8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#00a27b]"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
}

function ShutdownBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      className="flex shrink-0 items-center justify-between border-b border-[#ffc107] px-4 py-2 text-xs transition-opacity duration-300"
      style={{
        backgroundColor: '#fff3cd',
        opacity: dismissed ? 0.4 : 1,
      }}
    >
      <div>
        <span className="text-[#856404]">
          Vine will be discontinuing on January 17, 2017.{` `}
        </span>
        <span className="cursor-pointer text-[#00b488] underline">
          Download your Vines.
        </span>
        <span className="text-[#856404]">{` `}</span>
        <span className="cursor-pointer text-[#856404] underline">
          Learn more
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-4 cursor-pointer text-[#856404] hover:text-[#533608]"
        title="You can't save Vine"
      >
        &#10005;
      </button>
    </div>
  );
}

export function VineHome({ query, onSearch, onExplore }: VineHomeProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [vines, setVines] = useState<VinePostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTikTokEgg, setIsTikTokEgg] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const scrollLockRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = 500 + Math.random() * 300;
    const timer = setTimeout(() => {
      const data = vineData as Record<string, VineQueryData>;

      if (!query) {
        const trending = data['_trending'];
        setVines(trending?.vines ?? []);
        setLoading(false);
        return;
      }

      if (query.toLowerCase().trim() === 'tiktok') {
        setVines([]);
        setIsTikTokEgg(true);
        setLoading(false);
        return;
      }

      const match = searchVine(data, query);
      setVines(match?.results.vines ?? []);
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer);
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

      if (distanceFromBottom < 560) {
        scrollLockRef.current = true;
        setVisibleCount((count) => count + 4);
        window.setTimeout(() => {
          scrollLockRef.current = false;
        }, 180);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [loading, query]);

  const feedVines = query
    ? vines
    : Array.from({ length: visibleCount }, (_, index) => vines[index % Math.max(vines.length, 1)]).filter(Boolean);

  return (
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#dff7ef_0%,#f1f7f4_34%,#d9e6f1_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <VineFrame>
          <div className="flex h-full flex-col">
            <IOSStatusBar />
            <ShutdownBanner />
            <VineHeader
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearch={onSearch}
              onExplore={onExplore}
            />

            {query && (
              <div className="shrink-0 border-b border-[#e7ece9] bg-[#f6fbf8] px-4 py-3 text-sm text-[#61716c]">
                Search results for <span className="font-semibold text-[#21302c]">"{query}"</span>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-10 text-center">
                  <div className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-[#00bf8f] border-t-transparent" />
                </div>
              ) : isTikTokEgg ? (
                <div className="px-8 py-14 text-center">
                  <div className="text-5xl text-[#00bf8f]">🍇</div>
                  <p className="mt-4 text-lg font-bold text-[#20302b]">No results found.</p>
                  <p className="mt-2 text-sm text-[#6f7e7a]">Vine has never heard of this future app.</p>
                </div>
              ) : feedVines.length === 0 ? (
                <div className="px-8 py-14 text-center text-sm text-[#6f7e7a]">
                  No vines found for "{query}".
                </div>
              ) : (
                <>
                  {feedVines.map((vine, index) => (
                    <VinePost key={`${vine.id}-${Math.floor(index / Math.max(vines.length, 1))}`} vine={vine} />
                  ))}
                  {!query && (
                    <div className="px-4 py-5 text-center text-xs uppercase tracking-[0.16em] text-[#7d8c88]">
                      loading more loops...
                    </div>
                  )}
                </>
              )}
            </div>


          </div>
        </VineFrame>
      </div>
    </div>
  );
}
