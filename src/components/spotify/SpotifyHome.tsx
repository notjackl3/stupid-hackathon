import { useState, type KeyboardEvent } from 'react';
import {
  getSpotifyTracks,
  spotifyCategories,
  spotifyFeaturedPlaylists,
  spotifyNewAlbums,
  spotifyPlaylistMap,
  type SpotifyTrack,
} from '../../data/spotify';

interface SpotifyHomeProps {
  onSearch: (query: string) => void;
  onOpenPlaylist: (playlistSlug: string) => void;
  onOpenAlbum: (albumSlug: string) => void;
  onPlayTrack: (track: SpotifyTrack, queue: SpotifyTrack[]) => void;
}

export function SpotifyHome({ onSearch, onOpenPlaylist, onOpenAlbum, onPlayTrack }: SpotifyHomeProps) {
  const [searchInput, setSearchInput] = useState('');

  const submit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,#222222_0%,#181818_38%,#181818_100%)] px-5 py-6 md:px-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/32">Browse</div>
          <h1 className="mt-2 text-[34px] font-black tracking-[-0.04em] text-white">Spotify, before it became a podcast mall</h1>
          <p className="mt-2 max-w-[680px] text-[14px] leading-6 text-white/58">
            Dark UI, loud playlists, tiny streaming records, and a suspiciously confident green shuffle button.
          </p>
        </div>

        <div className="flex w-full max-w-[360px] items-center gap-2 rounded-full border border-white/8 bg-black/35 px-4 py-3">
          <span className="text-white/44">⌕</span>
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                submit();
              }
            }}
            placeholder="Search Drake, TikTok, Spotify Wrapped..."
            className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={submit}
            className="rounded-full bg-[#1db954] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#07140c]"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mb-7 rounded-[10px] border border-[#2c7d46] bg-[linear-gradient(90deg,rgba(29,185,84,0.24),rgba(17,17,17,0.65))] px-5 py-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a6efc2]">Get Premium</div>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[14px] text-white/82">No ads. No interruptions. No pretending the 30-second preview is enough.</p>
          <button
            type="button"
            onClick={() => onOpenPlaylist('todays-top-hits')}
            className="rounded-full border border-white/14 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#121212]"
          >
            Learn More
          </button>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-white">Browse</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {spotifyCategories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => {
                if (category.slug === 'podcasts') {
                  onOpenPlaylist('podcast-wasteland');
                  return;
                }
                if (category.slug === 'top-charts') {
                  onOpenPlaylist('todays-top-hits');
                  return;
                }
                if (category.slug === 'discover') {
                  onOpenPlaylist('discover-weekly');
                  return;
                }
                onOpenPlaylist('rap-caviar');
              }}
              className="group relative min-h-[138px] overflow-hidden rounded-[6px] p-5 text-left"
              style={{ backgroundColor: category.color }}
            >
              <div className="absolute right-[-20px] top-[-20px] h-28 w-28 rotate-12 rounded-[24px] bg-black/12" />
              <div className="relative">
                <div className="text-[24px] font-black tracking-[-0.03em] text-white">{category.title}</div>
                <p className="mt-10 max-w-[220px] text-[13px] leading-5 text-white/84">{category.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="text-[22px] font-bold tracking-[-0.02em] text-white">Popular Playlists</div>
            <div className="text-[13px] text-white/38">Yes, Rap Caviar and Today&apos;s Top Hits were already running your life.</div>
          </div>
          <button
            type="button"
            onClick={() => {
              const playlist = spotifyPlaylistMap['discover-weekly'];
              const queue = getSpotifyTracks(playlist.trackSlugs);
              if (queue[0]) {
                onPlayTrack(queue[0], queue);
              }
              onOpenPlaylist('discover-weekly');
            }}
            className="rounded-full bg-[#1db954] px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#07140c]"
          >
            Discover Weekly
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {spotifyFeaturedPlaylists.map((playlist) => (
            <button
              key={playlist.slug}
              type="button"
              onClick={() => onOpenPlaylist(playlist.slug)}
              className="group rounded-[6px] bg-[#202020] p-3 text-left transition hover:bg-[#252525]"
            >
              <div
                className="flex aspect-square items-end rounded-[4px] p-3 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_28px_rgba(0,0,0,0.3)]"
                style={{ background: playlist.cover.gradient }}
              >
                {playlist.cover.label}
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <div className="text-[15px] font-semibold text-white">{playlist.title}</div>
                  <div className="mt-1 text-[12px] leading-5 text-white/48">{playlist.subtitle}</div>
                </div>
                {playlist.badge ? (
                  <span className="rounded-full bg-[#1db954]/18 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#98efba]">
                    {playlist.badge}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10 rounded-[10px] border border-white/6 bg-[linear-gradient(135deg,#141414_0%,#1e1e1e_100%)] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1db954]">Discover Weekly</div>
            <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-white">Closer, but make it personalized</h2>
            <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-white/54">
              This was new, weirdly accurate, and apparently built by feeding The Chainsmokers directly into the algorithm.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const playlist = spotifyPlaylistMap['discover-weekly'];
              const queue = getSpotifyTracks(playlist.trackSlugs);
              if (queue[0]) {
                onPlayTrack(queue[0], queue);
              }
              onOpenPlaylist('discover-weekly');
            }}
            className="rounded-full bg-[#1db954] px-8 py-3 text-[12px] font-black uppercase tracking-[0.24em] text-[#07140c]"
          >
            Shuffle Play Everything
          </button>
        </div>
      </section>

      <section>
        <div className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-white">New Albums</div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {spotifyNewAlbums.map((album) => (
            <button
              key={album.slug}
              type="button"
              onClick={() => onOpenAlbum(album.slug)}
              className="rounded-[6px] bg-[#202020] p-3 text-left transition hover:bg-[#252525]"
            >
              <div
                className="flex aspect-square items-end rounded-[4px] p-3 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_28px_rgba(0,0,0,0.3)]"
                style={{ background: album.cover.gradient }}
              >
                {album.cover.label}
              </div>
              <div className="mt-3 text-[15px] font-semibold text-white">{album.title}</div>
              <div className="mt-1 text-[12px] text-white/48">{album.artist}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
