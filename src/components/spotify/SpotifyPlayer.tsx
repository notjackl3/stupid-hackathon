import type { SpotifyTrack } from '../../data/spotify';

interface SpotifyPlayerProps {
  currentTrack: SpotifyTrack | null;
  hasQueue: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
}

function PlayerIconButton({
  label,
  children,
  onClick,
  className = '',
}: {
  label: string;
  children: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm text-white/72 transition hover:bg-white/8 hover:text-white ${className}`}
    >
      {children}
    </button>
  );
}

export function SpotifyPlayer({ currentTrack, hasQueue, onPrevious, onNext, onShuffle }: SpotifyPlayerProps) {
  return (
    <footer className="shrink-0 border-t border-white/7 bg-[#181818] px-4 py-3 text-white shadow-[0_-14px_32px_rgba(0,0,0,0.35)]">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)_180px] lg:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-14 w-14 shrink-0 items-end rounded-[2px] p-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
            style={{ background: currentTrack?.cover.gradient ?? 'linear-gradient(135deg,#2f3134 0%,#181818 100%)' }}
          >
            {currentTrack?.cover.label ?? '2016'}
          </div>
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-white">
              {currentTrack?.title ?? 'Select a track'}
            </div>
            <div className="truncate text-[12px] text-white/52">
              {currentTrack?.artist ?? 'The real play button lives inside the Spotify embed.'}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-center gap-2">
            <PlayerIconButton label="Shuffle" onClick={hasQueue ? onShuffle : undefined} className="bg-[#1db954] text-[#08150d] hover:bg-[#27c360] hover:text-[#08150d]">
              ⇄
            </PlayerIconButton>
            <PlayerIconButton label="Previous track" onClick={hasQueue ? onPrevious : undefined}>
              ↺
            </PlayerIconButton>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-[#181818]">
              ▶
            </div>
            <PlayerIconButton label="Next track" onClick={hasQueue ? onNext : undefined}>
              ↻
            </PlayerIconButton>
            <PlayerIconButton label="Repeat">
              ↻
            </PlayerIconButton>
          </div>

          <div className="mb-3 flex items-center gap-3 text-[11px] text-white/35">
            <span>0:12</span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full bg-[#1db954] ${currentTrack ? 'w-[38%]' : 'w-[14%]'}`} />
            </div>
            <span>{currentTrack ? currentTrack.duration : '0:00'}</span>
          </div>

          <div className="relative overflow-hidden rounded-[6px] border border-white/8 bg-[#111111]" style={{ height: currentTrack ? '80px' : undefined }}>
            {currentTrack ? (
              <iframe
                key={currentTrack.trackId}
                title={`Spotify player for ${currentTrack.title}`}
                src={`https://open.spotify.com/embed/track/${currentTrack.trackId}?theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="encrypted-media"
                loading="lazy"
                className="absolute left-0 top-0"
              />
            ) : (
              <div className="flex h-20 items-center justify-center px-4 text-center text-[12px] text-white/48">
                Pick a song above. The embed handles the real playback so no login or API key is needed.
              </div>
            )}
          </div>
        </div>

        <div className="hidden items-center justify-end gap-3 lg:flex">
          <span className="text-[12px] text-white/44">Devices Available</span>
          <span className="text-white/40">◫</span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </footer>
  );
}
