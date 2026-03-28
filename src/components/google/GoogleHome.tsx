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
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white">
      {/* Google Logo - 2016 style */}
      <div className="mb-6">
        <span className="text-[92px] font-normal select-none" style={{ fontFamily: "'Product Sans', Arial, sans-serif" }}>
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
        </span>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-[584px] mb-4">
        <div className="flex items-center border border-[#dfe1e5] rounded-full px-4 py-2.5 hover:shadow-md transition-shadow bg-white">
          <svg className="w-5 h-5 text-[#9aa0a6] mr-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-base text-gray-700"
            autoFocus
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          onClick={() => query.trim() && onSearch(query.trim())}
          className="bg-[#f2f2f2] text-[#5f6368] text-sm px-4 py-2 rounded hover:border hover:border-[#c6c6c6] hover:shadow-sm cursor-pointer"
        >
          Google Search
        </button>
        <button
          onClick={() => onSearch('harambe')}
          className="bg-[#f2f2f2] text-[#5f6368] text-sm px-4 py-2 rounded hover:border hover:border-[#c6c6c6] hover:shadow-sm cursor-pointer"
        >
          I'm Feeling Lucky
        </button>
      </div>

      {/* Google+ promo - subtle 2016 touch */}
      <div className="mt-16 text-sm text-[#5f6368]">
        <span>Try </span>
        <a className="text-[#4285F4] hover:underline cursor-pointer">Google+</a>
        <span> — share what matters most with the people who matter most.</span>
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
