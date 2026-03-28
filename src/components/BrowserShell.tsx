import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { NavigationActions, NavigationState, BrowserTab, SiteName } from '../types';

function ToolbarGlyph({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] leading-none ${className}`}
    >
      {children}
    </span>
  );
}

function BookmarkFavicon({ site }: { site: SiteName }) {
  switch (site) {
    case 'google':
      return <img src="/bookmarks/google-g.svg" alt="" className="h-4 w-4 object-contain" />;
    case 'youtube':
      return <img src="/bookmarks/youtube-play.svg" alt="" className="h-3.5 w-[18px] object-contain" />;
    case 'twitter':
      return <img src="/bookmarks/twitter-bird.svg" alt="" className="h-3.5 w-4 object-contain" />;
    case 'vine':
      return <img src="/bookmarks/vine-logo.svg" alt="" className="h-3.5 w-4 object-contain" />;
    case 'tumblr':
      return <img src="/bookmarks/tumblr-icon.svg" alt="" className="h-3.5 w-3.5 object-contain" />;
    case 'myinstants':
      return <img src="/bookmarks/myinstants.ico" alt="" className="h-4 w-4 rounded-[3px] object-contain" />;
    case 'musically':
      return <img src="/bookmarks/musically-logo.svg" alt="" className="h-4 w-4 object-contain" />;
    case 'spotify':
      return <img src="/bookmarks/spotify-logo.svg" alt="" className="h-4 w-4 object-contain" />;
    case 'coolmath':
      return <span className="flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#2d6b2d] text-[8px] font-bold text-white">CM</span>;
  }
}

interface TabBarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onAddTab: () => void;
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onCloseAttempt?: () => void;
  isTumblr: boolean;
}

function TabBar({ tabs, activeTabId, onAddTab, onSwitchTab, onCloseTab, onCloseAttempt, isTumblr }: TabBarProps) {
  return (
    <div
      className={`flex h-[33px] items-end pl-2 pr-2 pt-1 ${
        isTumblr
          ? 'border-b border-[#0a1320] bg-[#1a2739] text-white'
          : 'border-b border-[#aab3bf] bg-[#d5dbe4]'
      }`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`group relative mr-[3px] flex h-[27px] min-w-[140px] max-w-[220px] cursor-pointer select-none items-center rounded-t-[5px] border border-b-0 px-3 ${
              isTumblr
                ? isActive
                  ? 'z-10 border-[#0a1320] bg-[#102038] text-white'
                  : 'border-transparent bg-[#27374c] text-white/60 hover:bg-[#31455f]'
                : isActive
                  ? 'z-10 border-[#aab3bf] bg-[#fdfefe] text-[#2a2f36]'
                  : 'border-transparent bg-[#c7ced8] text-[#55606d] hover:bg-[#d0d6de]'
            }`}
          >
            <span className="mr-2 flex h-4 w-4 shrink-0 items-center justify-center">
              <BookmarkFavicon site={tab.savedState.site} />
            </span>
            <span className="flex-1 truncate text-[12px]">{tab.label}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`ml-2 shrink-0 rounded-full px-1 text-[11px] leading-none ${
                  isTumblr
                    ? 'text-white/45 hover:bg-white/10 hover:text-white'
                    : 'text-[#7d8794] hover:bg-[#b7c0cb] hover:text-[#3a4450]'
                }`}
              >
                &#10005;
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onAddTab}
        className={`mb-[1px] flex h-[24px] w-[24px] items-center justify-center rounded-[3px] text-[16px] leading-none ${
          isTumblr ? 'text-white/65 hover:bg-white/10' : 'text-[#53606f] hover:bg-[#c1c9d4]'
        }`}
        title="New tab"
      >
        +
      </button>
      <div className="flex-1" />
      <div className={`mb-[5px] flex items-center gap-1 pl-2 text-[11px] ${isTumblr ? 'text-white/45' : 'text-[#748193]'}`}>
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded ${isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#c1c9d4]'}`}>&#8211;</span>
        <span className={`inline-flex h-5 w-5 items-center justify-center rounded ${isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#c1c9d4]'}`}>&#9723;</span>
        <span
          onClick={onCloseAttempt}
          className={`inline-flex h-5 w-5 items-center justify-center rounded hover:text-white ${
            isTumblr ? 'hover:bg-[#a54856]' : 'hover:bg-[#d97d7d]'
          } ${onCloseAttempt ? 'cursor-pointer' : ''}`}
        >
          &#10005;
        </span>
      </div>
    </div>
  );
}

