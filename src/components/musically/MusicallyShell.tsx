import type { ReactNode } from 'react';

export function MusicallyFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto h-full w-full max-w-[430px] rounded-[58px] bg-[linear-gradient(180deg,#ffe3dd_0%,#ffc9d8_46%,#ffbc93_100%)] p-[18px] shadow-[0_34px_80px_rgba(100,20,37,0.28)] ring-1 ring-white/35">
      <div className="pointer-events-none absolute left-[-3px] top-[118px] h-10 w-[3px] rounded-l-full bg-[#ef9ca0]" />
      <div className="pointer-events-none absolute left-[-3px] top-[168px] h-16 w-[3px] rounded-l-full bg-[#ef9ca0]" />
      <div className="pointer-events-none absolute left-[-3px] top-[254px] h-16 w-[3px] rounded-l-full bg-[#ef9ca0]" />
      <div className="pointer-events-none absolute right-[-3px] top-[186px] h-20 w-[3px] rounded-r-full bg-[#f0aa88]" />

      <div className="flex h-full flex-col rounded-[44px] bg-[#1d0f17] px-5 pb-4 pt-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="flex shrink-0 items-center justify-center pb-3 pt-1">
          <div className="mr-3 h-2.5 w-2.5 rounded-full bg-white/85" />
          <div className="h-2.5 w-16 rounded-full bg-white/80" />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-[22px] border border-white/10 bg-[#120910]">
          {children}
        </div>

        <div className="flex shrink-0 items-center justify-center pt-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/35 bg-[radial-gradient(circle_at_30%_30%,#ffe8d9_0%,#f4b9ac_55%,#d27a80_100%)] shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
            <div className="h-[14px] w-[14px] rounded-[4px] border-[1.5px] border-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicallyStatusBar() {
  return (
    <div className="flex shrink-0 items-center justify-between bg-[linear-gradient(90deg,#ff6f8c_0%,#ff9966_100%)] px-4 py-[3px] text-[10px] font-semibold text-white/90">
      <div className="flex items-center gap-1">
        <span>AT&T</span>
        <span className="text-[8px]">LTE</span>
      </div>
      <span className="text-[11px] text-white">9:41 AM</span>
      <div className="flex items-center gap-1 text-[9px]">
        <span>100%</span>
        <svg viewBox="0 0 25 12" className="h-[10px] w-[20px]" fill="white">
          <rect x="0" y="1" width="21" height="10" rx="2" stroke="white" strokeWidth="1" fill="none" />
          <rect x="2" y="3" width="17" height="6" rx="0.5" fill="white" />
          <rect x="22" y="4" width="2" height="4" rx="0.5" fill="white" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function MusicallyLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 font-['Trebuchet_MS','Segoe_UI',sans-serif] ${className}`}>
      <img src="/bookmarks/musically-logo.svg" alt="" className="h-6 w-6 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" />
      <span className="text-[22px] font-bold tracking-[-0.04em] text-white">musical.ly</span>
    </div>
  );
}
