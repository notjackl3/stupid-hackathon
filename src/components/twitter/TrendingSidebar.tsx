const WHO_TO_FOLLOW = [
  { name: 'Twitter Moments', handle: 'TwitterMoments', verified: true },
  { name: 'Kris Sanchez', handle: 'KrisSanchez', verified: false },
  { name: 'Barack Obama', handle: 'BarackObama', verified: true },
];

const REAL_AVATARS: Record<string, string> = {
  BarackObama: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/President_Barack_Obama.jpg/220px-President_Barack_Obama.jpg',
  TwitterMoments: 'https://www.google.com/s2/favicons?domain=twitter.com&sz=128',
  KrisSanchez: `https://i.pravatar.cc/96?u=KrisSanchez`,
};

function getAvatarUrl(handle: string): string {
  return REAL_AVATARS[handle] ?? `https://i.pravatar.cc/96?u=${encodeURIComponent(handle)}`;
}

export function RightSidebar() {
  return (
    <div className="w-[180px] flex-shrink-0">
      {/* Who to follow */}
      <div className="bg-white border border-[#e6ecf0] rounded-[5px] overflow-hidden mb-[10px]">
        <div className="px-[12px] py-[8px] border-b border-[#e6ecf0] flex items-center justify-between">
          <h3 className="font-bold text-[#14171a] text-[13px]">Who to follow</h3>
          <div className="flex items-center gap-[4px] text-[11px]">
            <span className="text-[#1da1f2] hover:underline cursor-pointer">Refresh</span>
            <span className="text-[#657786]">&middot;</span>
            <span className="text-[#1da1f2] hover:underline cursor-pointer">View all</span>
          </div>
        </div>
        {WHO_TO_FOLLOW.map((user) => (
          <div key={user.handle} className="px-[12px] py-[8px] flex items-start gap-[8px] border-b border-[#e6ecf0] last:border-b-0 hover:bg-[#f5f8fa] cursor-pointer transition-colors">
            <img
              src={getAvatarUrl(user.handle)}
              alt={user.name}
              className="w-[36px] h-[36px] rounded-full bg-[#e1e8ed] flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[2px]">
                <span className="text-[12px] font-bold text-[#14171a] truncate hover:underline">{user.name}</span>
                {user.verified && (
                  <svg viewBox="0 0 24 24" className="w-[12px] h-[12px] fill-[#1da1f2] flex-shrink-0">
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                  </svg>
                )}
              </div>
              <div className="text-[11px] text-[#657786] truncate">@{user.handle}</div>
              <button className="mt-[4px] text-[#1da1f2] border border-[#1da1f2] rounded-full text-[11px] px-[10px] py-[2px] hover:bg-[#e8f5fd] cursor-pointer font-bold transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Find people */}
      <div className="px-[4px] mb-[10px]">
        <span className="text-[12px] text-[#1da1f2] hover:underline cursor-pointer">Find people you know</span>
      </div>

      {/* Footer links */}
      <div className="text-[11px] text-[#657786] leading-[16px] px-[4px] py-[4px]">
        <span className="hover:underline cursor-pointer">&copy; 2016 Twitter</span>
        {' '}
        {['About', 'Help Center', 'Terms', 'Privacy policy', 'Cookies', 'Ads info', 'Brand', 'Blog', 'Status', 'Apps', 'Jobs', 'Businesses', 'Developers'].map((link, i) => (
          <span key={link}>
            {i > 0 ? ' ' : ''}
            <span className="hover:underline hover:text-[#1da1f2] cursor-pointer">{link}</span>
          </span>
        ))}
      </div>

      {/* Advertise */}
      <div className="px-[4px] mt-[6px]">
        <span className="text-[11px] text-[#657786] hover:underline cursor-pointer">Advertise with Twitter</span>
      </div>
    </div>
  );
}
