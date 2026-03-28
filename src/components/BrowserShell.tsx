import { useState, type KeyboardEvent, type ReactNode } from 'react';
import type { NavigationActions, NavigationState, BrowserTab } from '../types';

interface TabBarProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onAddTab: () => void;
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

function TabBar({ tabs, activeTabId, onAddTab, onSwitchTab, onCloseTab }: TabBarProps) {
  return (
    <div className="flex items-end bg-[#dee1e6] pt-1 pl-8 h-[38px]">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSwitchTab(tab.id)}
            className={`flex items-center rounded-t-lg px-3 py-1.5 max-w-[220px] min-w-[120px] h-[30px] cursor-pointer select-none border border-b-0 mr-0.5 ${
              isActive
                ? 'bg-white border-[#ccc] shadow-sm'
                : 'bg-[#ccd0d5] border-transparent hover:bg-[#d5d8dc]'
            }`}
          >
            <span className="text-xs text-gray-700 truncate flex-1">{tab.label}</span>
            {tabs.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
                className="ml-1.5 text-gray-400 hover:text-gray-600 text-xs leading-none shrink-0"
              >
                &#10005;
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onAddTab}
        className="flex items-center px-3 py-1.5 h-[30px] text-gray-500 hover:bg-gray-200 rounded-t cursor-pointer text-sm"
        title="New tab"
      >
        +
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-1 pr-2 pb-1">
        <span className="text-gray-400 text-xs">&#9866;</span>
        <span className="text-gray-400 text-xs">&#9723;</span>
        <span className="text-gray-400 text-xs hover:text-red-500">&#10005;</span>
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
}

function AddressBar({ displayUrl, canGoBack, canGoForward, onGoBack, onGoForward, onNavigate }: AddressBarProps) {
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
    <div className="flex items-center bg-white px-2 py-1 gap-2 border-b border-[#ccc]">
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className={`text-lg px-1 ${canGoBack ? 'text-gray-600 hover:text-gray-900 cursor-pointer' : 'text-gray-300 cursor-default'}`}
        title="Back"
      >
        &#8592;
      </button>
      <button
        onClick={onGoForward}
        disabled={!canGoForward}
        className={`text-lg px-1 ${canGoForward ? 'text-gray-600 hover:text-gray-900 cursor-pointer' : 'text-gray-300 cursor-default'}`}
        title="Forward"
      >
        &#8594;
      </button>
      <button className="text-gray-500 hover:text-gray-700 text-lg px-1 cursor-pointer" title="Reload">&#8635;</button>

      <div className="flex-1 flex items-center bg-[#f1f3f4] rounded-full px-3 py-1 border border-[#ddd]">
        <span className="text-green-600 mr-1.5 text-xs">&#128274;</span>
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
          className="flex-1 bg-transparent outline-none text-sm text-gray-800"
          spellCheck={false}
        />
        <span className="text-gray-400 ml-1 text-sm cursor-pointer" title="Bookmark">&#9734;</span>
      </div>

      <div className="flex items-center gap-1">
        <button className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer" title="Extensions">&#9881;</button>
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          U
        </div>
      </div>
    </div>
  );
}

interface BookmarksBarProps {
  onNavigate: (site: 'google' | 'youtube' | 'twitter') => void;
}

function BookmarksBar({ onNavigate }: BookmarksBarProps) {
  const bookmarks = [
    { label: 'Google', site: 'google' as const, icon: '🔍' },
    { label: 'YouTube', site: 'youtube' as const, icon: '▶️' },
    { label: 'Twitter', site: 'twitter' as const, icon: '🐦' },
  ];

  return (
    <div className="flex items-center bg-white px-3 py-0.5 border-b border-[#e0e0e0] gap-1 text-xs">
      {bookmarks.map((b) => (
        <button
          key={b.site}
          onClick={() => onNavigate(b.site)}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gray-100 text-gray-600 cursor-pointer"
        >
          <span>{b.icon}</span>
          <span>{b.label}</span>
        </button>
      ))}
      <span className="mx-1 text-gray-300">|</span>
      <span className="text-gray-400 px-1">Other bookmarks</span>
    </div>
  );
}

interface BrowserShellProps {
  navState: NavigationState;
  actions: NavigationActions;
  children: ReactNode;
  tabs: BrowserTab[];
  activeTabId: string;
  onAddTab: () => void;
  onSwitchTab: (id: string) => void;
  onCloseTab: (id: string) => void;
}

export function BrowserShell({ actions, children, tabs, activeTabId, onAddTab, onSwitchTab, onCloseTab }: BrowserShellProps) {
  return (
    <div className="flex flex-col h-full w-full bg-white">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onAddTab={onAddTab}
        onSwitchTab={onSwitchTab}
        onCloseTab={onCloseTab}
      />
      <AddressBar
        displayUrl={actions.displayUrl}
        canGoBack={actions.canGoBack}
        canGoForward={actions.canGoForward}
        onGoBack={actions.goBack}
        onGoForward={actions.goForward}
        onNavigate={actions.navigateFromUrl}
      />
      <BookmarksBar onNavigate={(site) => actions.navigate(site)} />
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>
    </div>
  );
}
