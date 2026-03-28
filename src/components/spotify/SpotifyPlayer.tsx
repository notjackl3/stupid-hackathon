import type { SpotifyTrack } from '../../data/spotify';

interface SpotifyPlayerProps {
  currentTrack: SpotifyTrack | null;
}

export function SpotifyPlayer({ currentTrack }: SpotifyPlayerProps) {
  return (
    <footer className="shrink-0 border-t border-white/7 bg-[#181818] px-4 py-2">
      <div className="overflow-hidden rounded-[8px] border border-white/8 bg-[#111111]">
        {currentTrack ? (
          <iframe
            key={currentTrack.trackId}
            title={`Spotify player for ${currentTrack.title}`}
            src={`https://open.spotify.com/embed/track/${currentTrack.trackId}?theme=0`}
            width="100%"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 items-center justify-center px-4 text-center text-[12px] text-white/48">
            Pick a song to start playing.
          </div>
        )}
      </div>
    </footer>
  );
}
