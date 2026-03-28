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
import { ElectionPoll } from './components/easter-eggs/ElectionPoll';
import { PokemonGoOverlay } from './components/easter-eggs/PokemonGoOverlay';
import { HarambeWatermark } from './components/easter-eggs/HarambeWatermark';
import { BottleFlip } from './components/easter-eggs/BottleFlip';
import { MannequinChallenge } from './components/easter-eggs/MannequinChallenge';
import { DamnDaniel } from './components/easter-eggs/DamnDaniel';
import { CreepyClown } from './components/easter-eggs/CreepyClown';
import { FidgetSpinnerCursor } from './components/easter-eggs/FidgetSpinnerCursor';
import { PPAPCombiner } from './components/easter-eggs/PPAPCombiner';

function App() {
  const [showDialup, setShowDialup] = useState(true);
  const [showHarambe, setShowHarambe] = useState(false);
  const [showClippy, setShowClippy] = useState(false);
  const [showGooglePlus, setShowGooglePlus] = useState(false);
  const navCountRef = useRef(0);
  const [navTrigger, setNavTrigger] = useState(0);

  // New easter egg states
  const [showElectionPoll, setShowElectionPoll] = useState(false);
  const [showPokemonGo, setShowPokemonGo] = useState(false);
  const [pokemonGoFeature, setPokemonGoFeature] = useState('');
  const [showBottleFlip, setShowBottleFlip] = useState(false);
  const [bottleFlipAction, setBottleFlipAction] = useState<(() => void) | null>(null);
  const [showMannequin, setShowMannequin] = useState(false);
  const [damnDanielMsg, setDamnDanielMsg] = useState<string | null>(null);
  const [showPPAP, setShowPPAP] = useState(false);

  // Track navigations for timed events
  const mannequinCheckRef = useRef(0);

  const triggerDamnDaniel = useCallback((msg: string) => {
    setDamnDanielMsg(msg);
  }, []);

  const onNavigate = useCallback(() => {
    navCountRef.current += 1;
    setNavTrigger(navCountRef.current);
    mannequinCheckRef.current += 1;

    // 5% chance of Clippy
    if (Math.random() < 0.05) {
      setShowClippy(true);
    }

    // Show Google+ notification occasionally
    if (Math.random() < 0.1) {
      setShowGooglePlus(true);
    }

    // 8% chance of Election Poll after 3 navigations
    if (navCountRef.current > 3 && Math.random() < 0.08) {
      setShowElectionPoll(true);
    }

    // 3% chance of Mannequin Challenge after 5 navigations
    if (mannequinCheckRef.current > 5 && Math.random() < 0.03) {
      setShowMannequin(true);
      mannequinCheckRef.current = 0; // Reset so it doesn't spam
    }

    // 4% chance of Pokémon GO blocking a feature
    if (navCountRef.current > 4 && Math.random() < 0.04) {
      const features = ['the next page', 'YouTube', 'search results', 'Twitter', 'this content'];
      setPokemonGoFeature(features[Math.floor(Math.random() * features.length)]);
      setShowPokemonGo(true);
    }

    // 5% chance of PPAP combiner
    if (navCountRef.current > 6 && Math.random() < 0.05) {
      setShowPPAP(true);
    }

    // Damn Daniel notification on every 7th navigation
    if (navCountRef.current % 7 === 0) {
      triggerDamnDaniel('navigated pages');
    }
  }, [triggerDamnDaniel]);

  const [navState, actions] = useNavigation(onNavigate);

  const handleSearch = useCallback((query: string, site?: 'google' | 'youtube' | 'twitter') => {
    const lower = query.toLowerCase().trim();

    // Harambe easter egg
    if (lower.includes('harambe')) {
      setShowHarambe(true);
    }

    // Election-related searches always trigger poll
    if (lower.includes('trump') || lower.includes('hillary') || lower.includes('election') || lower.includes('clinton')) {
      setShowElectionPoll(true);
    }

    // Damn Daniel search
    if (lower.includes('damn daniel') || lower.includes('white vans')) {
      triggerDamnDaniel('searched for the classics');
    }

    // Bottle flip search — trigger the minigame
    if (lower.includes('bottle flip')) {
      setShowBottleFlip(true);
      setBottleFlipAction(() => () => {
        triggerDamnDaniel('landed the bottle flip');
      });
    }

    // Pokemon GO search
    if (lower.includes('pokemon') || lower.includes('pokémon')) {
      setPokemonGoFeature('Pokémon search results');
      setShowPokemonGo(true);
    }

    // Mannequin challenge search
    if (lower.includes('mannequin challenge')) {
      setShowMannequin(true);
    }

    // PPAP search
    if (lower.includes('ppap') || lower.includes('pen pineapple')) {
      setShowPPAP(true);
    }

    const currentSite = site ?? navState.site;
    actions.navigate(currentSite, 'search', { query });
  }, [actions, navState.site, triggerDamnDaniel]);

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

      {/* Harambe watermark — always present as spiritual guardian */}
      <HarambeWatermark />

      {/* Election poll banner */}
      {showElectionPoll && (
        <ElectionPoll onDismiss={() => setShowElectionPoll(false)} />
      )}

      <BrowserShell navState={navState} actions={actions}>
        {renderContent()}
      </BrowserShell>

      <PopupManager triggerCount={navTrigger} />

      {/* Existing easter eggs */}
      {showHarambe && <HarambeMemorial onDismiss={() => setShowHarambe(false)} />}
      {showClippy && <ClippyAssistant onDismiss={() => setShowClippy(false)} />}
      {showGooglePlus && navState.site === 'google' && <GooglePlusNotif />}

      {/* New easter eggs */}
      {showPokemonGo && (
        <PokemonGoOverlay
          featureName={pokemonGoFeature}
          requiredClicks={50}
          onDismiss={() => setShowPokemonGo(false)}
        />
      )}

      {showBottleFlip && (
        <BottleFlip
          onConfirm={() => {
            setShowBottleFlip(false);
            bottleFlipAction?.();
          }}
          onCancel={() => setShowBottleFlip(false)}
        />
      )}

      {showMannequin && (
        <MannequinChallenge onDismiss={() => setShowMannequin(false)} />
      )}

      {damnDanielMsg && (
        <DamnDaniel
          message={damnDanielMsg}
          onDismiss={() => setDamnDanielMsg(null)}
        />
      )}

      {showPPAP && (
        <PPAPCombiner
          onCombine={(combined) => {
            setShowPPAP(false);
            triggerDamnDaniel(`combined ${combined}`);
          }}
          onCancel={() => setShowPPAP(false)}
        />
      )}

      {/* Always-on ambient easter eggs */}
      <CreepyClown interval={25000} />
      <FidgetSpinnerCursor />
    </>
  );
}

export default App;
