import { useEffect, useState, type KeyboardEvent } from 'react';
import {
  getSpotifyAlbum,
  getSpotifySearchResult,
  type SpotifyAlbum,
  type SpotifyTrack,
} from '../../data/spotify';

interface SpotifySearchProps {
  query: string;
  onSearch: (query: string) => void;
  onOpenAlbum: (albumSlug: string) => void;
  onPlayTrack: (track: SpotifyTrack, queue: SpotifyTrack[]) => void;
}

function albumButtonLabel(album: SpotifyAlbum) {
  return `${album.title} by ${album.artist}`;
}

export function SpotifySearch({ query, onSearch, onOpenAlbum, onPlayTrack }: SpotifySearchProps) {
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const result = getSpotifySearchResult(query);

  const submit = () => {
    onSearch(searchInput.trim());
  };

  return (
    <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,#212121_0%,#181818_32%,#181818_100%)] px-5 py-6 md:px-8">
      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/32">Search</div>
          <h1 className="mt-2 text-[32px] font-black tracking-[-0.04em] text-white">
            {query ? `Results for "${query}"` : 'Search Spotify'}
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-white/54">
            2016 only. Some future celebrities have not rendered yet.
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
            placeholder="Search artists, albums, songs"
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

      {result.aside ? (
        <div className="mb-6 rounded-[8px] border border-white/8 bg-white/[0.04] px-4 py-3 text-[13px] leading-6 text-white/68">
          {result.aside}
        </div>
      ) : null}

      {result.message && !result.songs.length && !result.artists.length && !result.albums.length ? (
        <div className="rounded-[10px] border border-dashed border-white/12 bg-[#161616] px-6 py-12 text-center">
          <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/26">No Results</div>
          <div className="mt-4 text-[30px] font-black tracking-[-0.04em] text-white">{result.message}</div>
          <p className="mt-3 text-[14px] text-white/48">The database is not prepared for your time traveler nonsense.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-white">Songs</div>
            <div className="overflow-hidden rounded-[8px] border border-white/6 bg-[#121212]">
              {result.songs.length ? (
                result.songs.map((track, index) => {
                  const hasAlbumPage = Boolean(getSpotifyAlbum(track.albumSlug));

                  return (
                  <div
                    key={track.slug}
                    className="grid w-full grid-cols-[32px_minmax(0,1fr)_minmax(0,180px)_70px] items-center gap-3 border-b border-white/6 px-4 py-3 text-left last:border-b-0 hover:bg-white/[0.04]"
                  >
                    <button
                      type="button"
                      onClick={() => onPlayTrack(track, result.songs)}
                      className="text-left text-[12px] text-white/34 hover:text-white"
                    >
                      {index + 1}
                    </button>
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-semibold text-white">{track.title}</div>
                      <div className="truncate text-[12px] text-white/42">{track.artist}</div>
                    </div>
                    {hasAlbumPage ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenAlbum(track.albumSlug);
                        }}
                        className="truncate text-left text-[12px] text-white/44 hover:text-white"
                      >
                        {track.album}
                      </button>
                    ) : (
                      <div className="truncate text-[12px] text-white/26">{track.album}</div>
                    )}
                    <div className="text-right text-[12px] text-white/34">{track.duration}</div>
                  </div>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-[13px] text-white/42">Nothing playable surfaced for this one.</div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-white">Artists</div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {result.artists.length ? (
                result.artists.map((artist) => (
                  <button
                    key={artist.slug}
                    type="button"
                    onClick={() => onSearch(artist.name)}
                    className="rounded-[8px] bg-[#202020] p-4 text-left transition hover:bg-[#252525]"
                  >
                    <div
                      className="flex h-32 items-end rounded-[6px] p-3 text-[11px] font-black uppercase tracking-[0.18em] text-white"
                      style={{ background: artist.cover.gradient }}
                    >
                      {artist.cover.label}
                    </div>
                    <div className="mt-3 text-[16px] font-semibold text-white">{artist.name}</div>
                    <div className="mt-1 text-[12px] text-white/46">{artist.monthlyListeners}</div>
                    <div className="mt-2 text-[12px] leading-5 text-white/58">{artist.blurb}</div>
                  </button>
                ))
              ) : (
                <div className="rounded-[8px] border border-white/6 bg-[#121212] px-4 py-6 text-[13px] text-white/42">
                  No artist cards worth showing here.
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 text-[22px] font-bold tracking-[-0.02em] text-white">Albums</div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {result.albums.length ? (
                result.albums.map((album) => (
                  <button
                    key={album.slug}
                    type="button"
                    onClick={() => onOpenAlbum(album.slug)}
                    aria-label={albumButtonLabel(album)}
                    className="rounded-[8px] bg-[#202020] p-3 text-left transition hover:bg-[#252525]"
                  >
                    <div
                      className="flex aspect-square items-end rounded-[6px] p-3 text-[11px] font-black uppercase tracking-[0.18em] text-white"
                      style={{ background: album.cover.gradient }}
                    >
                      {album.cover.label}
                    </div>
                    <div className="mt-3 text-[15px] font-semibold text-white">{album.title}</div>
                    <div className="mt-1 text-[12px] text-white/46">{album.artist}</div>
                  </button>
                ))
              ) : (
                <div className="rounded-[8px] border border-white/6 bg-[#121212] px-4 py-6 text-[13px] text-white/42">
                  No albums for this search.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
