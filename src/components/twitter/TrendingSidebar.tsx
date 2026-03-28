interface TrendingSidebarProps {
  onTrendClick: (query: string) => void;
}

const TRENDS = [
  { tag: '#Harambe', tweets: '1.2M Tweets' },
  { tag: '#PokemonGO', tweets: '892K Tweets' },
  { tag: '#Election2016', tweets: '2.1M Tweets' },
  { tag: '#DamnDaniel', tweets: '456K Tweets' },
  { tag: '#MannequinChallenge', tweets: '678K Tweets' },
  { tag: '#BottleFlipChallenge', tweets: '534K Tweets' },
  { tag: 'Trump', tweets: '1.8M Tweets', label: 'Trending' },
  { tag: 'Hillary', tweets: '1.5M Tweets', label: 'Trending' },
  { tag: 'Brangelina', tweets: '345K Tweets', label: 'Trending' },
  { tag: '#RIPVine', tweets: '2.3M Tweets' },
];

const WHO_TO_FOLLOW = [
  { name: 'Barack Obama', handle: 'BarackObama', verified: true },
  { name: 'BuzzFeed', handle: 'BuzzFeed', verified: true },
  { name: 'Pokemon GO', handle: 'PokemonGoApp', verified: true },
];

const REAL_AVATARS: Record<string, string> = {
  BarackObama: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg',
  BuzzFeed: 'https://www.google.com/s2/favicons?domain=buzzfeed.com&sz=128',
  PokemonGoApp: 'https://www.google.com/s2/favicons?domain=pokemongolive.com&sz=128',
};

function getAvatarUrl(handle: string): string {
  return REAL_AVATARS[handle] ?? `https://i.pravatar.cc/96?u=${encodeURIComponent(handle)}`;
}

export function TrendingSidebar({ onTrendClick }: TrendingSidebarProps) {
  return (
    <div className="w-[290px] flex-shrink-0">
      {/* Trends */}
      <div className="bg-[#f5f8fa] rounded-lg mb-4">
        <div className="px-4 py-3 border-b border-[#e1e8ed]">
          <h3 className="font-bold text-[#14171a] text-base">Trends</h3>
        </div>
        {TRENDS.map((trend) => (
          <div
            key={trend.tag}
            className="px-4 py-3 hover:bg-[#eaf5fd] cursor-pointer border-b border-[#e1e8ed] last:border-b-0"
            onClick={() => onTrendClick(trend.tag.replace('#', ''))}
          >
            {trend.label && (
              <span className="text-xs text-[#657786]">{trend.label}</span>
            )}
            <div className="text-sm font-bold text-[#1da1f2]">{trend.tag}</div>
            <div className="text-xs text-[#657786]">{trend.tweets}</div>
          </div>
        ))}
      </div>

      {/* Who to follow */}
      <div className="bg-[#f5f8fa] rounded-lg mb-4">
        <div className="px-4 py-3 border-b border-[#e1e8ed]">
          <h3 className="font-bold text-[#14171a] text-base">Who to follow</h3>
        </div>
        {WHO_TO_FOLLOW.map((user) => (
          <div key={user.handle} className="px-4 py-3 flex items-center gap-3 border-b border-[#e1e8ed] last:border-b-0">
            <img
              src={getAvatarUrl(user.handle)}
              alt={user.name}
              className="w-10 h-10 rounded-full bg-[#e1e8ed]"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#14171a] truncate">{user.name}</span>
                {user.verified && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1da1f2] flex-shrink-0">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
              </div>
              <div className="text-xs text-[#657786]">@{user.handle}</div>
            </div>
            <button className="text-[#1da1f2] border border-[#1da1f2] rounded-full text-xs px-3 py-1 hover:bg-[#e8f5fd] cursor-pointer">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="text-xs text-[#657786] leading-relaxed px-4 py-3">
        {['About', 'Help Center', 'Terms', 'Privacy policy', 'Cookies', 'Ads info'].map((link, i) => (
          <span key={link}>
            {i > 0 && <span> &middot; </span>}
            <span className="hover:underline hover:text-[#1da1f2] cursor-pointer">{link}</span>
          </span>
        ))}
        <div className="mt-1">&copy; 2016 Twitter</div>
      </div>
    </div>
  );
}
