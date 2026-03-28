import { useMemo } from 'react';
import { getGameBySlug, GAMES } from '../../data/coolmathGames';

interface CoolmathGameProps {
  slug: string;
  onBack: () => void;
  onGameClick: (slug: string) => void;
  onSearch: (query: string) => void;
}

function FlashRequired({ title }: { title: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#1a1a2e] p-8 text-center">
      {/* Flash Player puzzle piece icon */}
      <div className="mb-4 flex h-[80px] w-[80px] items-center justify-center rounded-[8px] bg-gradient-to-br from-[#cc0000] to-[#990000] shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M8 12h20l-8 12h12L16 42l4-14H8l0-16z" fill="white" />
        </svg>
      </div>
      <div className="mb-2 text-[18px] font-bold text-white">
        Adobe Flash Player is required
      </div>
      <div className="mb-4 text-[13px] leading-[1.5] text-[#aaa]">
        {title} requires Adobe Flash Player to run.<br />
        Click the button below to enable Flash.
      </div>
      <button
        type="button"
        className="mb-3 rounded-[4px] bg-[#cc0000] px-6 py-2 text-[13px] font-bold text-white shadow-[0_2px_4px_rgba(0,0,0,0.3)] hover:bg-[#dd2222]"
        onClick={() => {
          // Do nothing — it's 2016, Flash just doesn't work sometimes
        }}
      >
        Enable Adobe Flash Player
      </button>
      <div className="text-[11px] text-[#666]">
        Adobe Flash Player version 24.0 or later is required.
      </div>
      <div className="mt-6 rounded-[4px] border border-[#333] bg-[#111] px-4 py-3">
        <div className="text-[11px] text-[#888]">
          Having trouble? Try these steps:
        </div>
        <ol className="mt-2 space-y-1 text-left text-[10px] text-[#777]">
          <li>1. Right-click and select "Run this plugin"</li>
          <li>2. Check that Flash is enabled in chrome://plugins</li>
          <li>3. Update Flash Player at get.adobe.com/flashplayer</li>
          <li>4. Try using Internet Explorer instead</li>
        </ol>
      </div>
    </div>
  );
}

