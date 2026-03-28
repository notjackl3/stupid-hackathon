import { useState, useEffect, type KeyboardEvent } from 'react';
import type { GoogleQueryData } from '../../types';
import { searchGoogle } from '../../lib/fuzzySearch';
import { generateGoogleResults } from '../../lib/llmFallback';
import googleData from '../../data/googleResults.json';

interface GoogleResultsProps {
  query: string;
  onSearch: (query: string) => void;
  onNavigate: (site: 'google' | 'youtube' | 'twitter') => void;
}

function deterministicValue(seed: string, offset: number, min: number, spread: number) {
  const total = Array.from(`${seed}-${offset}`).reduce((sum, char) => sum + char.charCodeAt(0) * (offset + 1), 0);
  return min + (total % spread);
}

export function GoogleResults({ query, onSearch, onNavigate }: GoogleResultsProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<GoogleQueryData | null>(null);
  const [matchedQuery, setMatchedQuery] = useState('');
  const [isExact, setIsExact] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingLlm, setLoadingLlm] = useState(false);

  useEffect(() => {
    setSearchInput(query);
    setLoading(true);
    setLoadingLlm(false);

    const delay = 500 + Math.random() * 300;
    const timer = setTimeout(async () => {
      const lowerQuery = query.toLowerCase().trim();

      // Future year easter egg
      const yearMatch = lowerQuery.match(/^(201[7-9]|20[2-9]\d|2[1-9]\d{2})$/);
      if (yearMatch) {
        setResults({
          results: [],
          didYouMean: '2016',
          peopleAlsoAsk: ['What year is it?', 'How does time work?'],
        });
        setMatchedQuery(query);
        setIsExact(true);
        setLoading(false);
        return;
      }

      const match = searchGoogle(googleData as Record<string, GoogleQueryData>, query);
      if (match) {
        setResults(match.results);
        setMatchedQuery(match.matchedQuery);
        setIsExact(match.exact);
        setLoading(false);
      } else {
        // No static match — try LLM fallback
        setLoading(false);
        setLoadingLlm(true);
        const llmResult = await generateGoogleResults(query);
        setLoadingLlm(false);
        if (llmResult) {
          setResults(llmResult);
          setMatchedQuery(query);
          setIsExact(true);
        } else {
          setResults(null);
          setMatchedQuery('');
          setIsExact(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const resultLead = deterministicValue(query || 'google', 1, 100, 900);
  const resultTail = deterministicValue(query || 'google', 2, 100, 900);
  const resultSpeed = deterministicValue(query || 'google', 3, 10, 90);

  return (
    <div className="min-h-full bg-white text-[#222]">
      {/* Google header */}
      <div className="border-b border-[#ebebeb] bg-white px-8 pt-4">
        <div className="flex items-center gap-7">
          {/* Logo */}
          <span className="cursor-pointer select-none text-[31px] leading-none" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>

          {/* Search bar */}
          <div className="max-w-[632px] flex-1">
            <div className="flex h-[44px] items-center rounded-[2px] border border-[#d9d9d9] bg-white px-[15px] shadow-[0_2px_2px_rgba(0,0,0,0.12)]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-none text-[16px] leading-[34px] text-[#222] outline-none"
              />
              <svg className="h-[21px] w-[21px] cursor-pointer text-[#4285f4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>

          {/* Google+ notification */}
          <div className="relative cursor-pointer pr-3" title="Google+">
            <span className="text-[18px] text-[#777]">&#128276;</span>
            <span className="absolute -top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#db4437] text-[10px] text-white">0</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="ml-[128px] mt-3 flex gap-6 text-[13px] text-[#777]">
          <span className="cursor-pointer border-b-[3px] border-[#4285f4] px-0.5 pb-[10px] font-medium text-[#4285f4]">All</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]">Images</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]">News</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]" onClick={() => onNavigate('youtube')}>Videos</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]">Maps</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]">More</span>
          <span className="cursor-pointer pb-[10px] hover:text-[#222]">Search tools</span>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-[760px] pl-[150px] pr-8 pt-3 pb-10">
        {loading ? (
          <div className="py-8 text-sm text-[#808080]">Loading...</div>
        ) : loadingLlm ? (
          <div className="py-8 text-sm text-[#808080]">Consulting the time machine...</div>
        ) : results === null ? (
          /* No results - IE error style */
          <div className="mt-8 border border-[#e0d060] bg-[#ffffcc] p-6">
            <div className="mb-2 text-lg font-bold text-[#333]">Your search - <b>{query}</b> - did not match any documents.</div>
            <p className="mb-4 text-sm text-[#666]">This page cannot be displayed. The internet in 2016 doesn't know what this is.</p>
            <p className="text-sm text-[#666]">Suggestions:</p>
            <ul className="mt-1 ml-5 list-disc text-sm text-[#666]">
              <li>Make sure all words are spelled correctly.</li>
              <li>Try different keywords.</li>
              <li>Try more general keywords.</li>
              <li>Wait a few years and try again.</li>
            </ul>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div className="mb-[18px] text-[13px] leading-4 text-[#808080]">
              About {resultLead.toLocaleString()},{resultTail.toLocaleString()},000 results (0.{resultSpeed} seconds)
            </div>

            {/* Did you mean */}
            {!isExact && (
              <div className="mb-5 text-[15px] leading-5">
                <span className="text-[#70757a]">Showing results for </span>
                <a
                  className="cursor-pointer italic text-[#1a0dab] hover:underline"
                  onClick={() => onSearch(matchedQuery)}
                >
                  {matchedQuery}
                </a>
              </div>
            )}
            {results.didYouMean && (
              <div className="mb-5 text-[15px] leading-5">
                <span className="text-[#70757a]">Did you mean: </span>
                <a
                  className="cursor-pointer italic text-[#1a0dab] hover:underline"
                  onClick={() => onSearch(results.didYouMean!)}
                >
                  {results.didYouMean}
                </a>
                <span className="text-[#70757a]">?</span>
              </div>
            )}

            {/* Ads */}
            {results.ads && results.ads.length > 0 && (
              <div className="mb-5">
                {results.ads.map((ad, i) => (
                  <div key={`ad-${i}`} className="mb-[22px] max-w-[632px]">
                    <div className="mb-0.5 flex items-center gap-1">
                      <span className="mr-1 border border-[#c6b84d] bg-[#fff3c8] px-1 text-[11px] leading-4 text-[#222]">Ad</span>
                      <span className="text-[14px] leading-[1.3] text-[#006621]">{ad.url}</span>
                    </div>
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[18px] leading-[1.2] text-[#1a0dab] hover:underline"
                    >
                      {ad.title}
                    </a>
                    <p className="mt-0.5 text-[13px] leading-[1.4] text-[#545454]">{ad.snippet}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Organic results */}
            {results.results.map((result, i) => (
              <div key={i} className="mb-[24px] max-w-[632px]">
                <div className="mb-0.5 text-[14px] leading-[1.3] text-[#006621]">{result.url}</div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[18px] leading-[1.2] text-[#1a0dab] hover:underline"
                >
                  {result.title}
                </a>
                <p className="mt-0.5 text-[13px] leading-[1.4] text-[#545454]">{result.snippet}</p>
              </div>
            ))}

            {/* People also ask */}
            {results.peopleAlsoAsk && results.peopleAlsoAsk.length > 0 && (
              <div className="mt-8 mb-6 max-w-[632px] border border-[#e5e5e5] bg-white">
                <div className="border-b border-[#e5e5e5] px-4 py-3 text-[18px] leading-6 text-[#222]">People also ask</div>
                {results.peopleAlsoAsk.map((q, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center justify-between border-t border-[#e5e5e5] px-4 py-3 text-[14px] text-[#222] hover:bg-[#fafafa]"
                    onClick={() => onSearch(q)}
                  >
                    <span>{q}</span>
                    <span className="text-[#999]">&#9662;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Related searches */}
            <div className="mt-8 mb-8 max-w-[632px]">
              <div className="mb-3 text-[18px] leading-6 text-[#222]">Searches related to {query}</div>
              <div className="grid grid-cols-2 gap-y-2">
                {[`${query} 2016`, `${query} meaning`, `${query} reddit`, `${query} wiki`,
                  `is ${query} real`, `${query} for beginners`, `${query} meme`, `${query} news`
                ].map((term, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-start gap-2 text-[14px] font-bold leading-5 text-[#1a0dab] hover:underline"
                    onClick={() => onSearch(term)}
                  >
                    <svg className="mt-0.5 h-3.5 w-3.5 text-[#b5b5b5]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
