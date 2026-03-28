import { useEffect, useState, type KeyboardEvent, type ReactNode } from 'react';
import type { VinePost as VinePostType, VineQueryData } from '../../types';
import { searchVine } from '../../lib/fuzzySearch';
import { VineLogo } from './VineLogo';
import { VinePost } from './VinePost';
import vineData from '../../data/vineResults.json';

interface VineExploreProps {
  query: string;
  onSearch: (query: string) => void;
  onHome: () => void;
}

const CATEGORIES = [
  { name: 'Comedy', color: '#ff6b6b', emoji: '😂' },
  { name: 'Music', color: '#9b59b6', emoji: '🎵' },
  { name: 'Do It For The Vine', color: '#00b488', emoji: '🍇' },
  { name: 'Cringe', color: '#e74c3c', emoji: '😬' },
  { name: 'Animals', color: '#f39c12', emoji: '🐶' },
  { name: 'Sports', color: '#3498db', emoji: '🏀' },
  { name: 'Art', color: '#1abc9c', emoji: '🎨' },
];

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

export function VineExplore({ query, onSearch, onHome }: VineExploreProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [vines, setVines] = useState<VinePostType[]>([]);
  const [loading, setLoading] = useState(Boolean(query));
  const [isTikTokEgg, setIsTikTokEgg] = useState(false);

  useEffect(() => {
    if (!query) {
      return;
    }

    const delay = 500 + Math.random() * 300;
    const timer = setTimeout(() => {
      const data = vineData as Record<string, VineQueryData>;

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const searched = Boolean(query);

  return (
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#dff7ef_0%,#f1f7f4_34%,#d9e6f1_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <VineFrame>
          <div className="flex h-full flex-col">
            <IOSStatusBar />
            <ShutdownBanner />

            <div className="shrink-0">
              <div className="flex items-center justify-between bg-[#11bf95] px-4 py-3 text-white">
                <button onClick={onHome} className="cursor-pointer text-xl">←</button>
                <VineLogo className="h-7 w-[92px] object-contain brightness-0 invert" />
                <span className="rounded bg-white/15 px-2 py-1 text-sm">⌕</span>
              </div>

              <div className="border-b border-[#dce6e2] bg-[#f8fbfa] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-full border border-[#d8e5df] bg-white px-3 py-2 text-sm text-[#29413c]">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search Vine"
                      className="w-full bg-transparent outline-none"
                    />
                  </div>
                  <button
                    onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
                    className="rounded-full border border-[#cfe0d8] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#00a27b]"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#fcfffe] px-4 py-5">
              {!searched ? (
                <>
                  <h2 className="mb-4 text-lg font-bold text-[#20302b]">Explore Categories</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => onSearch(cat.name.toLowerCase())}
                        className="aspect-square cursor-pointer rounded-3xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
                        style={{ backgroundColor: cat.color }}
                      >
                        <div className="flex h-full flex-col items-center justify-center">
                          <span className="mb-2 text-3xl">{cat.emoji}</span>
                          <span>{cat.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 rounded-3xl border border-[#dce6e2] bg-white p-4 text-center">
                    <div className="mb-2 text-2xl">🍇</div>
                    <p className="text-sm font-bold text-[#20302b]">6 seconds can change the world</p>
                    <p className="mt-1 text-xs text-[#7d8c88]">Create, discover, and share short looping videos</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3 rounded-2xl border border-[#dce6e2] bg-white p-3">
                    <span className="text-sm text-[#7d8c88]">Exploring </span>
                    <span className="text-sm font-bold text-[#20302b]">"{query}"</span>
                  </div>

                  <div className="overflow-hidden rounded-[26px] border border-[#dce6e2] bg-white">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#00b488] border-t-transparent" />
                      </div>
                    ) : isTikTokEgg ? (
                      <div className="p-12 text-center">
                        <div className="mb-4 text-4xl text-[#00b488]">🍇</div>
                        <p className="text-lg font-bold text-[#333]">No results found.</p>
                        <p className="mt-2 text-sm italic text-[#00b488]">Vine will live forever.</p>
                      </div>
                    ) : vines.length === 0 ? (
                      <div className="p-8 text-center text-sm text-[#999]">
                        No vines found for "{query}". Try exploring a category instead.
                      </div>
                    ) : (
                      vines.map((vine) => (
                        <VinePost key={vine.id} vine={vine} />
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </VineFrame>
      </div>
    </div>
  );
}
