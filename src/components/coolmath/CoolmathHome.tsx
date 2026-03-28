import { useState, useMemo, type KeyboardEvent } from 'react';
import { GAMES, CATEGORIES, getGamesByCategory } from '../../data/coolmathGames';

interface CoolmathHomeProps {
  query?: string;
  onSearch: (query: string) => void;
  onGameClick: (slug: string) => void;
}

const NAV_ITEMS = [
  { id: 'strategy', label: 'STRATEGY' },
  { id: 'skill', label: 'SKILL' },
  { id: 'numbers', label: 'NUMBERS' },
  { id: 'logic', label: 'LOGIC' },
  { id: 'more', label: '\u25BC MORE' },
  { id: 'classic', label: 'PLAYLISTS' },
  { id: 'all', label: 'RANDOM!' },
];

export function CoolmathHome({ query, onSearch, onGameClick }: CoolmathHomeProps) {
  const [searchInput, setSearchInput] = useState(query || '');
  const [activeCategory, setActiveCategory] = useState('all');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const filteredGames = useMemo(() => {
    let games = activeCategory === 'all' ? GAMES : getGamesByCategory(activeCategory);
    if (query) {
      const q = query.toLowerCase();
      games = games.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }
    return games;
  }, [activeCategory, query]);

  return (
    <div
      className="min-h-full overflow-y-auto bg-black"
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >
      {/* Header - blue oval with logo */}
      <div className="flex justify-center bg-black pb-1 pt-3">
        <div
          className="relative flex items-center justify-center px-12 py-3"
          style={{
            background: 'linear-gradient(180deg, #5bc8f5 0%, #1a8fd4 50%, #0a6aab 100%)',
            borderRadius: '50% / 60%',
            minWidth: '620px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="text-[42px] font-black italic tracking-tight"
            style={{
              color: '#ffe600',
              textShadow: '2px 2px 0 #c87000, -1px -1px 0 #c87000, 1px -1px 0 #c87000, -1px 1px 0 #c87000, 0 3px 6px rgba(0,0,0,0.3)',
              fontFamily: 'Impact, Arial Black, sans-serif',
            }}
          >
            Coolmath-Games.com
          </span>
          <span className="absolute right-[72px] top-[10px] text-[10px] font-bold text-[#ffe600]">
            &reg;
          </span>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-b border-[#333] bg-black">
        <div className="mx-auto flex max-w-[960px] items-center justify-center gap-0 px-4 py-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveCategory(item.id)}
              className="px-4 py-1 text-[15px] font-bold tracking-wide text-[#ffe600] hover:text-white"
              style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="ml-4 rounded-[4px] border-2 border-[#ffe600] px-4 py-1 text-[13px] font-bold tracking-wide text-[#ffe600] hover:bg-[#ffe600] hover:text-black"
            style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}
          >
            ALL GAMES A-Z
          </button>
        </div>
      </div>

      {/* Search bar area */}
      <div className="bg-black px-4 py-2">
        <div className="mx-auto flex max-w-[960px] items-center justify-end gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search games..."
            className="h-[28px] w-[200px] rounded-[3px] border border-[#555] bg-white px-2 text-[12px] text-[#333] outline-none"
          />
          <button
            type="button"
            onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
            className="h-[28px] rounded-[3px] bg-[#ffe600] px-3 text-[11px] font-bold text-black hover:bg-[#fff44f]"
          >
            Search
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[960px] px-4 pb-8">
        <div className="flex gap-4">
          {/* Main game list */}
          <div className="flex-1">
            {/* Section header */}
            <div className="mb-1 flex items-center justify-between border-b-[3px] border-b-[#ff3333] pb-2 pt-2">
              <h2 className="flex items-center gap-2 text-[24px] font-black text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                <span className="text-[18px]">🚩</span>
                {query
                  ? `SEARCH: "${query.toUpperCase()}"`
                  : activeCategory === 'all'
                    ? 'NEW GAMES'
                    : CATEGORIES.find((c) => c.id === activeCategory)?.label.toUpperCase() ?? 'GAMES'
                }
              </h2>
              <button
                type="button"
                className="rounded-[3px] border border-[#ffe600] px-3 py-1 text-[12px] text-[#ffe600] hover:bg-[#ffe600] hover:text-black"
              >
                See More
              </button>
            </div>

            {/* Game list - vertical layout like the screenshot */}
            <div className="space-y-0">
              {filteredGames.slice(0, 12).map((game, i) => {
                const isCompact = i >= 8;
                if (isCompact) {
                  return null;
                }
                return (
                  <button
                    key={game.slug}
                    type="button"
                    onClick={() => onGameClick(game.slug)}
                    className="group flex w-full items-start gap-4 border-b border-[#333] px-1 py-3 text-left hover:bg-[#111]"
                  >
                    {/* Thumbnail */}
                    <div
                      className="flex h-[80px] w-[100px] shrink-0 items-center justify-center rounded-[2px] text-[32px]"
                      style={{ backgroundColor: game.color }}
                    >
                      <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">{game.icon}</span>
                    </div>
                    {/* Info */}
                    <div className="pt-0.5">
                      <div className="text-[16px] font-bold text-[#00cccc] group-hover:text-[#00ffff] group-hover:underline">
                        {game.title}
                      </div>
                      <div className="mt-1 text-[13px] leading-[1.5] text-[#ccc]">
                        {game.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Compact 2-column row at bottom like screenshot */}
            {filteredGames.length > 8 && (
              <div className="grid grid-cols-2 gap-0">
                {filteredGames.slice(8, 12).map((game) => (
                  <button
                    key={game.slug}
                    type="button"
                    onClick={() => onGameClick(game.slug)}
                    className="group flex items-start gap-3 border-b border-[#333] px-1 py-3 text-left hover:bg-[#111]"
                  >
                    <div
                      className="flex h-[60px] w-[75px] shrink-0 items-center justify-center rounded-[2px] text-[24px]"
                      style={{ backgroundColor: game.color }}
                    >
                      <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">{game.icon}</span>
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[14px] font-bold text-[#00cccc] group-hover:text-[#00ffff] group-hover:underline">
                        {game.title}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-[1.4] text-[#aaa]">
                        {game.description.length > 60
                          ? game.description.slice(0, 60) + '...'
                          : game.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredGames.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-[14px] text-[#888]">No games found.</div>
                <div className="mt-1 text-[11px] text-[#666]">Try a different search or category.</div>
              </div>
            )}

            {/* Strategy Games section */}
            <div className="mt-6">
              <h2 className="flex items-center gap-2 border-b-[3px] border-b-[#00cccc] pb-2 text-[22px] font-black text-[#00cccc]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                <span className="text-[14px]">&#9658;</span> Strategy Games
              </h2>
              <div className="space-y-0">
                {getGamesByCategory('strategy').slice(0, 3).map((game) => (
                  <button
                    key={game.slug}
                    type="button"
                    onClick={() => onGameClick(game.slug)}
                    className="group flex w-full items-start gap-4 border-b border-[#333] px-1 py-3 text-left hover:bg-[#111]"
                  >
                    <div
                      className="flex h-[65px] w-[80px] shrink-0 items-center justify-center rounded-[2px] text-[28px]"
                      style={{ backgroundColor: game.color }}
                    >
                      <span className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">{game.icon}</span>
                    </div>
                    <div className="pt-0.5">
                      <div className="text-[15px] font-bold text-[#00cccc] group-hover:text-[#00ffff] group-hover:underline">
                        {game.title}
                      </div>
                      <div className="mt-1 text-[12px] leading-[1.5] text-[#ccc]">
                        {game.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-[280px] shrink-0">
            {/* Ad placeholder 1 */}
            <div className="mb-2 text-[10px] text-[#666]">Advertisement</div>
            <div className="mb-4 flex h-[250px] w-full items-center justify-center border border-[#333] bg-[#111]">
              <div className="text-center">
                <div className="text-[24px]">🏎️💨</div>
                <div className="mt-2 text-[14px] font-bold text-[#ffe600]">GO 3K</div>
                <div className="text-[11px] text-[#888]">Free Online Games!</div>
              </div>
            </div>

            {/* Strategy Games sidebar link */}
            <button
              type="button"
              onClick={() => setActiveCategory('strategy')}
              className="mb-4 flex w-full items-center gap-2 py-2 text-left"
            >
              <span className="text-[14px] text-[#00cccc]">&#9658;</span>
              <span className="text-[20px] font-black text-[#00cccc] hover:text-[#00ffff]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                Strategy Games
              </span>
            </button>

            {/* Ad placeholder 2 */}
            <div className="mb-2 text-[10px] text-[#666]">Advertisement</div>
            <div className="mb-4 flex h-[250px] w-full items-center justify-center border border-[#333] bg-[#111]">
              <div className="text-center">
                <div className="text-[32px]">🎮</div>
                <div className="mt-2 text-[12px] text-[#888]">Your Ad Here</div>
              </div>
            </div>

            {/* Skill Games sidebar link */}
            <button
              type="button"
              onClick={() => setActiveCategory('skill')}
              className="mb-4 flex w-full items-center gap-2 py-2 text-left"
            >
              <span className="text-[14px] text-[#00cccc]">&#9658;</span>
              <span className="text-[20px] font-black text-[#00cccc] hover:text-[#00ffff]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                Skill Games
              </span>
            </button>

            {/* Logic Games sidebar link */}
            <button
              type="button"
              onClick={() => setActiveCategory('logic')}
              className="flex w-full items-center gap-2 py-2 text-left"
            >
              <span className="text-[14px] text-[#00cccc]">&#9658;</span>
              <span className="text-[20px] font-black text-[#00cccc] hover:text-[#00ffff]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                Logic Games
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#333] bg-black px-4 py-6 text-center">
        <div className="text-[11px] text-[#888]">
          &copy; 2016 Coolmath.com LLC | Privacy Policy | Terms of Use
        </div>
      </div>
    </div>
  );
}
