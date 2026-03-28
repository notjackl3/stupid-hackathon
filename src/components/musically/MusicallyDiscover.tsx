import { useEffect, useState, type KeyboardEvent } from 'react';
import type { MusicallyPost as MusicallyPostType, MusicallyQueryData } from '../../types';
import { searchMusically } from '../../lib/fuzzySearch';
import musicallyData from '../../data/musicallyResults.json';
import { MusicallyPost } from './MusicallyPost';
import { MusicallyFrame, MusicallyLogo, MusicallyStatusBar } from './MusicallyShell';

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
    <div className="flex h-full items-stretch justify-center bg-[radial-gradient(circle_at_top,#ffd8e1_0%,#ffe7cb_36%,#eedbff_100%)] px-4 py-4">
      <div className="w-full max-w-[430px]">
        <MusicallyFrame>
          <div className="flex h-full flex-col bg-[#120910]">
            <MusicallyStatusBar />

            <div className="shrink-0 bg-[linear-gradient(180deg,#ff668d_0%,#ff9467_100%)] px-4 pb-4 pt-4 text-white">
              <div className="flex items-center justify-between">
                <button
                  onClick={onHome}
                  className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
                >
                  Home
                </button>
                <MusicallyLogo className="scale-[0.88]" />
                <div className="rounded-full bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Discover
                </div>
              </div>

              <div className="mt-4 rounded-[22px] border border-white/14 bg-[#120910]/32 p-2">
                <div className="grid grid-cols-2 gap-2 text-[10px] uppercase tracking-[0.22em]">
                  <div className="rounded-full bg-white px-3 py-2 text-center font-bold text-[#ef5f78]">
                    Online Library
                  </div>
                  <div className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-center font-semibold text-white/72">
                    My Songs
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-[18px] bg-white/10 px-3 py-2.5">
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
                    placeholder="Search sounds, musers, hashtags"
                    className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/54"
                  />
                  <button
                    onClick={submit}
                    className="rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ec5c78]"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,#180b13_0%,#120910_100%)] px-4 py-4">
              {!searched ? (
                <>
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-white">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/42">featured musers</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {FEATURED_MUSERS.map((name) => (
                        <button
                          key={name}
                          onClick={() => onSearch(name)}
                          className="rounded-full border border-white/10 bg-white/8 px-3 py-2 text-[12px] font-semibold text-white/86 transition-opacity hover:opacity-90"
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
                        className="aspect-[1.05/1] overflow-hidden rounded-[24px] p-4 text-left text-white shadow-[0_18px_30px_rgba(0,0,0,0.18)]"
                        style={{
                          background: `linear-gradient(160deg, ${category.color} 0%, rgba(28, 10, 19, 0.92) 100%)`,
                        }}
                      >
                        <div className="text-[26px]">{category.accent}</div>
                        <div className="mt-8 text-[11px] uppercase tracking-[0.24em] text-white/54">browse</div>
                        <div className="mt-2 text-[20px] font-bold capitalize leading-5">
                          {category.name.replace('-', ' ')}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,111,140,0.24),rgba(255,153,102,0.12))] p-4 text-white">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-white/48">today's prompt</div>
                    <p className="mt-2 text-[15px] font-semibold">
                      Use a dramatic chorus, one soft filter, and at least one overcommitted camera turn.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
                    Discover results for <span className="font-semibold text-white">"{query}"</span>
                  </div>

                  <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#160b12]">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#ff8b78] border-t-transparent" />
                      </div>
                    ) : posts.length === 0 ? (
                      <div className="p-10 text-center text-sm text-white/62">
                        Nothing popped for "{query}". Try `popular`, `dance`, or a featured muser.
                      </div>
                    ) : (
                      posts.map((post) => <MusicallyPost key={post.id} post={post} />)
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </MusicallyFrame>
      </div>
    </div>
  );
}
