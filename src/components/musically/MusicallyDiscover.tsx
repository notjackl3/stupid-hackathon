import { useEffect, useState, type KeyboardEvent } from 'react';
import type { MusicallyPost as MusicallyPostType, MusicallyQueryData } from '../../types';
import { searchMusically } from '../../lib/fuzzySearch';
import { musicallyData } from '../../lib/musicallyData';
import { MusicallyPost } from './MusicallyPost';
import { MusicallyFrame, MusicallyLogo, MusicallyStatusBar, MusicallyTabBar } from './MusicallyShell';

interface MusicallyDiscoverProps {
  query: string;
  onSearch: (query: string) => void;
  onHome: () => void;
}

const CATEGORIES = [
  { name: 'popular', color: '#ff6f8c', accent: '♛' },
  { name: 'duet', color: '#ff8b68', accent: '⇄' },
  { name: 'comedy', color: '#ff7a59', accent: '☺' },
  { name: 'dance', color: '#ff5d8f', accent: '✦' },
  { name: 'city-lights', color: '#ff9b54', accent: '◌' },
  { name: 'throwback', color: '#f06a7e', accent: '♪' },
];

const FEATURED_MUSERS = ['Baby Ariel', 'Jacob Sartorius', 'Loren', 'Lisa and Lena', 'Kristen Hancher'];

export function MusicallyDiscover({ query, onSearch, onHome }: MusicallyDiscoverProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [posts, setPosts] = useState<MusicallyPostType[]>([]);
  const [loading, setLoading] = useState(Boolean(query));

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setPosts([]);
      return;
    }

    setLoading(true);
    const delay = 420 + Math.random() * 240;
    const timer = window.setTimeout(() => {
      const data = musicallyData as Record<string, MusicallyQueryData>;
      const match = searchMusically(data, query);
      setPosts(match?.results.posts ?? []);
      setLoading(false);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [query]);

  const submit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const searched = Boolean(query);

  return (
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#fff1eb_0%,#ffe7e2_40%,#fee2dc_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <MusicallyFrame>
          <div className="flex h-full flex-col bg-white">
            <MusicallyStatusBar />

            <div className="shrink-0 border-b border-[#f0d9de] bg-[linear-gradient(180deg,#fff8f8_0%,#fff0eb_100%)] px-4 pb-3 pt-3 text-[#4d4951]">
              <div className="flex items-center justify-between">
                <button
                  onClick={onHome}
                  className="rounded-full border border-[#f2d5db] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f05f7b]"
                >
                  Home
                </button>
                <MusicallyLogo className="scale-[0.88]" />
                <div className="rounded-full border border-[#f2d5db] bg-[linear-gradient(180deg,#ff758e_0%,#ff9770_100%)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                  Discover
                </div>
              </div>

              <div className="mt-3 rounded-[22px] border border-[#f2dce0] bg-white p-2 shadow-[0_8px_20px_rgba(233,178,188,0.16)]">
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.22em]">
                  <div className="rounded-full bg-[linear-gradient(180deg,#ff758e_0%,#ff9770_100%)] px-3 py-2 text-center font-bold text-white">
                    Online Library
                  </div>
                  <div className="rounded-full border border-[#f1d8de] bg-[#fff7f8] px-3 py-2 text-center font-semibold text-[#b8a3aa]">
                    My Songs
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-[18px] border border-[#f3e5e7] bg-[#fffdfd] px-3 py-2.5">
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
                    placeholder="Search sounds, musers, hashtags"
                    className="w-full bg-transparent text-[13px] text-[#47424a] outline-none placeholder:text-[#b6a8ae]"
                  />
                  <button
                    onClick={submit}
                    className="rounded-full bg-[linear-gradient(180deg,#ff768f_0%,#ff946f_100%)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#fffdfc] px-4 py-4">
              {!searched ? (
                <>
                  <div className="rounded-[24px] border border-[#f2e3e7] bg-white p-4 text-[#433e45] shadow-[0_10px_28px_rgba(239,207,214,0.14)]">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#c0abb1]">featured musers</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {FEATURED_MUSERS.map((name) => (
                        <button
                          key={name}
                          onClick={() => onSearch(name)}
                          className="rounded-full border border-[#f1d9de] bg-[#fff7f8] px-3 py-2 text-[12px] font-semibold text-[#665861] transition-opacity hover:opacity-90"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => onSearch(category.name)}
                        className="aspect-[1.05/1] overflow-hidden rounded-[24px] border border-white/70 p-4 text-left text-white shadow-[0_14px_26px_rgba(236,181,189,0.24)]"
                        style={{
                          background: `linear-gradient(160deg, ${category.color} 0%, rgba(255,255,255,0.32) 100%)`,
                        }}
                      >
                        <div className="text-[26px]">{category.accent}</div>
                        <div className="mt-8 text-[11px] uppercase tracking-[0.24em] text-white/70">browse</div>
                        <div className="mt-2 text-[20px] font-bold capitalize leading-5">
                          {category.name.replace('-', ' ')}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[24px] border border-[#f4d8dd] bg-[linear-gradient(135deg,#fff4f2_0%,#ffe8e2_100%)] p-4 text-[#433e45]">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-[#c0abb1]">today's prompt</div>
                    <p className="mt-2 text-[15px] font-semibold">
                      Use a dramatic chorus, one soft filter, and at least one overcommitted camera turn.
                    </p>
                    <p className="mt-2 text-[12px] text-[#9a8a92]">Popular right now: Closer, TRNDSTTR, Juju on That Beat.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 rounded-[22px] border border-[#f2e3e7] bg-white px-4 py-3 text-sm text-[#8b7881]">
                    Discover results for <span className="font-semibold text-[#433e45]">"{query}"</span>
                  </div>

                  <div className="overflow-hidden rounded-[26px] border border-[#f2e3e7] bg-white">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#ff8b78] border-t-transparent" />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="p-10 text-center text-sm text-[#9d8d94]">
                        Nothing popped for "{query}". Try `popular`, `dance`, or a featured muser.
                      </div>
                    ) : (
                      posts.map((post) => <MusicallyPost key={post.id} post={post} />)
                    )}
                  </div>
                </>
              )}
            </div>

            <MusicallyTabBar active="discover" onHome={onHome} />
          </div>
        </MusicallyFrame>
      </div>
    </div>
  );
}
