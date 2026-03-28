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
      <div className="border-b border-[#ebebeb] bg-white px-0 pt-5 pb-0">
        <div className="flex items-center gap-[28px] pl-[28px] pr-6">
          {/* Logo */}
          <span className="shrink-0 cursor-pointer select-none text-[28px] leading-none" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>

          {/* Search bar */}
          <div className="max-w-[584px] flex-1">
            <div className="flex h-[44px] items-center rounded-[22px] border border-[#dfe1e5] bg-white px-[16px] shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-none text-[16px] leading-[34px] text-[#222] outline-none"
              />
              <svg className="h-[20px] w-[20px] cursor-pointer text-[#4285f4]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>

          <div className="flex-1" />

          {/* Google+ notification */}
          <div className="relative shrink-0 cursor-pointer" title="Google+">
            <span className="text-[18px] text-[#777]">&#128276;</span>
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#db4437] text-[10px] text-white">0</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="ml-[116px] mt-[6px] flex gap-[4px] text-[13px] text-[#5f6368]">
          <span className="cursor-pointer border-b-[3px] border-[#4285f4] px-3 pb-[10px] font-medium text-[#4285f4]">All</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]">Images</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]">News</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]" onClick={() => onNavigate('youtube')}>Videos</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]">Maps</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]">More</span>
          <span className="cursor-pointer border-b-[3px] border-transparent px-3 pb-[10px] hover:text-[#222]">Search tools</span>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-[760px] pl-[150px] pr-8 pt-5 pb-10">
        {loading ? (
          <div className="py-8 text-sm text-[#808080]">Loading...</div>
        ) : loadingLlm ? (
          <div className="py-8 text-sm text-[#808080]">Consulting the time machine...</div>
        ) : results === null ? (
          /* No results - IE error style */
          <div className="mt-4 max-w-[600px] border border-[#e0d060] bg-[#ffffcc] p-5">
            <div className="mb-1 text-[16px] font-bold leading-[22px] text-[#333]">Your search - <b>{query}</b> - did not match any documents.</div>
            <p className="mb-3 text-[13px] leading-[18px] text-[#666]">This page cannot be displayed. The internet in 2016 doesn't know what this is.</p>
            <p className="text-[13px] leading-[18px] text-[#666]">Suggestions:</p>
            <ul className="mt-1 ml-5 list-disc text-[13px] leading-[20px] text-[#666]">
              <li>Make sure all words are spelled correctly.</li>
              <li>Try different keywords.</li>
              <li>Try more general keywords.</li>
              <li>Wait a few years and try again.</li>
            </ul>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div className="mb-[6px] text-[13px] leading-[43px] text-[#808080]">
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
              <div className="mb-4">
                {results.ads.map((ad, i) => (
                  <div key={`ad-${i}`} className="mb-[20px] max-w-[600px]">
                    <div className="flex items-center gap-1">
                      <span className="mr-1 rounded-[2px] border border-[#c6b84d] bg-[#fff3c8] px-[3px] text-[11px] leading-[15px] text-[#006621]">Ad</span>
                      <span className="text-[14px] leading-[16px] text-[#006621]">{ad.url}</span>
                    </div>
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-[1px] block text-[18px] leading-[21.6px] text-[#1a0dab] hover:underline"
                    >
                      {ad.title}
                    </a>
                    <p className="mt-[1px] text-[13px] leading-[18px] text-[#545454]">{ad.snippet}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Organic results */}
            {results.results.map((result, i) => (
              <div key={i} className="mb-[20px] max-w-[600px]">
                <div className="text-[14px] leading-[16px] text-[#006621]">{result.url}</div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-[1px] block text-[18px] leading-[21.6px] text-[#1a0dab] hover:underline"
                >
                  {result.title}
                </a>
                <p className="mt-[1px] text-[13px] leading-[18px] text-[#545454]">{result.snippet}</p>
              </div>
            ))}

            {/* People also ask */}
            {results.peopleAlsoAsk && results.peopleAlsoAsk.length > 0 && (
              <div className="mt-4 mb-5 max-w-[600px] rounded-[2px] border border-[#e5e5e5] bg-white">
                <div className="px-[15px] py-[12px] text-[20px] leading-[26px] text-[#222]">People also ask</div>
                {results.peopleAlsoAsk.map((q, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center justify-between border-t border-[#e5e5e5] px-[15px] py-[11px] text-[14px] leading-[20px] text-[#222] hover:bg-[#fafafa]"
                    onClick={() => onSearch(q)}
                  >
                    <span>{q}</span>
                    <span className="ml-4 text-[11px] text-[#70757a]">&#9662;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Related searches */}
            <div className="mt-6 mb-8 max-w-[600px]">
              <div className="mb-[10px] text-[18px] leading-[22px] text-[#222]">Searches related to {query}</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-[8px]">
                {[`${query} 2016`, `${query} meaning`, `${query} reddit`, `${query} wiki`,
                  `is ${query} real`, `${query} for beginners`, `${query} meme`, `${query} news`
                ].map((term, i) => (
                  <div
                    key={i}
                    className="flex cursor-pointer items-center gap-[10px] text-[14px] leading-[20px] text-[#1a0dab] hover:underline"
                    onClick={() => onSearch(term)}
                  >
                    <svg className="h-[14px] w-[14px] shrink-0 text-[#70757a]" viewBox="0 0 24 24" fill="currentColor">
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
