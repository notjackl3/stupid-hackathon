import { useState, useMemo, useRef, type KeyboardEvent } from 'react';

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
  'clash royale',
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

  const submitSearch = () => {
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

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
    <div className="relative flex min-h-[calc(100vh-120px)] flex-col overflow-hidden bg-white font-[Arial,sans-serif] text-[#222]">
      <div className="flex items-center justify-end gap-[18px] px-5 pt-4 text-[13px] leading-6">
        <a className="cursor-pointer text-[#404040] hover:underline">Gmail</a>
        <a className="cursor-pointer text-[#404040] hover:underline">Images</a>
        <button className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-sm hover:bg-[#f3f3f3]" title="Google apps">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#777">
            <path d="M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          </svg>
        </button>
        <button className="cursor-pointer rounded-[2px] border border-[#2f5bb7] bg-[#4387fd] px-[12px] py-[6px] text-[13px] font-bold text-white">
          Sign in
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-[120px]">
        <div
          className="mb-7 select-none text-[92px] font-normal leading-none tracking-[-4px] flex items-end gap-2"
          style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}
        >
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          {/* Dabbing stick figure */}
          <svg
            width="60"
            height="60"
            viewBox="0 0 80 80"
            className="mb-2"
            style={{ overflow: 'visible', animation: 'googleDab 2s ease-in-out infinite' }}
          >
            <circle cx="40" cy="12" r="8" fill="#4285F4" />
            <line x1="40" y1="20" x2="40" y2="50" stroke="#EA4335" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="28" x2="15" y2="10" stroke="#FBBC05" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="28" x2="55" y2="15" stroke="#FBBC05" strokeWidth="3" strokeLinecap="round" />
            <line x1="55" y1="15" x2="45" y2="8" stroke="#FBBC05" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="50" x2="28" y2="72" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="50" x2="52" y2="72" stroke="#34A853" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <style>{`
            @keyframes googleDab {
              0%, 100% { transform: rotate(0deg); }
              15% { transform: rotate(-20deg) translateY(-5px); }
              30% { transform: rotate(0deg); }
            }
          `}</style>
        </div>

        <div className="relative w-full max-w-[584px]">
          <div className={`flex h-[44px] items-center border border-[#d9d9d9] bg-white px-4 shadow-[0_1px_1px_rgba(0,0,0,0.1)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] transition-shadow ${showSuggestions && suggestions.length > 0 ? 'rounded-t-[2px] border-b-0' : 'rounded-[2px]'}`}>
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
              className="flex-1 text-[16px] leading-[34px] text-[#222] outline-none"
              autoFocus
            />
            <svg className="ml-3 h-[22px] w-[22px] shrink-0 cursor-pointer text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full rounded-b-[2px] border border-t-0 border-[#d9d9d9] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] z-50">
              <div className="mx-[14px] border-t border-[#e8e8e8]" />
              {suggestions.map((s, i) => (
                <div
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex h-[34px] items-center gap-[10px] px-[14px] cursor-pointer text-[16px] ${
                    i === selectedIndex ? 'bg-[#eee]' : 'hover:bg-[#f8f8f8]'
                  }`}
                >
                  <svg className="h-4 w-4 shrink-0 text-[#bdc1c6]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span className="text-[#222]">{s}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-[18px] flex items-center gap-[11px]">
          <button
            onClick={submitSearch}
            className="h-[36px] min-w-[54px] cursor-pointer rounded-[2px] border border-[#f2f2f2] bg-[#f2f2f2] px-4 text-[13px] font-bold text-[#757575] hover:border-[#c6c6c6] hover:text-[#222] hover:shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
          >
            Google Search
          </button>
          <button
            onClick={() => onSearch('harambe')}
            className="h-[36px] min-w-[54px] cursor-pointer rounded-[2px] border border-[#f2f2f2] bg-[#f2f2f2] px-4 text-[13px] font-bold text-[#757575] hover:border-[#c6c6c6] hover:text-[#222] hover:shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
          >
            I&apos;m Feeling Lucky
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-[#e4e4e4] bg-[#f2f2f2]">
        <div className="flex items-center justify-between px-5 py-3 text-[13px] text-[#666] sm:px-[20px]">
          <div className="flex items-center gap-8">
            <a className="cursor-pointer hover:underline">Advertising</a>
            <a className="cursor-pointer hover:underline">Business</a>
            <a className="cursor-pointer hover:underline">About</a>
          </div>
          <div className="flex items-center gap-8">
            <a className="cursor-pointer hover:underline">Privacy</a>
            <a className="cursor-pointer hover:underline">Terms</a>
            <a className="cursor-pointer hover:underline">Settings</a>
          </div>
        </div>
      </div>
    </div>
  );
}
