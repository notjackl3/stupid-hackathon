import { useState, useCallback, useRef } from 'react';
import { useNavigation } from './hooks/useNavigation';
import { BrowserShell } from './components/BrowserShell';
import { DialupOverlay } from './components/DialupOverlay';
import { GoogleHome } from './components/google/GoogleHome';
import { GoogleResults } from './components/google/GoogleResults';
import { YouTubeHome } from './components/youtube/YouTubeHome';
import { YouTubeResults } from './components/youtube/YouTubeResults';
import { YouTubeVideo } from './components/youtube/YouTubeVideo';
import { TwitterFeed } from './components/twitter/TwitterFeed';
import { PopupManager } from './components/popups/PopupManager';
import { HarambeMemorial } from './components/easter-eggs/HarambeMemorial';
import { ClippyAssistant } from './components/easter-eggs/ClippyAssistant';
import { GooglePlusNotif } from './components/easter-eggs/GooglePlusNotif';

function App() {
  const [showDialup, setShowDialup] = useState(true);
  const [showHarambe, setShowHarambe] = useState(false);
  const [showClippy, setShowClippy] = useState(false);
  const [showGooglePlus, setShowGooglePlus] = useState(false);
  const navCountRef = useRef(0);
  const [navTrigger, setNavTrigger] = useState(0);

  const onNavigate = useCallback(() => {
    navCountRef.current += 1;
    setNavTrigger(navCountRef.current);

    // 5% chance of Clippy
    if (Math.random() < 0.05) {
      setShowClippy(true);
    }

    // Show Google+ notification occasionally
    if (Math.random() < 0.1) {
      setShowGooglePlus(true);
    }
  }, []);

  const [navState, actions] = useNavigation(onNavigate);

  const handleSearch = useCallback((query: string, site?: 'google' | 'youtube' | 'twitter') => {
    const lower = query.toLowerCase().trim();

    // Harambe easter egg
    if (lower.includes('harambe')) {
      setShowHarambe(true);
    }

    const currentSite = site ?? navState.site;
    actions.navigate(currentSite, 'search', { query });
  }, [actions, navState.site]);

  const handleYouTubeVideoClick = useCallback((videoId: string) => {
    actions.navigate('youtube', 'video', { videoId });
  }, [actions]);

  const handleYouTubeSearch = useCallback((query: string) => {
    if (!query) {
      actions.navigate('youtube', 'home');
      return;
    }
    if (query.toLowerCase().includes('harambe')) {
      setShowHarambe(true);
    }
    actions.navigate('youtube', 'search', { query });
  }, [actions]);

  const handleTwitterSearch = useCallback((query: string) => {
    if (query.toLowerCase().includes('harambe')) {
      setShowHarambe(true);
    }
    actions.navigate('twitter', 'search', { query });
  }, [actions]);

  const renderContent = () => {
    const { site, page, query, videoId } = navState;

    switch (site) {
      case 'google':
        if (page === 'search' && query) {
          return (
            <GoogleResults
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
              videoId={videoId}
              onSearch={handleYouTubeSearch}
              onVideoClick={handleYouTubeVideoClick}
            />
          );
        }
        if (page === 'search' && query) {
          return (
            <YouTubeResults
              query={query}
              onSearch={handleYouTubeSearch}
              onVideoClick={handleYouTubeVideoClick}
            />
          );
        }
        return (
          <YouTubeHome
            onSearch={handleYouTubeSearch}
            onVideoClick={handleYouTubeVideoClick}
          />
        );

      case 'twitter':
        return (
          <TwitterFeed
            query={query}
            onSearch={handleTwitterSearch}
          />
        );

      default:
        return <GoogleHome onSearch={(q) => handleSearch(q, 'google')} />;
    }
  };

  return (
    <>
      {showDialup && <DialupOverlay onDismiss={() => setShowDialup(false)} />}

      <BrowserShell navState={navState} actions={actions}>
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
