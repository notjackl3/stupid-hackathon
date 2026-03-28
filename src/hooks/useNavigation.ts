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

  const pushState = useCallback((newState: NavigationState) => {
    const newHistory = historyRef.current.slice(0, indexRef.current + 1);
    newHistory.push(newState);
    historyRef.current = newHistory;
    indexRef.current = newHistory.length - 1;
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
      const prevState = historyRef.current[indexRef.current];
      setState(prevState);
      onNavigate?.();
    }
  }, [onNavigate]);

  const goForward = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current += 1;
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
    canGoBack: indexRef.current > 0,
    canGoForward: indexRef.current < historyRef.current.length - 1,
    displayUrl: deriveDisplayUrl(state),
  };

  return [state, actions];
}
