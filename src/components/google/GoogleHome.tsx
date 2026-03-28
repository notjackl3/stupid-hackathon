import { useState, type KeyboardEvent } from 'react';

interface GoogleHomeProps {
  onSearch: (query: string) => void;
}

export function GoogleHome({ onSearch }: GoogleHomeProps) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
    }
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
              0%, 100% { transform: rotate(-60deg); }
              50% { transform: rotate(150deg); }
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
              animation: 'dabSwing 1.6s ease-in-out infinite',
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
              animation: 'dabSwing 1.6s ease-in-out infinite',
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
        <div className="w-full max-w-[526px] mb-6">
          <div className="flex items-center border border-[#d2d2d2] rounded px-3 py-2 bg-white shadow-sm hover:shadow transition-shadow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-base text-gray-700 px-1"
              autoFocus
            />
            {/* Mic icon */}
            <svg className="w-5 h-5 text-[#4285F4] ml-2 cursor-pointer shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </div>
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
