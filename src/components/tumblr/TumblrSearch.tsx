import { useEffect, useState } from 'react';
import tumblrData from '../../data/tumblrResults.json';
import { searchTumblr } from '../../lib/fuzzySearch';
import type { TumblrData, TumblrPost as TumblrPostType } from '../../types';
import { TumblrHeader, TumblrSidebar } from './TumblrDashboard';
import { TumblrPost } from './TumblrPost';

interface TumblrSearchProps {
  query: string;
  mode: 'search' | 'tagged';
  onSearch: (query: string) => void;
  onTagClick: (tag: string) => void;
  onHome: () => void;
}

function DeleteConfirmation({ onHome }: { onHome: () => void }) {
  return (
    <div className="rounded bg-white px-8 py-10 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/5">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#7c8593]">Delete Blog</div>
      <h2 className="mt-3 text-3xl font-bold text-[#243140]">Are you sure?</h2>
      <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#51627a]">
        You are about to delete your entire internet presence from this horrible website. Your mutuals will wonder where you went. Your queued posts will never see daylight. Your carefully cultivated tags will become ghost text in the void.
      </p>
      <p className="mt-4 text-sm text-[#7c8593]">
        Tumblr would like to gently ask whether perhaps you just need a snack.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={onHome} className="cursor-pointer rounded bg-[#36465d] px-4 py-2 text-sm font-semibold text-white">
          never mind
        </button>
        <button className="cursor-not-allowed rounded border border-[#e6c6c6] px-4 py-2 text-sm font-semibold text-[#b16a6a]">
          delete everything
        </button>
      </div>
    </div>
  );
}

export function TumblrSearch({ query, mode, onSearch, onTagClick, onHome }: TumblrSearchProps) {
  const data = tumblrData as TumblrData;
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<TumblrPostType[]>([]);
  const [matchedQuery, setMatchedQuery] = useState('');
  const [exact, setExact] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (mode === 'search' && query.toLowerCase().trim() === 'delete') {
        setResults([]);
        setMatchedQuery(query);
        setExact(true);
        setLoading(false);
        return;
      }

      const match = searchTumblr(data.search, query);
      if (match) {
        setResults(match.results);
        setMatchedQuery(match.matchedQuery);
        setExact(match.exact);
      } else {
        setResults([]);
        setMatchedQuery('');
        setExact(false);
      }
      setLoading(false);
    }, 400 + Math.random() * 220);

    return () => window.clearTimeout(timer);
  }, [data.search, mode, query]);

  const isDeleteEgg = mode === 'search' && query.toLowerCase().trim() === 'delete';
  const isTagged = mode === 'tagged';

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
            <div className="text-xs uppercase tracking-[0.16em] text-white/55">
              {isTagged ? 'tagged' : 'search'}
            </div>
            <h1 className="mt-2 text-2xl font-bold">
              {isTagged ? `#${query}` : `"${query}"`}
            </h1>
            {!loading && !exact && matchedQuery && (
              <p className="mt-2 text-sm text-white/75">
                Showing results for <span className="font-semibold text-white">{matchedQuery}</span>
              </p>
            )}
          </div>

          {loading ? (
            <div className="rounded bg-white px-6 py-10 text-center text-sm text-[#7c8593] shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              loading the discourse...
            </div>
          ) : isDeleteEgg ? (
            <DeleteConfirmation onHome={onHome} />
          ) : results.length === 0 ? (
            <div className="rounded bg-white px-6 py-10 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/5">
              <div className="text-lg font-bold text-[#243140]">No posts found.</div>
              <p className="mt-2 text-sm text-[#7c8593]">
                2016 Tumblr has absolutely no idea what this tag means yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((post) => (
                <TumblrPost key={post.id} post={post} onTagClick={onTagClick} />
              ))}
            </div>
          )}
        </main>

        <TumblrSidebar onTagClick={onTagClick} />
      </div>
    </div>
  );
}
