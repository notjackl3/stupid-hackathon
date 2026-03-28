import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { SOUND_BUTTONS } from '../../data/myinstantsSounds';
import { SoundButton } from './SoundButton';

interface MyInstantsHomeProps {
  query?: string;
  onSearch: (query: string) => void;
}

type FilterId = 'all' | 'trending' | 'vine' | 'mlg' | 'songs' | 'internet';

const FILTERS: Array<{ id: FilterId; label: string }> = [
  { id: 'all', label: 'All Sounds' },
  { id: 'trending', label: 'Trending' },
  { id: 'vine', label: 'Vine Classics' },
  { id: 'mlg', label: 'MLG' },
  { id: 'songs', label: 'Meme Songs' },
  { id: 'internet', label: 'Classic Internet' },
];

const FILTER_MATCHERS: Record<Exclude<FilterId, 'all' | 'trending'>, RegExp> = {
  vine: /vine|damn daniel|21|what are those/i,
  mlg: /mlg|airhorn|hitmarker|deez nuts|john cena|dat boi/i,
  songs: /rick roll|nyan cat|ppap|shooting stars|trololo|hotline bling/i,
  internet: /windows|mail|doge|harambe|bee movie|this is fine|sad violin/i,
};

const TRENDING_IDS = new Set([
  'airhorn',
  'vine-boom',
  'damn-daniel',
  'what-are-those',
  'john-cena',
  'deez-nuts',
  'harambe',
  'rick-roll',
  'nyan-cat',
]);

const FOOTER_COLUMNS = [
  {
    title: 'Popular searches',
    items: ['Sounds of Meme', 'Sounds of Fart', 'Sounds of 67', 'Sounds of Ahh', 'Sounds of Funny', 'Sounds of Indian', 'Sounds of Huh'],
  },
  {
    title: 'Other links',
    items: ['Privacy policy', 'Terms of use', 'DMCA Copyright'],
  },
];

export function MyInstantsHome({ query, onSearch }: MyInstantsHomeProps) {
  const [searchInput, setSearchInput] = useState(query || '');
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  useEffect(() => {
    setSearchInput(query || '');
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const filteredSounds = useMemo(() => {
    const normalizedQuery = query?.trim().toLowerCase() ?? '';
    let sounds = SOUND_BUTTONS;

    if (normalizedQuery) {
      sounds = sounds.filter((sound) => sound.name.toLowerCase().includes(normalizedQuery));
    }

    if (activeFilter === 'trending') {
      sounds = sounds.filter((sound) => TRENDING_IDS.has(sound.id));
    } else if (activeFilter !== 'all') {
      sounds = sounds.filter((sound) => FILTER_MATCHERS[activeFilter].test(sound.name));
    }

    return sounds;
  }, [activeFilter, query]);

  return (
    <div className="min-h-full overflow-y-auto bg-[#f7f7f7] text-[#555]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="border-t-[4px] border-[#d94e4e] bg-[#d94e4e] text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-3 px-4 py-2">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-white/15 bg-white/10 text-lg leading-none"
          >
            ≡
          </button>
          <div className="text-[17px] font-bold tracking-[-0.02em]">Myinstants</div>
          <div className="ml-2 flex max-w-[420px] flex-1 items-center gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="h-7 w-full rounded-[6px] border border-[#cfcfcf] bg-white px-3 text-[13px] text-[#333] outline-none"
            />
            <button
              type="button"
              onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
              className="rounded-[4px] bg-[#39b85b] px-3 py-1 text-[12px] font-bold text-white shadow-[inset_0_-1px_0_rgba(0,0,0,0.15)]"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1220px] px-4 pb-10 pt-3">
        <div className="mb-1 text-[12px] text-[#777]">
          <span className="text-[#8d8d8d]">Myinstants</span>
          <span>{'>'}</span>
          <span>{query ? `Search results for "${query}"` : '2016 Meme Soundboard'}</span>
        </div>

        <div className="mb-3 flex flex-wrap gap-2 text-[13px]">
          {FILTERS.map((filter) => {
            const active = filter.id === activeFilter;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className="rounded-full border px-2.5 py-[3px] leading-none"
                style={{
                  borderColor: active ? '#db5e5e' : '#d8d8d8',
                  background: active ? '#db5e5e' : '#fff',
                  color: active ? '#fff' : '#5f5f5f',
                }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-[2px] bg-white px-2 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] justify-items-center gap-y-7">
            {filteredSounds.map((sound) => (
              <SoundButton key={sound.id} sound={sound} />
            ))}
          </div>

          {filteredSounds.length === 0 && (
            <p className="py-16 text-center text-[15px] text-[#777]">No sounds found. Try another search.</p>
          )}
        </div>

        <div className="mt-10 bg-[#cb343c] px-5 py-6 text-[12px] text-white">
          <div className="grid gap-6 md:grid-cols-[220px_1fr_1fr_170px]">
            <div>
              <button
                type="button"
                className="mb-4 w-full rounded-[3px] bg-[#2a78d6] px-4 py-2 text-left text-[12px] font-bold text-white"
              >
                Install Myinstants webapp
              </button>
              <div className="space-y-2 text-white/90">
                {['Main links', 'Trending', 'Hall of fame', 'Just added', 'Categories', 'Upload Sound', 'My Favorites'].map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <div className="mb-3 font-bold">{column.title}</div>
                <div className="space-y-2 text-white/90">
                  {column.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className="mb-3 font-bold">Language</div>
              <div className="flex items-center gap-2">
                <select
                  className="h-7 flex-1 rounded-[2px] border border-[#b52d35] bg-white px-2 text-[12px] text-[#555]"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                </select>
                <button type="button" className="rounded-[2px] bg-[#2a78d6] px-3 py-1.5 font-bold text-white">
                  Go
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-white/80">
            © Myinstants since 2019 - Icons made by Roundicons and Freepik
          </div>
        </div>
      </div>
    </div>
  );
}
