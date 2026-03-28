import { useState, useMemo, useRef, type KeyboardEvent } from 'react';
import googleResults from '../../data/googleResults.json';

const EASTER_EGG_QUERIES = [
  'japan',
  'logan paul',
  'bottle flip',
  'damn daniel',
  'white vans',
  'harambe',
  'trump',
  'hillary clinton',
  'election 2016',
  'pokemon go',
  'pokémon go',
  'mannequin challenge',
  'ppap',
  'pen pineapple apple pen',
];

const SUGGESTION_KEYS = EASTER_EGG_QUERIES;

interface GoogleHomeProps {
  onSearch: (query: string) => void;
}

export function GoogleHome({ onSearch }: GoogleHomeProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return SUGGESTION_KEYS.slice(0, 10);
    return SUGGESTION_KEYS.filter((key) => key.toLowerCase().includes(q)).slice(0, 10);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        onSearch(suggestions[selectedIndex]);
      } else if (query.trim()) {
        onSearch(query.trim());
      }
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-120px)] bg-white">
      {/* Top-right nav */}
      <div className="flex items-center justify-end gap-4 px-6 pt-3 pb-1">
        <a className="text-[13px] text-[#5f6368] hover:underline cursor-pointer">Gmail</a>
        <a className="text-[13px] text-[#5f6368] hover:underline cursor-pointer">Images</a>
        {/* Apps grid icon */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer" title="Google apps">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="#5f6368">
            <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
        </button>
        <button className="text-[13px] text-white bg-[#4285F4] hover:bg-[#3367d6] px-5 py-1.5 rounded cursor-pointer font-medium">
          Sign in
        </button>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center flex-1 pb-24">
        {/* Google Logo with dabbing arms */}
        <div className="mb-7 relative">
          <style>{`
            @keyframes dabSwing {
              0% { transform: rotate(-60deg); }
              100% { transform: rotate(150deg); }
            }
          `}</style>
          {/* Left arm — pivots from bottom, swings upward */}
          <div
            style={{
              position: 'absolute',
              left: 10,
              bottom: '50%',
              width: 6,
              height: 70,
              background: '#4285F4',
              borderRadius: 3,
              transformOrigin: 'bottom center',
              animation: 'dabSwing 1.6s linear infinite alternate',
              zIndex: 1,
            }}
          />
          {/* Right arm — pivots from bottom, swings upward */}
          <div
            style={{
              position: 'absolute',
              right: 10,
              bottom: '50%',
              width: 6,
              height: 70,
              background: '#EA4335',
              borderRadius: 3,
              transformOrigin: 'bottom center',
              animation: 'dabSwing 1.6s linear infinite alternate',
              zIndex: 1,
            }}
          />
          <span className="text-[92px] font-normal select-none leading-none" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
          </span>
        </div>

        {/* Search bar — 2016 rectangular style */}
        <div className="w-full max-w-[526px] mb-6 relative">
          <div className={`flex items-center border border-[#d2d2d2] px-3 py-2 bg-white shadow-sm hover:shadow transition-shadow ${showSuggestions && suggestions.length > 0 ? 'rounded-t border-b-0' : 'rounded'}`}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-base text-gray-700 px-1"
              autoFocus
            />
            {/* Mic icon */}
            <svg className="w-5 h-5 text-[#4285F4] ml-2 cursor-pointer shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full bg-white border border-[#d2d2d2] border-t-0 rounded-b shadow-lg z-50">
              <div className="border-t border-[#e8e8e8] mx-3" />
              {suggestions.map((s, i) => (
                <div
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex items-center gap-3 px-4 py-1.5 cursor-pointer text-sm ${
                    i === selectedIndex ? 'bg-[#f2f2f2]' : 'hover:bg-[#f8f8f8]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-[#9aa0a6] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span className="text-[#222]">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => query.trim() && onSearch(query.trim())}
            className="bg-[#f2f2f2] text-[#5f6368] text-sm px-5 py-2 rounded border border-transparent hover:border-[#c6c6c6] hover:shadow-sm cursor-pointer"
          >
            Google Search
          </button>
          <button
            onClick={() => onSearch('harambe')}
            className="bg-[#f2f2f2] text-[#5f6368] text-sm px-5 py-2 rounded border border-transparent hover:border-[#c6c6c6] hover:shadow-sm cursor-pointer"
          >
            I'm Feeling Lucky
          </button>
        </div>

        {/* Google+ promo */}
        <div className="mt-8 text-sm text-[#5f6368]">
          <span>Try </span>
          <a className="text-[#4285F4] hover:underline cursor-pointer">Google+</a>
          <span> — share what matters most with the people who matter most.</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-[#f2f2f2] border-t border-[#e4e4e4] px-6 py-3 text-[13px] text-[#70757a]">
          <span>United States</span>
        </div>
        <div className="bg-[#f2f2f2] border-t border-[#e4e4e4] px-6 py-3 flex justify-between text-[13px] text-[#70757a]">
          <div className="flex gap-6">
            <a className="hover:underline cursor-pointer">Advertising</a>
            <a className="hover:underline cursor-pointer">Business</a>
            <a className="hover:underline cursor-pointer">About</a>
          </div>
          <div className="flex gap-6">
            <a className="hover:underline cursor-pointer">Privacy</a>
            <a className="hover:underline cursor-pointer">Terms</a>
            <a className="hover:underline cursor-pointer">Settings</a>
          </div>
        </div>
      </div>
    </div>
  );
}
