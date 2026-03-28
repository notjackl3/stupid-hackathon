import type { ReactNode } from 'react';
import {
  spotifyFriendActivity,
  spotifySidebarLibrary,
  spotifySidebarPlaylists,
  type SpotifyTrack,
} from '../../data/spotify';
import { SpotifyPlayer } from './SpotifyPlayer';

type SpotifyNavSection = 'home' | 'search' | 'radio' | 'library';

interface SpotifyShellProps {
  children: ReactNode;
  currentTrack: SpotifyTrack | null;
  activeSection: SpotifyNavSection;
  onHome: () => void;
  onSearch: () => void;
  onRadio: () => void;
  onPlaylistOpen: (playlistSlug: string) => void;
}

function SidebarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center rounded-[4px] px-3 py-2 text-left text-[13px] font-semibold transition ${
        active ? 'bg-white/8 text-white' : 'text-white/58 hover:bg-white/5 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export function SpotifyShell({
  children,
  currentTrack,
  activeSection,
  onHome,
  onSearch,
  onRadio,
  onPlaylistOpen,
}: SpotifyShellProps) {
  return (
    <div className="flex h-full flex-col bg-[#121212] text-white">
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="flex h-full min-h-0">
          <aside className="hidden w-[236px] shrink-0 border-r border-white/6 bg-black px-3 py-5 lg:block">
            <div className="px-3 pb-6 text-[28px] font-black tracking-[-0.05em] text-white">Spotify</div>

            <nav className="space-y-1">
              <SidebarButton label="Home" active={activeSection === 'home'} onClick={onHome} />
              <SidebarButton label="Browse" active={activeSection === 'home'} onClick={onHome} />
              <SidebarButton label="Search" active={activeSection === 'search'} onClick={onSearch} />
              <SidebarButton label="Radio" active={activeSection === 'radio'} onClick={onRadio} />
              <SidebarButton label="Your Library" active={activeSection === 'library'} onClick={() => onPlaylistOpen('discover-weekly')} />
            </nav>

            <div className="mt-7 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/28">Your Library</div>
            <div className="mt-2 space-y-1">
              {spotifySidebarLibrary.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPlaylistOpen(item === 'Discover Weekly' ? 'discover-weekly' : 'todays-top-hits')}
                  className="block w-full truncate px-3 py-1 text-left text-[13px] text-white/58 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/28">Playlists</div>
            <div className="mt-2 space-y-1">
              {spotifySidebarPlaylists.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPlaylistOpen(index % 2 === 0 ? 'todays-top-hits' : 'rap-caviar')}
                  className="block w-full truncate px-3 py-1 text-left text-[13px] text-white/58 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onPlaylistOpen('discover-weekly')}
              className="mt-6 w-full rounded-[4px] border border-white/10 bg-white/5 px-3 py-2 text-left text-[13px] font-semibold text-white/78 hover:bg-white/8"
            >
              + New Playlist
            </button>
          </aside>

          <main className="min-w-0 flex-1 overflow-hidden bg-[#181818]">
            {children}
          </main>

          <aside className="hidden w-[254px] shrink-0 border-l border-white/6 bg-[#0d0d0d] px-4 py-5 xl:block">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/36">Friend Activity</div>
            <div className="space-y-3">
              {spotifyFriendActivity.map((friend) => (
                <div key={`${friend.name}-${friend.track}`} className="rounded-[4px] border border-white/6 bg-white/[0.03] px-3 py-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[13px] font-semibold text-white/88">{friend.name}</div>
                    <div className="text-[11px] text-white/32">{friend.time}</div>
                  </div>
                  <div className="mt-1 text-[12px] text-white/62">{friend.track}</div>
                  <div className="text-[11px] text-white/36">{friend.artist}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <SpotifyPlayer currentTrack={currentTrack} />
    </div>
  );
}