interface AddressBarProps {
  displayUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onNavigate: (url: string) => void;
  isTumblr: boolean;
}

function AddressBar({
  displayUrl,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onNavigate,
  isTumblr,
}: AddressBarProps) {
  const [inputValue, setInputValue] = useState(displayUrl);
  const [isFocused, setIsFocused] = useState(false);

  const shownValue = isFocused ? inputValue : displayUrl;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(inputValue);
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div
      className={`flex items-center gap-1 border-b px-2 py-[5px] ${
        isTumblr ? 'border-[#0b1727] bg-[#18263a]' : 'border-[#bcc5d1] bg-[#eceff3]'
      }`}
    >
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className={
          canGoBack
            ? isTumblr
              ? 'cursor-pointer text-white/72'
              : 'cursor-pointer text-[#596573]'
            : isTumblr
              ? 'cursor-default text-white/22'
              : 'cursor-default text-[#afb7c2]'
        }
        title="Back"
      >
        <ToolbarGlyph className={canGoBack ? (isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]') : ''}>
          &#9664;
        </ToolbarGlyph>
      </button>
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className={
          canGoForward
            ? isTumblr
              ? 'cursor-pointer text-white/72'
              : 'cursor-pointer text-[#596573]'
            : isTumblr
              ? 'cursor-default text-white/22'
              : 'cursor-default text-[#afb7c2]'
        }
        title="Forward"
      >
        <ToolbarGlyph className={canGoForward ? (isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]') : ''}>
          &#9654;
        </ToolbarGlyph>
      </button>
      <button className={`cursor-pointer ${isTumblr ? 'text-white/72' : 'text-[#596573]'}`} title="Reload">
        <ToolbarGlyph className={isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]'}>
          &#8635;
        </ToolbarGlyph>
      </button>
      <button className={`cursor-pointer ${isTumblr ? 'text-white/58' : 'text-[#768293]'}`} title="Home">
        <ToolbarGlyph className={isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]'}>
          &#8962;
        </ToolbarGlyph>
      </button>

      <div
        className={`mx-1 flex h-[28px] flex-1 items-center rounded-[3px] border px-[10px] ${
          isTumblr
            ? 'border-[#233853] bg-[#0f1f32] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
            : 'border-[#b7c1ce] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]'
        }`}
      >
        <span className={`mr-2 text-[11px] ${isTumblr ? 'text-[#7ec8ff]' : 'text-[#54a84d]'}`}>&#128274;</span>
        <span className={`mr-3 hidden text-[11px] sm:inline ${isTumblr ? 'text-white/42' : 'text-[#6f7b88]'}`}>
          Secure
        </span>
        <input
          type="text"
          value={shownValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setInputValue(displayUrl);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent text-[12px] outline-none ${
            isTumblr ? 'text-white/82 placeholder:text-white/28' : 'text-[#26313c] placeholder:text-[#8d97a3]'
          }`}
          spellCheck={false}
        />
        <span className={`ml-2 text-[13px] ${isTumblr ? 'text-white/28' : 'text-[#a1aab5]'}`} title="Bookmark">
          &#9734;
        </span>
      </div>

      <div className="flex items-center gap-[2px]">
        <button className={`cursor-pointer ${isTumblr ? 'text-white/58' : 'text-[#6f7c8d]'}`} title="Downloads">
          <ToolbarGlyph className={isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]'}>
            &#8681;
          </ToolbarGlyph>
        </button>
        <button className={`cursor-pointer ${isTumblr ? 'text-white/58' : 'text-[#6f7c8d]'}`} title="Menu">
          <ToolbarGlyph className={isTumblr ? 'hover:bg-white/10' : 'hover:bg-[#d8dde5]'}>
            &#8942;
          </ToolbarGlyph>
        </button>
        <div
          className={`ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold text-white ${
            isTumblr ? 'border-[#2d5276] bg-[#27486a]' : 'border-[#8fb0d8] bg-[#5d8fdc]'
          }`}
        >
          U
        </div>
      </div>
    </div>
  );
}

interface BookmarksBarProps {
  activeSite: SiteName;
  onNavigate: (site: SiteName) => void;
  onClashRoyale?: () => void;
  isTumblr: boolean;
}

function BookmarksBar({ activeSite, onNavigate, onClashRoyale, isTumblr }: BookmarksBarProps) {
  const bookmarks: { label: string; site: SiteName | 'clashroyale' }[] = [
    { label: 'Apps', site: 'google' },
    { label: 'Google', site: 'google' },
    { label: 'YouTube', site: 'youtube' },
    { label: 'Twitter', site: 'twitter' },
    { label: 'Vine', site: 'vine' },
    { label: 'Spotify', site: 'spotify' },
    { label: 'musical.ly', site: 'musically' },
    { label: 'Tumblr', site: 'tumblr' },
    { label: 'MyInstants', site: 'myinstants' },
    { label: 'Cool Math', site: 'coolmath' },
    { label: 'Clash Royale', site: 'clashroyale' },
  ];

  return (
    <div
      className={`flex min-h-[32px] items-center gap-[3px] border-b px-4 py-[3px] text-[12px] ${
        isTumblr
          ? 'border-[#0b1727] bg-[#122136] text-white/62'
          : 'border-[#d7dde6] bg-[#f7f8fa] text-[#4f5b67]'
      }`}
    >
      {bookmarks.map((b) => (
        <button
          key={`${b.label}-${b.site}`}
          onClick={() => {
            if (b.site === 'clashroyale') {
              onClashRoyale?.();
            } else {
              onNavigate(b.site as SiteName);
            }
          }}
          className={`flex h-7 shrink-0 items-center gap-2 rounded-[2px] px-3.5 cursor-pointer ${
            isTumblr
              ? activeSite === b.site && b.label !== 'Apps'
                ? 'bg-[#22354d] text-white'
                : 'hover:bg-white/6'
              : activeSite === b.site && b.label !== 'Apps'
                ? 'bg-[#e7edf7] text-[#224d85]'
                : 'hover:bg-[#ebeff4]'
          }`}
        >
          {b.label === 'Apps' ? (
            <span className={`text-[12px] ${isTumblr ? 'text-white/38' : 'text-[#67727d]'}`}>&#9638;</span>
          ) : b.site === 'clashroyale' ? (
            <span className="text-[13px]">⚔️</span>
          ) : (
            <BookmarkFavicon site={b.site as SiteName} />
          )}
          <span className="leading-none tracking-[0.01em]">{b.label}</span>
        </button>
      ))}
      <span className={`mx-2 text-[13px] ${isTumblr ? 'text-white/14' : 'text-[#c0c8d2]'}`}>|</span>
      <span className={`shrink-0 px-2 text-[11px] tracking-[0.01em] ${isTumblr ? 'text-white/30' : 'text-[#8d97a3]'}`}>
        {isTumblr ? 'bookmarks bar' : 'Imported From IE'}
      </span>
    </div>
  );
}

interface BrowserShellProps {
  navState: NavigationState;
  actions: NavigationActions;
  children: ReactNode;
  tabs: BrowserTab[];
  activeTabId: string;
  onClashRoyale?: () => void;
  onAddTab: () => void;
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onCloseAttempt?: () => void;
}

export function BrowserShell({
  navState,
  actions,
  children,
  tabs,
  activeTabId,
  onClashRoyale,
  onAddTab,
  onSwitchTab,
  onCloseTab,
  onCloseAttempt,
}: BrowserShellProps) {
  const isTumblr = navState.site === 'tumblr';
  return (
    <div className={`flex h-full w-full flex-col text-[#25303b] ${isTumblr ? 'bg-[#142238]' : 'bg-[#dfe4ea]'}`}>
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onAddTab={onAddTab}
        onSwitchTab={onSwitchTab}
        onCloseTab={onCloseTab}
        onCloseAttempt={onCloseAttempt}
        isTumblr={isTumblr}
      />
      <AddressBar
        displayUrl={actions.displayUrl}
        canGoBack={actions.canGoBack}
        canGoForward={actions.canGoForward}
        onGoBack={actions.goBack}
        onGoForward={actions.goForward}
        onNavigate={actions.navigateFromUrl}
        isTumblr={isTumblr}
      />
      <BookmarksBar activeSite={navState.site} onNavigate={(site) => actions.navigate(site)} onClashRoyale={onClashRoyale} isTumblr={isTumblr} />
      <div
        id="browser-content-scroll"
        data-browser-scroll-container
        className={`flex-1 overflow-auto border-t ${
          isTumblr ? 'border-[#23364f] bg-[#0d2138]' : 'border-[#eef2f6] bg-white'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
