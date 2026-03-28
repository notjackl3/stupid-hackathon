import { useEffect, useState } from 'react';
import tumblrData from '../../data/tumblrResults.json';
import { searchTumblr } from '../../lib/fuzzySearch';
import type { TumblrData, TumblrPost as TumblrPostType } from '../../types';
import { TumblrHeader, TumblrHero, TumblrPageShell } from './TumblrDashboard';
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
    <div className="rounded-sm border border-white/10 bg-white text-[#36465d] shadow-[0_1px_0_rgba(0,0,0,0.12)]">
      <div className="border-b border-[#e8ebef] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#7c8593]">
        Delete Blog
      </div>
      <div className="px-6 py-6">
        <h2 className="text-[30px] font-bold leading-tight text-[#243140]">Are you sure?</h2>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#51627a]">
          You are about to delete your entire internet presence from this horrible website. Your
          mutuals will wonder where you went. Your queued posts will never see daylight. Your
          carefully cultivated tags will become ghost text in the void.
        </p>
        <p className="mt-4 text-sm text-[#7c8593]">
          Tumblr would like to gently ask whether perhaps you just need a snack.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onHome}
            className="cursor-pointer rounded-sm bg-[#36465d] px-4 py-2 text-sm font-semibold text-white"
          >
            never mind
          </button>
          <button className="cursor-not-allowed rounded-sm border border-[#e6c6c6] px-4 py-2 text-sm font-semibold text-[#b16a6a]">
            delete everything
          </button>
        </div>
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
    setSearchInput(query);
    setLoading(true);

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
    <div className="min-h-full bg-[#0d2138] bg-[radial-gradient(circle_at_top,#20334d_0%,#12243d_32%,#0d2138_70%)]">
      <TumblrHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        onHome={onHome}
      />

      <TumblrPageShell onTagClick={onTagClick}>
        <TumblrHero
          eyebrow={isTagged ? 'tagged' : 'search'}
          title={isTagged ? `#${query}` : `"${query}"`}
          description={
            !loading && !exact && matchedQuery ? (
              <>
                Showing results for <span className="font-bold text-white">{matchedQuery}</span>
              </>
            ) : (
              'A suspiciously specific slice of 2016 Tumblr.'
            )
          }
        />

        {loading ? (
          <div className="rounded-sm border border-white/10 bg-white px-6 py-10 text-center text-sm text-[#7c8593] shadow-[0_1px_0_rgba(0,0,0,0.12)]">
            loading the discourse...
          </div>
        ) : isDeleteEgg ? (
          <DeleteConfirmation onHome={onHome} />
        ) : results.length === 0 ? (
          <div className="rounded-sm border border-white/10 bg-white px-6 py-10 text-center shadow-[0_1px_0_rgba(0,0,0,0.12)]">
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
      </TumblrPageShell>
    </div>
  );
}