export function CoolmathGame({ slug, onBack, onGameClick, onSearch }: CoolmathGameProps) {
  const game = getGameBySlug(slug);

  const otherGames = useMemo(() => {
    if (!game) return [];
    const related = GAMES.filter((g) => g.slug !== slug && g.category === game.category).slice(0, 4);
    if (related.length >= 4) return related;
    return [...related, ...GAMES.filter((g) => g.slug !== slug && !related.includes(g)).slice(0, 4 - related.length)];
  }, [slug, game]);

  if (!game) {
    return (
      <div className="flex min-h-full items-center justify-center bg-black" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="text-center">
          <div className="text-[16px] font-bold text-[#ff4444]">Game not found!</div>
          <button type="button" onClick={onBack} className="mt-3 text-[12px] text-[#00cccc] underline">
            Back to all games
          </button>
        </div>
      </div>
    );
  }

  const isFlash = !game.embedUrl;

  return (
    <div className="min-h-full overflow-y-auto bg-black" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-center bg-black pb-1 pt-3">
        <button type="button" onClick={onBack}>
          <div
            className="relative flex items-center justify-center px-10 py-2"
            style={{
              background: 'linear-gradient(180deg, #5bc8f5 0%, #1a8fd4 50%, #0a6aab 100%)',
              borderRadius: '50% / 60%',
              minWidth: '480px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            <span
              className="text-[32px] font-black italic tracking-tight"
              style={{
                color: '#ffe600',
                textShadow: '2px 2px 0 #c87000, -1px -1px 0 #c87000, 1px -1px 0 #c87000, -1px 1px 0 #c87000, 0 3px 6px rgba(0,0,0,0.3)',
                fontFamily: 'Impact, Arial Black, sans-serif',
              }}
            >
              Coolmath-Games.com
            </span>
          </div>
        </button>
      </div>

      {/* Nav bar */}
      <div className="border-b border-[#333] bg-black">
        <div className="mx-auto flex max-w-[960px] items-center justify-center gap-0 px-4 py-2">
          <button type="button" onClick={onBack} className="px-4 py-1 text-[14px] font-bold tracking-wide text-[#ffe600] hover:text-white" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
            &larr; BACK TO GAMES
          </button>
          <div className="mx-4 h-4 w-px bg-[#555]" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search games..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) onSearch(val);
                }
              }}
              className="h-[26px] w-[180px] rounded-[3px] border border-[#555] bg-white px-2 text-[12px] text-[#333] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#0a0a0a] px-4 py-1.5">
        <div className="mx-auto max-w-[960px] text-[11px] text-[#666]">
          <button type="button" onClick={onBack} className="text-[#00cccc] hover:underline">Home</button>
          <span className="mx-1 text-[#555]">&rsaquo;</span>
          <span className="capitalize text-[#00cccc]">{game.category}</span>
          <span className="mx-1 text-[#555]">&rsaquo;</span>
          <span className="text-[#aaa]">{game.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-4 py-4">
        <div className="flex gap-4">
          {/* Main game area */}
          <div className="min-w-0 flex-1">
            {/* Game title */}
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-[44px] w-[44px] items-center justify-center rounded-[3px] text-[22px]"
                style={{ backgroundColor: game.color }}
              >
                {game.icon}
              </div>
              <div>
                <h1 className="text-[22px] font-black text-[#00cccc]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                  {game.title}
                </h1>
                <div className="text-[11px] capitalize text-[#666]">{game.category} Game</div>
              </div>
            </div>

            {/* Game embed area */}
            <div
              className="relative overflow-hidden rounded-[3px] border-2 border-[#00cccc] bg-[#111]"
              style={{ aspectRatio: '4 / 3', maxHeight: '600px' }}
            >
              {isFlash ? (
                <FlashRequired title={game.title} />
              ) : (
                <iframe
                  src={game.embedUrl}
                  title={game.title}
                  className="absolute inset-0 h-full w-full border-none"
                  allow="autoplay; fullscreen"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Game info */}
            <div className="mt-4 border-t border-[#333] pt-4">
              <h2 className="mb-2 text-[16px] font-bold text-white">About {game.title}</h2>
              <p className="text-[13px] leading-[1.6] text-[#aaa]">{game.description}</p>
              <div className="mt-3 flex items-center gap-4 border-t border-[#222] pt-3 text-[11px] text-[#666]">
                <span>Category: <span className="capitalize text-[#00cccc]">{game.category}</span></span>
                <span>Added: 2016</span>
                {isFlash && <span className="text-[#cc0000]">Requires Flash Player</span>}
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 border border-[#333] bg-[#0a0a0a] p-4">
              <div className="mb-2 text-[13px] font-bold text-[#ffe600]">Game Controls</div>
              <div className="grid grid-cols-2 gap-2 text-[12px] text-[#aaa]">
                <div>Arrow Keys - Move</div>
                <div>Spacebar - Jump / Action</div>
                <div>Mouse - Click / Select</div>
                <div>P - Pause</div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[240px] shrink-0">
            {/* More Games */}
            <div className="mb-4">
              <h3 className="mb-2 flex items-center gap-2 border-b-[3px] border-b-[#00cccc] pb-2 text-[16px] font-black text-[#00cccc]" style={{ fontFamily: 'Arial Black, Arial, sans-serif' }}>
                <span className="text-[12px]">&#9658;</span> More Games
              </h3>
              <div className="space-y-0">
                {otherGames.map((g) => (
                  <button
                    key={g.slug}
                    type="button"
                    onClick={() => onGameClick(g.slug)}
                    className="group flex w-full items-center gap-3 border-b border-[#222] px-1 py-2.5 text-left hover:bg-[#111]"
                  >
                    <div
                      className="flex h-[40px] w-[50px] shrink-0 items-center justify-center rounded-[2px] text-[18px]"
                      style={{ backgroundColor: g.color }}
                    >
                      {g.icon}
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#00cccc] group-hover:text-[#00ffff] group-hover:underline">
                        {g.title}
                      </div>
                      <div className="mt-0.5 text-[10px] capitalize text-[#666]">{g.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ad placeholder */}
            <div className="mb-2 text-[10px] text-[#666]">Advertisement</div>
            <div className="flex h-[250px] w-full items-center justify-center border border-[#333] bg-[#111]">
              <div className="text-center">
                <div className="text-[32px]">🎮</div>
                <div className="mt-2 text-[12px] text-[#666]">Your Ad Here</div>
              </div>
            </div>
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
