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

  return (
    <div className="bg-white min-h-full">
      {/* Google header */}
      <div className="border-b border-[#ebebeb] bg-[#f1f1f1] px-8 py-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <span className="text-[30px] cursor-pointer select-none" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>

          {/* Search bar */}
          <div className="flex-1 max-w-[584px]">
            <div className="flex items-center border border-[#dfe1e5] rounded-full px-4 py-1.5 bg-white shadow-sm">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 outline-none text-base text-gray-700"
              />
              <svg className="w-5 h-5 text-[#4285F4] cursor-pointer" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </div>
          </div>

          {/* Google+ notification */}
          <div className="relative cursor-pointer" title="Google+">
            <span className="text-xl text-gray-500">&#128276;</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">0</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-2 ml-[158px] text-sm">
          <span className="text-[#4285F4] border-b-2 border-[#4285F4] pb-2 px-1 cursor-pointer">All</span>
          <span className="text-[#70757a] pb-2 px-1 hover:text-[#4285F4] cursor-pointer">Images</span>
          <span className="text-[#70757a] pb-2 px-1 hover:text-[#4285F4] cursor-pointer">News</span>
          <span className="text-[#70757a] pb-2 px-1 hover:text-[#4285F4] cursor-pointer" onClick={() => onNavigate('youtube')}>Videos</span>
          <span className="text-[#70757a] pb-2 px-1 hover:text-[#4285F4] cursor-pointer">Maps</span>
          <span className="text-[#70757a] pb-2 px-1 hover:text-[#4285F4] cursor-pointer">More &#9662;</span>
        </div>
      </div>

      {/* Results area */}
      <div className="pl-[160px] pr-8 py-6 max-w-[900px]">
        {loading ? (
          <div className="text-gray-400 text-sm py-8">Loading...</div>
        ) : loadingLlm ? (
          <div className="text-gray-400 text-sm py-8">Consulting the time machine...</div>
        ) : results === null ? (
          /* No results - IE error style */
          <div className="mt-8 p-6 bg-[#ffffcc] border border-[#e0d060]">
            <div className="text-lg font-bold text-[#333] mb-2">Your search - <b>{query}</b> - did not match any documents.</div>
            <p className="text-sm text-[#666] mb-4">This page cannot be displayed. The internet in 2016 doesn't know what this is.</p>
            <p className="text-sm text-[#666]">Suggestions:</p>
            <ul className="text-sm text-[#666] list-disc ml-5 mt-1">
              <li>Make sure all words are spelled correctly.</li>
              <li>Try different keywords.</li>
              <li>Try more general keywords.</li>
              <li>Wait a few years and try again.</li>
            </ul>
          </div>
        ) : (
          <>
            {/* Result count */}
            <div className="text-[#70757a] text-sm mb-5">
              About {(Math.floor(Math.random() * 900) + 100).toLocaleString()},{(Math.floor(Math.random() * 900) + 100).toLocaleString()},000 results (0.{Math.floor(Math.random() * 90) + 10} seconds)
            </div>

            {/* Did you mean */}
            {!isExact && (
              <div className="text-sm mb-5">
                <span className="text-[#70757a]">Showing results for </span>
                <a
                  className="text-[#4285F4] italic cursor-pointer hover:underline"
                  onClick={() => onSearch(matchedQuery)}
                >
                  {matchedQuery}
                </a>
              </div>
            )}
            {results.didYouMean && (
              <div className="text-sm mb-5">
                <span className="text-[#70757a]">Did you mean: </span>
                <a
                  className="text-[#4285F4] italic cursor-pointer hover:underline"
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
                  <div key={`ad-${i}`} className="mb-6">
                    <div className="flex items-center gap-1">
                      <span className="text-[#006621] bg-[#fff3c8] text-[11px] px-1 border border-[#e0d060] rounded mr-1">Ad</span>
                      <span className="text-[#006621] text-sm">{ad.url}</span>
                    </div>
                    <a
                      href={ad.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1a0dab] text-lg hover:underline cursor-pointer leading-tight block"
                    >
                      {ad.title}
                    </a>
                    <p className="text-[#545454] text-sm mt-0.5">{ad.snippet}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Organic results */}
            {results.results.map((result, i) => (
              <div key={i} className="mb-6">
                <div className="text-[#006621] text-sm">{result.url}</div>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a0dab] text-lg hover:underline cursor-pointer leading-tight block"
                >
                  {result.title}
                </a>
                <p className="text-[#545454] text-sm mt-0.5">{result.snippet}</p>
              </div>
            ))}

            {/* People also ask */}
            {results.peopleAlsoAsk && results.peopleAlsoAsk.length > 0 && (
              <div className="mt-6 mb-6 border border-[#dfe1e5] rounded">
                <div className="px-4 py-3 font-medium text-[#202124]">People also ask</div>
                {results.peopleAlsoAsk.map((q, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 border-t border-[#dfe1e5] text-[#202124] text-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => onSearch(q)}
                  >
                    <span>{q}</span>
                    <span className="text-gray-400">&#9662;</span>
                  </div>
                ))}
              </div>
            )}

            {/* Related searches */}
            <div className="mt-8 mb-8">
              <div className="text-[#202124] font-medium mb-3">Related searches</div>
              <div className="grid grid-cols-2 gap-2">
                {[`${query} 2016`, `${query} meaning`, `${query} reddit`, `${query} wiki`,
                  `is ${query} real`, `${query} for beginners`, `${query} meme`, `${query} news`
                ].map((term, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-[#f1f3f4] rounded-full px-4 py-2 text-sm text-[#4285F4] cursor-pointer hover:underline"
                    onClick={() => onSearch(term)}
                  >
                    <svg className="w-3.5 h-3.5 text-[#9aa0a6]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                    {term}
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
