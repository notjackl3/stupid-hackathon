import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import {
  getSpotifyAlbum,
  getSpotifyCollectionTracks,
  getSpotifyPlaylist,
  type SpotifyTrack,
} from '../../data/spotify';

interface SpotifyPlaylistProps {
  resourceType: 'playlist' | 'album';
  resourceId: string;
  onSearch: (query: string) => void;
  onPlayTrack: (track: SpotifyTrack, queue: SpotifyTrack[]) => void;
}

export function SpotifyPlaylist({ resourceType, resourceId, onSearch, onPlayTrack }: SpotifyPlaylistProps) {
  const [searchInput, setSearchInput] = useState('');
  const [pabloBanner, setPabloBanner] = useState(
    resourceId === 'the-life-of-pablo' ? 'This album is only available on Tidal.' : ''
  );

  const resource = resourceType === 'playlist' ? getSpotifyPlaylist(resourceId) : getSpotifyAlbum(resourceId);
  const tracks = useMemo(() => getSpotifyCollectionTracks(resourceType, resourceId), [resourceId, resourceType]);

  useEffect(() => {
    if (resourceId !== 'the-life-of-pablo') {
      return;
    }

    const timer = window.setTimeout(() => {
      setPabloBanner("Just kidding, it's here now. But we're still mad about it.");
    }, 1400);

    return () => window.clearTimeout(timer);
  }, [resourceId]);

  if (!resource) {
    return (
      <div className="flex h-full items-center justify-center bg-[#181818] px-6 text-center text-white/46">
        Spotify misplaced this page somewhere between desktop and web player.
      </div>
    );
  }

  const submit = () => {
    const trimmed = searchInput.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const isPodcasts = resourceType === 'playlist' && resourceId === 'podcast-wasteland';

  return (
    <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,#262626_0%,#181818_36%,#181818_100%)] px-5 py-6 md:px-8">
      <div className="mb-6 flex w-full max-w-[360px] items-center gap-2 rounded-full border border-white/8 bg-black/35 px-4 py-3">
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
          placeholder="Search inside Spotify"
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

      {resourceId === 'the-life-of-pablo' ? (
        <div className="mb-5 rounded-[8px] border border-[#785626] bg-[linear-gradient(90deg,rgba(243,162,61,0.26),rgba(17,17,17,0.6))] px-4 py-3 text-[13px] text-white/84">
          {pabloBanner}
        </div>
      ) : null}

      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end">
        <div
          className="relative flex h-[220px] w-[220px] shrink-0 items-end overflow-hidden rounded-[6px] p-4 text-[18px] font-black uppercase tracking-[0.18em] text-white shadow-[0_28px_44px_rgba(0,0,0,0.35)]"
          style={{ background: resource.cover.gradient }}
        >
          {resource.cover.imageUrl ? (
            <img src={resource.cover.imageUrl} alt={resource.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : resource.cover.label}
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">{resourceType}</div>
          <h1 className="mt-3 text-[42px] font-black tracking-[-0.05em] text-white">{resource.title}</h1>
          <p className="mt-3 max-w-[720px] text-[14px] leading-6 text-white/58">
            {resource.subtitle} {('description' in resource ? resource.description : '')}
          </p>
          <div className="mt-4 text-[12px] text-white/38">
            {'owner' in resource ? `${resource.owner} • ${resource.followers} followers` : `${resource.artist} • ${resource.year}`}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (tracks[0]) {
                  onPlayTrack(tracks[0], tracks);
                }
              }}
              className="rounded-full bg-[#1db954] px-7 py-3 text-[12px] font-black uppercase tracking-[0.2em] text-[#07140c]"
            >
              Shuffle Play
            </button>
            <button
              type="button"
              onClick={() => {
                if (tracks[0]) {
                  onPlayTrack(tracks[0], tracks);
                }
              }}
              className="rounded-full border border-white/12 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-white/82"
            >
              Play
            </button>
          </div>
        </div>
      </section>

      {isPodcasts ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: 'Serial', text: 'The one podcast people had actually heard of.' },
            { title: 'Song Exploder', text: 'Still niche, still cool, still not shoved at everyone.' },
            { title: 'A random tech show', text: 'Three episodes, questionable artwork, almost no followers.' },
          ].map((podcast) => (
            <div key={podcast.title} className="rounded-[8px] bg-[#202020] p-4">
              <div className="mb-4 h-32 rounded-[6px] bg-[linear-gradient(135deg,#234a90_0%,#1a1a2d_100%)]" />
              <div className="text-[16px] font-semibold text-white">{podcast.title}</div>
              <div className="mt-2 text-[13px] leading-6 text-white/54">{podcast.text}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[8px] border border-white/6 bg-[#121212]">
          <div className="grid grid-cols-[42px_minmax(0,1.2fr)_minmax(0,1fr)_100px] gap-3 border-b border-white/6 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/26">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="text-right">Time</div>
          </div>
          {tracks.map((track, index) => (
            <button
              key={`${track.slug}-${index}`}
              type="button"
              onClick={() => onPlayTrack(track, tracks)}
              className="grid w-full grid-cols-[42px_minmax(0,1.2fr)_minmax(0,1fr)_100px] items-center gap-3 border-b border-white/6 px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.04]"
            >
              <div className="text-[12px] text-white/34">{index + 1}</div>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-semibold text-white">{track.title}</div>
                <div className="truncate text-[12px] text-white/42">{track.artist}</div>
              </div>
              <div className="truncate text-[12px] text-white/44">{track.album}</div>
              <div className="text-right text-[12px] text-white/34">{track.duration}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
