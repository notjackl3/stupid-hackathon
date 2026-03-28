import type { ReactNode } from 'react';

export function MusicallyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-full w-full max-w-[430px] rounded-[54px] bg-[linear-gradient(180deg,#fff7f6_0%,#ffe9df_52%,#ffd3cf_100%)] p-[16px] shadow-[0_34px_70px_rgba(135,74,90,0.18)] ring-1 ring-white/80">
      <div className="pointer-events-none absolute left-[-2px] top-[114px] h-10 w-[2px] rounded-l-full bg-[#e0b5bf]" />
      <div className="pointer-events-none absolute left-[-2px] top-[164px] h-14 w-[2px] rounded-l-full bg-[#e0b5bf]" />
      <div className="pointer-events-none absolute left-[-2px] top-[244px] h-16 w-[2px] rounded-l-full bg-[#e0b5bf]" />
      <div className="pointer-events-none absolute right-[-2px] top-[180px] h-20 w-[2px] rounded-r-full bg-[#d9b19b]" />

      <div className="flex h-full flex-col rounded-[42px] bg-[#fbfbfb] px-4 pb-3 pt-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.9),0_10px_30px_rgba(164,110,113,0.09)]">
        <div className="flex shrink-0 items-center justify-center pb-3 pt-1">
          <div className="mr-3 h-2.5 w-2.5 rounded-full bg-[#a6a6ab]" />
          <div className="h-2.5 w-16 rounded-full bg-[#b9bbc1]" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#ece5e7] bg-white">
          {children}
        </div>

        <div className="flex shrink-0 items-center justify-center pt-4">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#e9d9de] bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,#f7eff1_62%,#e8d8dd_100%)] shadow-[0_3px_10px_rgba(143,104,112,0.16)]">
            <div className="h-[15px] w-[15px] rounded-[4px] border-[1.5px] border-[#c8b1b8]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicallyStatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[#f0d7db] bg-white px-4 py-[4px] text-[10px] font-semibold text-[#56545d]">
      <div className="flex items-center gap-1">
        <span>AT&amp;T</span>
        <span className="text-[8px] tracking-[0.08em]">LTE</span>
      </div>
      <span className="text-[11px] text-[#3e3d44]">9:41 AM</span>
      <div className="flex items-center gap-1 text-[9px] text-[#56545d]">
        <span>100%</span>
        <svg viewBox="0 0 25 12" className="h-[10px] w-[20px]" fill="none">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="#56545d" strokeWidth="1" />
          <rect x="2" y="3" width="17" height="6" rx="0.5" fill="#56545d" />
          <rect x="22" y="4" width="2" height="4" rx="0.5" fill="#56545d" opacity="0.45" />
        </svg>
      </div>
    </div>
  );
}

export function MusicallyLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-['Trebuchet_MS','Avenir_Next','Segoe_UI',sans-serif] ${className}`}>
      <img src="/bookmarks/musically-logo.svg" alt="" className="h-6 w-6 rounded-full" />
      <span className="text-[22px] font-bold tracking-[-0.04em] text-[#2f2d34]">musical.ly</span>
    </div>
  );
}

export function MusicallyTabBar({
  active,
  onHome,
  onDiscover,
}: {
  active: 'home' | 'discover';
  onHome?: () => void;
  onDiscover?: () => void;
}) {
  const items = [
    { key: 'home' as const, label: 'Home', glyph: '⌂', onClick: onHome },
    { key: 'discover' as const, label: 'Discover', glyph: '⌕', onClick: onDiscover },
    { key: 'activity' as const, label: 'Activity', glyph: '♥' },
    { key: 'profile' as const, label: 'Profile', glyph: '◉' },
  ];

  return (
    <div className="shrink-0 border-t border-[#efdfe3] bg-white px-2 py-1">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-[14px] px-2 py-2 text-[10px] ${
                isActive ? 'text-[#f25b79]' : 'text-[#a29aa3]'
              }`}
            >
              <span className="text-[18px] leading-none">{item.glyph}</span>
              <span className="font-semibold tracking-[0.02em]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
