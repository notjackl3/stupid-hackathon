import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigation } from './hooks/useNavigation';
import { BrowserShell } from './components/BrowserShell';
import { GoogleHome } from './components/google/GoogleHome';
import { GoogleResults } from './components/google/GoogleResults';
import { YouTubeHome } from './components/youtube/YouTubeHome';
import { YouTubeResults } from './components/youtube/YouTubeResults';
import { YouTubeVideo } from './components/youtube/YouTubeVideo';
import { TwitterFeed } from './components/twitter/TwitterFeed';
import { VineHome } from './components/vine/VineHome';
import { VineExplore } from './components/vine/VineExplore';
import { TumblrDashboard } from './components/tumblr/TumblrDashboard';
import { TumblrSearch } from './components/tumblr/TumblrSearch';
import { PopupManager } from './components/popups/PopupManager';
import { HarambeMemorial } from './components/easter-eggs/HarambeMemorial';
import { ClippyAssistant } from './components/easter-eggs/ClippyAssistant';
import { GooglePlusNotif } from './components/easter-eggs/GooglePlusNotif';
import { DialupOverlay } from './components/DialupOverlay';
import type { BrowserTab, NavigationState } from './types';

const DEFAULT_NAV_STATE: NavigationState = { site: 'google', page: 'home', query: '', videoId: '' };

function deriveTabLabel(state: NavigationState): string {
  if (state.site === 'google') {
    return state.page === 'search' && state.query ? `${state.query} - Google Search` : 'Google';
  }
  if (state.site === 'youtube') {
    return state.page === 'search' && state.query ? `${state.query} - YouTube` : 'YouTube';
  }
  if (state.site === 'twitter') return 'Twitter';
  return 'New Tab';
}

