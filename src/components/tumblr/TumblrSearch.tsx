import { useEffect, useMemo, useState } from 'react';
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

const SEARCH_FILTERS = ['Top', 'Latest', 'Posts', 'Blogs', 'Tags'];

function DeleteConfirmation({ onHome }: { onHome: () => void }) {
  return (
    <div className="rounded-[3px] bg-white text-[#444444] shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
      <div className="border-b border-[#e8ebef] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c8593]">
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
            className="cursor-pointer rounded-[3px] bg-[#36465d] px-4 py-2 text-sm font-semibold text-white"
          >
            never mind
          </button>
          <button className="cursor-not-allowed rounded-[3px] border border-[#e6c6c6] px-4 py-2 text-sm font-semibold text-[#b16a6a]">
            delete everything
          </button>
        </div>
      </div>
    </div>
  );
}

function SearchMetaRail({
  mode,
  query,
  resultCount,
  onTagClick,
}: {
  mode: 'search' | 'tagged';
  query: string;
  resultCount: number;
  onTagClick: (tag: string) => void;
}) {
  const relatedTags = useMemo(
    () =>
      mode === 'tagged'
        ? [query, `${query} aesthetic`, `${query} discourse`, `${query} fanart`]
        : [query, `${query} memes`, `${query} text post`, `${query} aesthetic`],
    [mode, query]
  );

  return (
    <div className="mb-5 rounded-[3px] bg-white px-5 py-4 text-[#444444] shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7c8593]">
        {mode === 'tagged' ? 'Tag page' : 'Search results'}
      </div>
      <div className="mt-3 grid gap-4 text-[14px] text-[#51627a] sm:grid-cols-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8593]">Results</div>
          <div className="mt-1 text-[24px] font-bold text-[#243140]">{resultCount}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8593]">Top blogs</div>
          <div className="mt-2 space-y-1">
            {['staff', 'fandom', 'aesthetics'].map((blog) => (
              <div key={blog}>@{blog}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#7c8593]">Related tags</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {relatedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick(tag)}
                className="rounded-full bg-[#eef3f8] px-3 py-1 text-[12px] font-semibold text-[#607289] hover:bg-[#dfe8f2]"
              >
                #{tag}
              </button>
            ))}
          </div>
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
    <div className="min-h-full bg-[#2f4158] bg-[radial-gradient(circle_at_top,rgba(102,125,155,0.45)_0%,rgba(70,91,118,0.16)_20%,rgba(47,65,88,0)_32%),linear-gradient(180deg,#34465d_0%,#2f4158_240px,#2f4158_100%)]">
      <TumblrHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
        onHome={onHome}
      />

      <TumblrPageShell onTagClick={onTagClick}>
        <TumblrHero
          eyebrow={isTagged ? 'Tagged' : 'Search'}
          title={isTagged ? `#${query}` : `"${query}"`}
          description={
            !loading && !exact && matchedQuery ? (
              <>
                Showing results for <span className="font-bold text-[#243140]">{matchedQuery}</span>
              </>
            ) : isTagged ? (
              'Posts people actually bothered to tag.'
            ) : (
              'Searching the dashboard, blogs, and the collective memory of 2016.'
            )
          }
          actions={
            <div className="flex flex-wrap gap-2">
              {SEARCH_FILTERS.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full px-3 py-1.5 text-[12px] font-bold ${
                    index === 0 ? 'bg-[#44546b] text-white' : 'bg-[#edf2f7] text-[#607289]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          }
        />

        {!loading && !isDeleteEgg ? (
          <SearchMetaRail
            mode={mode}
            query={exact || !matchedQuery ? query : matchedQuery}
            resultCount={results.length}
            onTagClick={onTagClick}
          />
        ) : null}

        {loading ? (
          <div className="rounded-[3px] bg-white px-6 py-10 text-center text-sm text-[#7c8593] shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
            loading the discourse...
          </div>
        ) : isDeleteEgg ? (
          <DeleteConfirmation onHome={onHome} />
        ) : results.length === 0 ? (
          <div className="rounded-[3px] bg-white px-6 py-10 text-center shadow-[0_1px_5px_rgba(0,0,0,0.09)]">
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
