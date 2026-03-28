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
  { name: 'Barack Obama', handle: '@BarackObama', verified: true },
  { name: 'BuzzFeed', handle: '@BuzzFeed', verified: true },
  { name: 'Pokémon GO', handle: '@PokemonGoApp', verified: true },
];

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
            className="px-4 py-2.5 hover:bg-[#eaf5fd] cursor-pointer border-b border-[#e1e8ed] last:border-b-0"
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
          <div key={user.handle} className="px-4 py-2.5 flex items-center gap-3 border-b border-[#e1e8ed] last:border-b-0">
            <div className="w-10 h-10 rounded-full bg-[#1da1f2] flex items-center justify-center text-white font-bold text-sm">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-[#14171a] truncate">{user.name}</span>
                {user.verified && <span className="text-[#1da1f2] text-xs">&#10003;</span>}
              </div>
              <div className="text-xs text-[#657786]">{user.handle}</div>
            </div>
            <button className="text-[#1da1f2] border border-[#1da1f2] rounded-full text-xs px-3 py-1 hover:bg-[#e8f5fd] cursor-pointer">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Footer links */}
      <div className="text-xs text-[#657786] leading-relaxed px-2">
        &copy; 2016 Twitter &middot; About &middot; Help Center &middot; Terms &middot; Privacy policy &middot; Cookies &middot; Ads info
      </div>
    </div>
  );
}
