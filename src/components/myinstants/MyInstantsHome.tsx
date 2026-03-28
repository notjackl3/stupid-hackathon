import { useState, type KeyboardEvent } from 'react';

interface MyInstantsHomeProps {
  query?: string;
  onSearch: (query: string) => void;
}

const POPULAR_SOUNDS = [
  'Sad Trombone', 'Air Horn', 'Dramatic Chipmunk', 'Fail', 'Inception BWAAAH',
  'John Cena', 'MLG Airhorn', 'Nope', 'Oof', 'Surprise Motherfucker',
  'To Be Continued', 'Wilhelm Scream', 'Wow', 'Yeah Boy', 'Bruh',
];

export function MyInstantsHome({ query, onSearch }: MyInstantsHomeProps) {
  const [searchInput, setSearchInput] = useState(query || '');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const filtered = query
    ? POPULAR_SOUNDS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_SOUNDS;

  return (
    <div className="min-h-full" style={{ background: '#f5a623', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: '#e8961b' }}>
        <div className="text-white text-xl font-bold">
          🔊 Myinstants
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search sounds..."
            className="px-3 py-1.5 rounded text-sm outline-none border-none"
            style={{ width: 220 }}
          />
          <button
            onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
            className="text-white text-sm px-3 py-1.5 rounded cursor-pointer font-bold"
            style={{ background: '#c97e12' }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Sound buttons */}
      <div className="p-6">
        <h2 className="text-white text-lg font-bold mb-4">
          {query ? `Results for "${query}"` : '🔥 Popular Sounds'}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {filtered.map((sound) => (
            <button
              key={sound}
              className="bg-white rounded-lg px-4 py-6 text-center font-bold text-sm cursor-pointer hover:scale-105 transition-transform shadow-md"
              style={{ color: '#e8961b' }}
              onClick={() => {
                // Just a visual button for now
              }}
            >
              🔊 {sound}
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-white text-center mt-8 text-lg">No sounds found. Try another search!</p>
        )}
      </div>
    </div>
  );
}