function App() {
  const [showHarambe, setShowHarambe] = useState(false);
  const [showClippy, setShowClippy] = useState(false);
  const [showGooglePlus, setShowGooglePlus] = useState(false);
  const [showDialup, setShowDialup] = useState(false);
  const navCountRef = useRef(0);
  const [navTrigger, setNavTrigger] = useState(0);

  const onNavigate = useCallback(() => {
    navCountRef.current += 1;
    setNavTrigger(navCountRef.current);

    if (Math.random() < 0.05) setShowClippy(true);
    if (Math.random() < 0.1) setShowGooglePlus(true);
  }, []);

  const [navState, actions] = useNavigation(onNavigate);

  // Tab state
  const [tabs, setTabs] = useState<BrowserTab[]>([
    { id: crypto.randomUUID(), label: 'Google', savedState: DEFAULT_NAV_STATE },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  // Sync current navState into the active tab
  useEffect(() => {
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, label: deriveTabLabel(navState), savedState: { ...navState } }
          : t
      )
    );
  }, [navState, activeTabId]);

  const addTab = useCallback(() => {
    const newTab: BrowserTab = {
      id: crypto.randomUUID(),
      label: 'Google',
      savedState: DEFAULT_NAV_STATE,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    actions.navigate('google', 'home');
  }, [actions]);

  const switchTab = useCallback(
    (tabId: string) => {
      if (tabId === activeTabId) return;
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, savedState: { ...navState }, label: deriveTabLabel(navState) } : t
        )
      );
      setActiveTabId(tabId);
      const tab = tabs.find((t) => t.id === tabId);
      if (tab) {
        const s = tab.savedState;
        actions.navigate(s.site, s.page, { query: s.query, videoId: s.videoId });
      }
    },
    [activeTabId, navState, tabs, actions]
  );

  const closeTab = useCallback(
    (tabId: string) => {
      if (tabs.length === 1) return;
      const newTabs = tabs.filter((t) => t.id !== tabId);
      setTabs(newTabs);
      if (activeTabId === tabId) {
        const newActive = newTabs[newTabs.length - 1];
        setActiveTabId(newActive.id);
        const s = newActive.savedState;
        actions.navigate(s.site, s.page, { query: s.query, videoId: s.videoId });
      }
    },
    [tabs, activeTabId, actions]
  );

  const handleSearch = useCallback(
    (query: string, site?: 'google' | 'youtube' | 'twitter') => {
      const lower = query.toLowerCase().trim();
      if (lower.includes('harambe')) setShowHarambe(true);
      const currentSite = site ?? navState.site;
      actions.navigate(currentSite, 'search', { query });
    },
    [actions, navState.site]
  );

  const handleYouTubeVideoClick = useCallback(
    (videoId: string) => {
      actions.navigate('youtube', 'video', { videoId });
    },
    [actions]
  );

  const handleYouTubeSearch = useCallback(
    (query: string) => {
      if (!query) {
        actions.navigate('youtube', 'home');
        return;
      }
      if (query.toLowerCase().includes('harambe')) setShowHarambe(true);
      actions.navigate('youtube', 'search', { query });
    },
    [actions]
  );

  const handleTwitterSearch = useCallback(
    (query: string) => {
      if (query.toLowerCase().includes('harambe')) setShowHarambe(true);
      actions.navigate('twitter', 'search', { query });
    },
    [actions]
  );

  const handleVineSearch = useCallback((query: string) => {
    if (query.toLowerCase().includes('harambe')) {
      setShowHarambe(true);
    }
    actions.navigate('vine', 'search', { query });
  }, [actions]);

  const handleVineExplore = useCallback(() => {
    actions.navigate('vine', 'explore');
  }, [actions]);

  const handleTumblrSearch = useCallback((query: string) => {
    if (query.toLowerCase().includes('harambe')) {
      setShowHarambe(true);
    }
    actions.navigate('tumblr', 'search', { query });
  }, [actions]);

  const handleTumblrTagClick = useCallback((tag: string) => {
    if (tag.toLowerCase().includes('harambe')) {
      setShowHarambe(true);
    }
    actions.navigate('tumblr', 'tagged', { query: tag });
  }, [actions]);

  const renderContent = () => {
    const { site, page, query, videoId } = navState;

    switch (site) {
      case 'google':
        if (page === 'search' && query) {
          return (
            <GoogleResults
              key={`google-search-${query}`}
              query={query}
              onSearch={(q) => handleSearch(q, 'google')}
              onNavigate={(s) => actions.navigate(s)}
            />
          );
        }
        return <GoogleHome onSearch={(q) => handleSearch(q, 'google')} />;

      case 'youtube':
        if (page === 'video' && videoId) {
          return (
            <YouTubeVideo
              key={`youtube-video-${videoId}`}
              videoId={videoId}
              onSearch={handleYouTubeSearch}
              onVideoClick={handleYouTubeVideoClick}
            />
          );
        }
        if (page === 'search' && query) {
          return (
            <YouTubeResults
              key={`youtube-search-${query}`}
              query={query}
              onSearch={handleYouTubeSearch}
              onVideoClick={handleYouTubeVideoClick}
            />
          );
        }
        return (
          <YouTubeHome onSearch={handleYouTubeSearch} onVideoClick={handleYouTubeVideoClick} />
        );

      case 'twitter':
        return (
          <TwitterFeed
            key={`twitter-${query || 'home'}`}
            query={query}
            onSearch={handleTwitterSearch}
          />
        );

      case 'vine':
        if (page === 'explore') {
          return (
            <VineExplore
              key={`vine-explore-${query || 'home'}`}
              query={query}
              onSearch={handleVineSearch}
              onHome={() => actions.navigate('vine', 'home')}
            />
          );
        }
        return (
          <VineHome
            key={`vine-home-${query || 'home'}`}
            query={query}
            onSearch={handleVineSearch}
            onExplore={handleVineExplore}
          />
        );

      case 'tumblr':
        if ((page === 'search' || page === 'tagged') && query) {
          return (
            <TumblrSearch
              key={`tumblr-${page}-${query}`}
              query={query}
              mode={page}
              onSearch={handleTumblrSearch}
              onTagClick={handleTumblrTagClick}
              onHome={() => actions.navigate('tumblr', 'home')}
            />
          );
        }
        return (
          <TumblrDashboard
            onSearch={handleTumblrSearch}
            onTagClick={handleTumblrTagClick}
            onHome={() => actions.navigate('tumblr', 'home')}
          />
        );

      default:
        return <GoogleHome onSearch={(q) => handleSearch(q, 'google')} />;
    }
  };

  return (
    <>
      {showDialup && <DialupOverlay onDismiss={() => setShowDialup(false)} />}

      <BrowserShell
        navState={navState}
        actions={actions}
        tabs={tabs}
        activeTabId={activeTabId}
        onAddTab={addTab}
        onSwitchTab={switchTab}
        onCloseTab={closeTab}
      >
        {renderContent()}
      </BrowserShell>

      <PopupManager triggerCount={navTrigger} />

      {showHarambe && <HarambeMemorial onDismiss={() => setShowHarambe(false)} />}
      {showClippy && <ClippyAssistant onDismiss={() => setShowClippy(false)} />}
      {showGooglePlus && navState.site === 'google' && <GooglePlusNotif />}
    </>
  );
}

export default App;
