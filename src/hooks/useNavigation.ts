import { useState, useCallback, useRef } from 'react';
import type { SiteName, PageName, NavigationState, NavigationActions } from '../types';

const DEFAULT_STATE: NavigationState = {
  site: 'google',
  page: 'home',
  query: '',
  videoId: '',
};

function deriveDisplayUrl(state: NavigationState): string {
  const { site, page, query, videoId } = state;

  switch (site) {
    case 'google':
      if (page === 'search' && query) {
        return `www.google.com/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}`;
      }
      return 'www.google.com';

    case 'youtube':
      if (page === 'video' && videoId) {
        return `www.youtube.com/watch?v=${videoId}`;
      }
      if (page === 'search' && query) {
        return `www.youtube.com/results?search_query=${encodeURIComponent(query).replace(/%20/g, '+')}`;
      }
      return 'www.youtube.com';

    case 'twitter':
      if (page === 'search' && query) {
        return `twitter.com/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}`;
      }
      return 'twitter.com';

    case 'vine':
      if (page === 'explore') {
        if (query) {
          return `vine.co/explore?q=${encodeURIComponent(query).replace(/%20/g, '+')}`;
        }
        return 'vine.co/explore';
      }
      if (page === 'search' && query) {
        return `vine.co/search?q=${encodeURIComponent(query).replace(/%20/g, '+')}`;
      }
      return 'vine.co';

    case 'tumblr':
      if (page === 'tagged' && query) {
        return `tumblr.com/tagged/${encodeURIComponent(query).replace(/%20/g, '%20')}`;
      }
      if (page === 'search' && query) {
        return `tumblr.com/search/${encodeURIComponent(query).replace(/%20/g, '%20')}`;
      }
      return 'tumblr.com';

    default:
      return 'www.google.com';
  }
}

function parseUrl(raw: string): NavigationState {
  const url = raw.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/^www\./, '');

  if (url.startsWith('youtube.com') || url.startsWith('youtube')) {
    if (url.includes('watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0] ?? '';
      return { site: 'youtube', page: 'video', query: '', videoId };
    }
    if (url.includes('search_query=') || url.includes('results?')) {
      const query = decodeURIComponent(url.split('search_query=')[1]?.split('&')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'youtube', page: 'search', query, videoId: '' };
    }
    return { site: 'youtube', page: 'home', query: '', videoId: '' };
  }

  if (url.startsWith('twitter.com') || url.startsWith('twitter')) {
    if (url.includes('search?q=')) {
      const query = decodeURIComponent(url.split('q=')[1]?.split('&')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'twitter', page: 'search', query, videoId: '' };
    }
    return { site: 'twitter', page: 'home', query: '', videoId: '' };
  }

  if (url.startsWith('vine.co') || url.startsWith('vine')) {
    if (url.includes('explore')) {
      if (url.includes('q=')) {
        const query = decodeURIComponent(url.split('q=')[1]?.split('&')[0] ?? '').replace(/\+/g, ' ');
        return { site: 'vine', page: 'explore', query, videoId: '' };
      }
      return { site: 'vine', page: 'explore', query: '', videoId: '' };
    }
    if (url.includes('search?q=') || url.includes('q=')) {
      const query = decodeURIComponent(url.split('q=')[1]?.split('&')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'vine', page: 'search', query, videoId: '' };
    }
    return { site: 'vine', page: 'home', query: '', videoId: '' };
  }

  if (url.startsWith('tumblr.com') || url.startsWith('tumblr')) {
    const normalizedUrl = url.replace(/^tumblr\.com\/?/, '');

    if (normalizedUrl.startsWith('search/')) {
      const query = decodeURIComponent(normalizedUrl.replace(/^search\//, '').split('?')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'tumblr', page: 'search', query, videoId: '' };
    }

    if (normalizedUrl.startsWith('tagged/')) {
      const query = decodeURIComponent(normalizedUrl.replace(/^tagged\//, '').split('?')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'tumblr', page: 'tagged', query, videoId: '' };
    }

    return { site: 'tumblr', page: 'home', query: '', videoId: '' };
  }

  if (url.startsWith('google.com') || url.startsWith('google')) {
    if (url.includes('search?q=') || url.includes('q=')) {
      const query = decodeURIComponent(url.split('q=')[1]?.split('&')[0] ?? '').replace(/\+/g, ' ');
      return { site: 'google', page: 'search', query, videoId: '' };
    }
    return { site: 'google', page: 'home', query: '', videoId: '' };
  }

  return DEFAULT_STATE;
}

export function useNavigation(onNavigate?: () => void): [NavigationState, NavigationActions] {
  const [state, setState] = useState<NavigationState>(DEFAULT_STATE);
  const historyRef = useRef<NavigationState[]>([DEFAULT_STATE]);
  const indexRef = useRef(0);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyLength, setHistoryLength] = useState(1);

  const pushState = useCallback((newState: NavigationState) => {
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);
    newHistory.push(newState);
    historyRef.current = newHistory;
    indexRef.current = newHistory.length - 1;
    setHistoryIndex(indexRef.current);
    setHistoryLength(newHistory.length);
    setState(newState);
    onNavigate?.();
  }, [onNavigate]);

  const navigate = useCallback((site: SiteName, page: PageName = 'home', params?: { query?: string; videoId?: string }) => {
    pushState({
      site,
      page,
      query: params?.query ?? '',
      videoId: params?.videoId ?? '',
    });
  }, [pushState]);

  const navigateFromUrl = useCallback((url: string) => {
    pushState(parseUrl(url));
  }, [pushState]);

  const search = useCallback((query: string) => {
    pushState({
      ...state,
      page: 'search',
      query,
      videoId: '',
    });
  }, [pushState, state]);

  const goBack = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current -= 1;
      setHistoryIndex(indexRef.current);
      const prevState = historyRef.current[indexRef.current];
      setState(prevState);
      onNavigate?.();
    }
  }, [onNavigate]);

  const goForward = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
      setHistoryIndex(indexRef.current);
      const nextState = historyRef.current[indexRef.current];
      setState(nextState);
      onNavigate?.();
    }
  }, [onNavigate]);

  const actions: NavigationActions = {
    navigate,
    navigateFromUrl,
    search,
    goBack,
    goForward,
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < historyLength - 1,
    displayUrl: deriveDisplayUrl(state),
  };

  return [state, actions];
}
