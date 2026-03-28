export interface SpotifyCoverArt {
  gradient: string;
  accent: string;
  label: string;
  imageUrl?: string;
}

export interface SpotifyTrack {
  slug: string;
  title: string;
  artist: string;
  album: string;
  albumSlug: string;
  trackId: string;
  duration: string;
  plays: string;
  cover: SpotifyCoverArt;
}

export interface SpotifyAlbum {
  slug: string;
  title: string;
  artist: string;
  albumId: string;
  year: string;
  subtitle: string;
  cover: SpotifyCoverArt;
  trackSlugs: string[];
}

export interface SpotifyPlaylist {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  owner: string;
  followers: string;
  cover: SpotifyCoverArt;
  trackSlugs: string[];
  mood: string;
  badge?: string;
}

export interface SpotifyCategory {
  slug: string;
  title: string;
  color: string;
  blurb: string;
}

export interface SpotifyArtist {
  slug: string;
  name: string;
  blurb: string;
  monthlyListeners: string;
  cover: SpotifyCoverArt;
}

export interface SpotifyFriendActivityItem {
  name: string;
  track: string;
  artist: string;
  time: string;
}

export interface SpotifySearchResult {
  songs: SpotifyTrack[];
  artists: SpotifyArtist[];
  albums: SpotifyAlbum[];
  message?: string;
  aside?: string;
}

const cover = (gradient: string, accent: string, label: string, imageUrl?: string): SpotifyCoverArt => ({
  gradient,
  accent,
  label,
  imageUrl,
});

export const spotifyTracks: SpotifyTrack[] = [
  {
    slug: 'one-dance',
    title: 'One Dance',
    artist: 'Drake ft. WizKid, Kyla',
    album: 'Views',
    albumSlug: 'views',
    trackId: '1zi7xx7UVEFkmKfv06H8x0',
    duration: '2:54',
    plays: '983,441,210',
    cover: cover('linear-gradient(135deg,#f6d27a 0%,#c96f46 100%)', '#f8f0a6', 'VIEWS'),
  },
  {
    slug: 'closer',
    title: 'Closer',
    artist: 'The Chainsmokers ft. Halsey',
    album: 'Collage EP',
    albumSlug: 'collage-ep',
    trackId: '7BKLCZ1jbUBVqRi2FVlTVw',
    duration: '4:04',
    plays: '812,004,551',
    cover: cover('linear-gradient(135deg,#6d6c79 0%,#24252a 100%)', '#ffffff', 'CLOSER'),
  },
  {
    slug: 'panda',
    title: 'Panda',
    artist: 'Desiigner',
    album: 'New English',
    albumSlug: 'new-english',
    trackId: '5YEOzOojehCqxGQCcQiyR4',
    duration: '4:06',
    plays: '344,120,944',
    cover: cover('linear-gradient(135deg,#0e0f12 0%,#6f7277 100%)', '#d9dde2', 'PANDA'),
  },
  {
    slug: 'dont-let-me-down',
    title: "Don't Let Me Down",
    artist: 'The Chainsmokers ft. Daya',
    album: 'Collage EP',
    albumSlug: 'collage-ep',
    trackId: '2Foc5Q5nqNiosCNqttzHof',
    duration: '3:28',
    plays: '571,120,882',
    cover: cover('linear-gradient(135deg,#311f44 0%,#d66a6f 100%)', '#ffe9ef', 'DLMD'),
  },
  {
    slug: 'work',
    title: 'Work',
    artist: 'Rihanna ft. Drake',
    album: 'ANTI',
    albumSlug: 'anti',
    trackId: '4OafepVMKq7MqHWMJSVMKP',
    duration: '3:39',
    plays: '646,221,540',
    cover: cover('linear-gradient(135deg,#a62b3d 0%,#f3d55d 100%)', '#fbeec6', 'ANTI'),
  },
  {
    slug: 'cheap-thrills',
    title: 'Cheap Thrills',
    artist: 'Sia ft. Sean Paul',
    album: 'This Is Acting',
    albumSlug: 'this-is-acting',
    trackId: '27SdQb1oBTsVGqNHnjSerA',
    duration: '3:31',
    plays: '523,402,100',
    cover: cover('linear-gradient(135deg,#ee9c53 0%,#171717 100%)', '#fff4df', 'CHEAP'),
  },
  {
    slug: 'ibiza',
    title: 'I Took a Pill in Ibiza (Seeb Remix)',
    artist: 'Mike Posner',
    album: 'At Night, Alone.',
    albumSlug: 'at-night-alone',
    trackId: '0GbSFJlfWVpYPiFbgnLNoT',
    duration: '3:18',
    plays: '411,276,004',
    cover: cover('linear-gradient(135deg,#f58c5b 0%,#475f6c 100%)', '#fff7ea', 'IBIZA'),
  },
  {
    slug: 'stressed-out',
    title: 'Stressed Out',
    artist: 'twenty one pilots',
    album: 'Blurryface',
    albumSlug: 'blurryface',
    trackId: '3CRDbSIZ4r5MsZ0YwxuEkn',
    duration: '3:22',
    plays: '622,810,090',
    cover: cover('linear-gradient(135deg,#161616 0%,#d73a31 100%)', '#ffe7df', 'BLUR'),
  },
  {
    slug: 'cant-stop-the-feeling',
    title: "Can't Stop the Feeling!",
    artist: 'Justin Timberlake',
    album: 'Trolls OST',
    albumSlug: 'trolls-ost',
    trackId: '6JV2JOEocMbcalolHMadFH',
    duration: '3:56',
    plays: '487,005,812',
    cover: cover('linear-gradient(135deg,#44b8ff 0%,#ffd64a 100%)', '#fbfcff', 'FEEL'),
  },
  {
    slug: '7-years',
    title: '7 Years',
    artist: 'Lukas Graham',
    album: 'Lukas Graham',
    albumSlug: 'lukas-graham',
    trackId: '7oOOI85YLJmrkiBiAByNsf',
    duration: '3:57',
    plays: '551,884,342',
    cover: cover('linear-gradient(135deg,#496c8a 0%,#d4bea3 100%)', '#fff3ea', '7'),
  },
  {
    slug: 'heathens',
    title: 'Heathens',
    artist: 'twenty one pilots',
    album: 'Suicide Squad: The Album',
    albumSlug: 'suicide-squad',
    trackId: '6i0V12jOa3mr6g4qoez4aV',
    duration: '3:15',
    plays: '503,991,013',
    cover: cover('linear-gradient(135deg,#2b3039 0%,#7d1317 100%)', '#ffd7cb', 'HEATH'),
  },
  {
    slug: 'love-yourself',
    title: 'Love Yourself',
    artist: 'Justin Bieber',
    album: 'Purpose',
    albumSlug: 'purpose',
    trackId: '50kpGBMov4EB1OY7aN9VYJ',
    duration: '3:53',
    plays: '632,410,777',
    cover: cover('linear-gradient(135deg,#d0b086 0%,#3f372f 100%)', '#fff1d5', 'PURP'),
  },
  {
    slug: 'needed-me',
    title: 'Needed Me',
    artist: 'Rihanna',
    album: 'ANTI',
    albumSlug: 'anti',
    trackId: '1Wroj2mQFsyfdVIKSfEn16',
    duration: '3:11',
    plays: '401,907,100',
    cover: cover('linear-gradient(135deg,#79111b 0%,#f3cf3f 100%)', '#fff1c8', 'ANTI'),
  },
  {
    slug: 'no',
    title: 'No',
    artist: 'Meghan Trainor',
    album: 'Thank You',
    albumSlug: 'thank-you',
    trackId: '5Y5ECJILaUVJSECOHjrGba',
    duration: '3:33',
    plays: '201,550,200',
    cover: cover('linear-gradient(135deg,#6fc7f1 0%,#ef6f73 100%)', '#fff7f7', 'NO'),
  },
  {
    slug: 'broccoli',
    title: 'Broccoli',
    artist: 'D.R.A.M. ft. Lil Yachty',
    album: 'Big Baby D.R.A.M.',
    albumSlug: 'big-baby-dram',
    trackId: '7yyRTcZmCiyzzJlNzGC9Ol',
    duration: '3:45',
    plays: '212,771,009',
    cover: cover('linear-gradient(135deg,#86c934 0%,#255f27 100%)', '#f0ffd8', 'BROC'),
  },
  {
    slug: 'formation',
    title: 'Formation',
    artist: 'Beyonce',
    album: 'Lemonade',
    albumSlug: 'lemonade',
    trackId: '6g0Orsxv7GIbZdW1LaBi4j',
    duration: '3:26',
    plays: '298,883,291',
    cover: cover('linear-gradient(135deg,#1c2130 0%,#bca18e 100%)', '#fff1e8', 'LEM'),
  },
  {
    slug: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    albumSlug: 'starboy',
    trackId: '7MXVkk9YMctZqd1Srtv4MB',
    duration: '3:50',
    plays: '269,332,188',
    cover: cover('linear-gradient(135deg,#c62828 0%,#161616 100%)', '#ffe6e0', 'STAR'),
  },
  {
    slug: 'black-beatles',
    title: 'Black Beatles',
    artist: 'Rae Sremmurd ft. Gucci Mane',
    album: 'SremmLife 2',
    albumSlug: 'sremmlife-2',
    trackId: '6fujklziTHa8uoM5OQSfIo',
    duration: '4:51',
    plays: '245,119,876',
    cover: cover('linear-gradient(135deg,#20242d 0%,#d8ab45 100%)', '#fff0bf', 'FREEZE'),
  },
  {
    slug: 'fade',
    title: 'Fade',
    artist: 'Kanye West',
    album: 'The Life of Pablo',
    albumSlug: 'the-life-of-pablo',
    trackId: '13VvyJpwFhsbjwSNx5CXIF',
    duration: '3:13',
    plays: '123,880,555',
    cover: cover('linear-gradient(135deg,#f1924f 0%,#f4d954 100%)', '#fff4cb', 'PABLO'),
  },
  {
    slug: 'ultralight-beam',
    title: 'Ultralight Beam',
    artist: 'Kanye West',
    album: 'The Life of Pablo',
    albumSlug: 'the-life-of-pablo',
    trackId: '1eQBEelI2NCy7AUTerX0KS',
    duration: '5:20',
    plays: '111,402,831',
    cover: cover('linear-gradient(135deg,#f3a23d 0%,#f3e08b 100%)', '#fff8dc', 'PABLO'),
  },
  {
    slug: 'tik-tok',
    title: 'TiK ToK',
    artist: 'Kesha',
    album: 'Animal',
    albumSlug: 'animal',
    trackId: '6zQlRd6tvEVJm59P8PMj7o',
    duration: '3:20',
    plays: '301,005,772',
    cover: cover('linear-gradient(135deg,#eb5ea0 0%,#762f8d 100%)', '#ffe4f7', 'TiK'),
  },
  {
    slug: 'white-iverson',
    title: 'White Iverson',
    artist: 'Post Malone',
    album: 'August 26th',
    albumSlug: 'august-26th',
    trackId: '6jsPjymn3neHzJQq95sh9z',
    duration: '4:16',
    plays: '88,220,410',
    cover: cover('linear-gradient(135deg,#3d464d 0%,#d0b48c 100%)', '#fff0dc', 'POST'),
  },
  {
    slug: 'new-love',
    title: 'New Love',
    artist: 'Dua Lipa',
    album: 'Dua Lipa (pre-chaos era)',
    albumSlug: 'dua-lipa-pre-chaos',
    trackId: '3QNcGTHxCCLoHWKIake7x4',
    duration: '3:31',
    plays: '52,014',
    cover: cover('linear-gradient(135deg,#133f6b 0%,#7fa4d3 100%)', '#eef6ff', 'DUA'),
  },
];

export const spotifyTrackMap = Object.fromEntries(spotifyTracks.map((track) => [track.slug, track]));

export const spotifyAlbums: SpotifyAlbum[] = [
  {
    slug: 'views',
    title: 'Views',
    artist: 'Drake',
    albumId: '40GMAhriYJRO1rsY4YdrZb',
    year: '2016',
    subtitle: 'Toronto staring contest music.',
    cover: spotifyTrackMap['one-dance'].cover,
    trackSlugs: ['one-dance'],
  },
  {
    slug: 'purpose',
    title: 'Purpose',
    artist: 'Justin Bieber',
    albumId: '6Fr2rQkZ383FcMqFyT7yPr',
    year: '2015',
    subtitle: 'Still extremely inescapable in 2016.',
    cover: spotifyTrackMap['love-yourself'].cover,
    trackSlugs: ['love-yourself'],
  },
  {
    slug: 'anti',
    title: 'ANTI',
    artist: 'Rihanna',
    albumId: '4UlGauD7ROb3YbVOFMQbdg',
    year: '2016',
    subtitle: 'Minimal, expensive, and cooler than everyone else.',
    cover: spotifyTrackMap['work'].cover,
    trackSlugs: ['work', 'needed-me'],
  },
  {
    slug: 'blurryface',
    title: 'Blurryface',
    artist: 'twenty one pilots',
    albumId: '3cQO7jp5S9qLBoIVtbkSM1',
    year: '2015',
    subtitle: 'Every anxious teen with a black hoodie had this on repeat.',
    cover: spotifyTrackMap['stressed-out'].cover,
    trackSlugs: ['stressed-out'],
  },
  {
    slug: 'beauty-behind-the-madness',
    title: 'Beauty Behind the Madness',
    artist: 'The Weeknd',
    albumId: '0P3oVJBFOv3TDXlYRhGL7s',
    year: '2015',
    subtitle: 'Still hanging around every party playlist.',
    cover: cover('linear-gradient(135deg,#18171a 0%,#a0392e 100%)', '#ffe4e1', 'WEEKND'),
    trackSlugs: ['starboy'],
  },
  {
    slug: 'lemonade',
    title: 'Lemonade',
    artist: 'Beyonce',
    albumId: '7dK54iZuOxXFarGhXwEXfF',
    year: '2016',
    subtitle: 'Tidal-exclusive energy and immaculate side-eye.',
    cover: spotifyTrackMap['formation'].cover,
    trackSlugs: ['formation'],
  },
  {
    slug: 'the-life-of-pablo',
    title: 'The Life of Pablo',
    artist: 'Kanye West',
    albumId: '7gsWAHLeT0w7es6FofOXk1',
    year: '2016',
    subtitle: 'Released, revised, argued over, revised again.',
    cover: spotifyTrackMap['fade'].cover,
    trackSlugs: ['ultralight-beam', 'fade'],
  },
  {
    slug: 'starboy',
    title: 'Starboy',
    artist: 'The Weeknd',
    albumId: '2ODvWsOgouMbaA5xf0RkJe',
    year: '2016',
    subtitle: 'Fresh haircut, shinier synths.',
    cover: spotifyTrackMap['starboy'].cover,
    trackSlugs: ['starboy'],
  },
  {
    slug: 'this-is-acting',
    title: 'This Is Acting',
    artist: 'Sia',
    albumId: '3xFSl9lIRaYYkIIbxpuUhU',
    year: '2016',
    subtitle: 'A pop machine assembled from songs she wrote for everyone else.',
    cover: spotifyTrackMap['cheap-thrills'].cover,
    trackSlugs: ['cheap-thrills'],
  },
  {
    slug: 'dangerous-woman',
    title: 'Dangerous Woman',
    artist: 'Ariana Grande',
    albumId: '3OZgEACvHNlKkB7LHMGMjO',
    year: '2016',
    subtitle: 'Velvet gloves, dangerous vocals.',
    cover: cover('linear-gradient(135deg,#241414 0%,#e8c1bc 100%)', '#fff2ef', 'ARI'),
    trackSlugs: ['cant-stop-the-feeling'],
  },
];

export const spotifyAlbumMap = Object.fromEntries(spotifyAlbums.map((album) => [album.slug, album]));

export const spotifyPlaylists: SpotifyPlaylist[] = [
  {
    slug: 'todays-top-hits',
    title: "Today's Top Hits",
    subtitle: 'The playlist everyone accidentally memorized.',
    description: 'Chart-dominating pop and rap with exactly zero subtlety.',
    owner: 'Spotify',
    followers: '8,204,102',
    cover: cover('linear-gradient(135deg,#0c4e9c 0%,#34b4f7 100%)', '#f5fbff', 'TOP HITS'),
    trackSlugs: ['one-dance', 'closer', 'work', 'cheap-thrills', 'stressed-out', 'cant-stop-the-feeling', '7-years'],
    mood: 'loud',
    badge: 'Most followed',
  },
  {
    slug: 'rap-caviar',
    title: 'Rap Caviar',
    subtitle: 'Minimalist art direction, very maximalist streaming numbers.',
    description: 'Peak 2016 rap in one moody playlist.',
    owner: 'Spotify',
    followers: '2,104,771',
    cover: cover('linear-gradient(135deg,#090909 0%,#4f4f4f 100%)', '#f3f3f3', 'RAP'),
    trackSlugs: ['panda', 'broccoli', 'black-beatles', 'fade', 'ultralight-beam'],
    mood: 'late night',
  },
  {
    slug: 'hot-country',
    title: 'Hot Country',
    subtitle: 'Pickup trucks, tailgates, and at least one heartbreak metaphor.',
    description: 'The cowboy boots section of Spotify.',
    owner: 'Spotify',
    followers: '710,991',
    cover: cover('linear-gradient(135deg,#d67f2f 0%,#5d3316 100%)', '#fff1de', 'COUNTRY'),
    trackSlugs: ['7-years', 'cant-stop-the-feeling'],
    mood: 'sunset',
  },
  {
    slug: 'peaceful-piano',
    title: 'Peaceful Piano',
    subtitle: 'Barely a meme yet. Just quiet.',
    description: 'Instrumental calm before lo-fi exploded.',
    owner: 'Spotify',
    followers: '198,224',
    cover: cover('linear-gradient(135deg,#cfcfcd 0%,#6d6d72 100%)', '#ffffff', 'PIANO'),
    trackSlugs: ['ultralight-beam', 'ibiza'],
    mood: 'focus',
  },
  {
    slug: 'baila-reggaeton',
    title: 'Baila Reggaeton',
    subtitle: 'Already hotter than the U.S. charts realized.',
    description: 'Latin heat before the rest of the internet caught up.',
    owner: 'Spotify',
    followers: '466,113',
    cover: cover('linear-gradient(135deg,#f43d50 0%,#ffb347 100%)', '#fff3e4', 'BAILA'),
    trackSlugs: ['work', 'cheap-thrills', 'closer'],
    mood: 'party',
  },
  {
    slug: 'discover-weekly',
    title: 'Discover Weekly',
    subtitle: 'The algorithm still feels like witchcraft.',
    description: 'A suspiciously accurate list of songs and one weird miss.',
    owner: 'Spotify',
    followers: 'personalized',
    cover: cover('linear-gradient(135deg,#111111 0%,#1db954 100%)', '#e9fff2', 'DISCOVER'),
    trackSlugs: ['closer', 'closer', 'closer', 'dont-let-me-down', 'ibiza', 'stressed-out'],
    mood: 'algorithmic',
    badge: 'New in 2016',
  },
  {
    slug: 'closer-radio',
    title: 'Closer Radio',
    subtitle: 'Generated from any seed song, somehow still this.',
    description: 'Spotify swears this is personalized. It absolutely is not.',
    owner: 'Spotify Radio',
    followers: 'mysteriously everyone',
    cover: cover('linear-gradient(135deg,#1db954 0%,#1a1a1a 100%)', '#effff4', 'RADIO'),
    trackSlugs: ['closer', 'closer', 'closer', 'dont-let-me-down', 'closer'],
    mood: 'inescapable',
  },
  {
    slug: 'podcast-wasteland',
    title: 'Podcasts',
    subtitle: 'Three lonely tiles and one true crime exception.',
    description: 'Pre-boom podcasting, presented with minimal enthusiasm.',
    owner: 'Spotify',
    followers: '11,204',
    cover: cover('linear-gradient(135deg,#274d92 0%,#1d1d2a 100%)', '#edf3ff', 'TALK'),
    trackSlugs: ['new-love', '7-years', 'cant-stop-the-feeling'],
    mood: 'grim',
  },
];

export const spotifyPlaylistMap = Object.fromEntries(spotifyPlaylists.map((playlist) => [playlist.slug, playlist]));

export const spotifyCategories: SpotifyCategory[] = [
  { slug: 'top-charts', title: 'Top Charts', color: '#9340ff', blurb: 'Proof that radio lost.' },
  { slug: 'new-releases', title: 'New Releases', color: '#f66b1c', blurb: 'Fresh enough to blog about.' },
  { slug: 'discover', title: 'Discover', color: '#00a9a5', blurb: 'Algorithms behaving suspiciously well.' },
  { slug: 'genres-moods', title: 'Genres & Moods', color: '#d73a49', blurb: 'Folders for every feeling.' },
  { slug: 'concerts', title: 'Concerts', color: '#2d6cdf', blurb: 'Everyone is on tour. Tickets are not cheap.' },
  { slug: 'podcasts', title: 'Podcasts', color: '#1db954', blurb: 'This shelf is mostly decorative.' },
];

export const spotifyArtists: SpotifyArtist[] = [
  {
    slug: 'drake',
    name: 'Drake',
    blurb: 'Streaming king. Toronto weather report in human form.',
    monthlyListeners: '32,112,009 monthly listeners',
    cover: spotifyTrackMap['one-dance'].cover,
  },
  {
    slug: 'kanye-west',
    name: 'Kanye West',
    blurb: 'Brilliant, chaotic, and still explaining The Life of Pablo.',
    monthlyListeners: '17,441,204 monthly listeners',
    cover: spotifyTrackMap['fade'].cover,
  },
  {
    slug: 'beyonce',
    name: 'Beyonce',
    blurb: 'Lemonade arrived and everyone suddenly had opinions about Tidal.',
    monthlyListeners: '18,604,221 monthly listeners',
    cover: spotifyTrackMap['formation'].cover,
  },
  {
    slug: 'post-malone',
    name: 'Post Malone',
    blurb: 'Very early. Mostly just White Iverson and vibes.',
    monthlyListeners: '1,102,887 monthly listeners',
    cover: spotifyTrackMap['white-iverson'].cover,
  },
  {
    slug: 'dua-lipa',
    name: 'Dua Lipa',
    blurb: 'One promising single and a lot of future not yet happened.',
    monthlyListeners: '52,311 monthly listeners',
    cover: spotifyTrackMap['new-love'].cover,
  },
  {
    slug: 'bad-bunny',
    name: 'Bad Bunny',
    blurb: 'Technically around. Culturally still loading.',
    monthlyListeners: '8,411 monthly listeners',
    cover: cover('linear-gradient(135deg,#101419 0%,#5477a3 100%)', '#ecf6ff', 'BB'),
  },
];

export const spotifyFriendActivity: SpotifyFriendActivityItem[] = [
  { name: 'Sarah', track: 'Closer', artist: 'The Chainsmokers', time: '2m ago' },
  { name: 'Jake', track: 'Panda', artist: 'Desiigner', time: '5m ago' },
  { name: 'Emma', track: 'Needed Me', artist: 'Rihanna', time: '12m ago' },
  { name: 'Mike', track: 'Heathens', artist: 'twenty one pilots', time: '18m ago' },
  { name: 'Ashley', track: 'Formation', artist: 'Beyonce', time: '23m ago' },
  { name: 'Chris', track: 'Ultralight Beam', artist: 'Kanye West', time: '31m ago' },
  { name: 'Jess', track: '7 Years', artist: 'Lukas Graham', time: '45m ago' },
  { name: 'Tyler', track: 'Stressed Out', artist: 'twenty one pilots', time: '1h ago' },
];

export const spotifySidebarLibrary = ['Your Daily Mix', 'Discover Weekly'];
export const spotifySidebarPlaylists = ['Summer Vibes 2016', 'Workout Mix', 'Chill', 'Party', 'Road Trip Songs'];

export const spotifyFeaturedPlaylists = [
  spotifyPlaylistMap['todays-top-hits'],
  spotifyPlaylistMap['rap-caviar'],
  spotifyPlaylistMap['hot-country'],
  spotifyPlaylistMap['peaceful-piano'],
  spotifyPlaylistMap['baila-reggaeton'],
];

export const spotifyNewAlbums = spotifyAlbums;

export function getSpotifyTrack(slug: string) {
  return spotifyTrackMap[slug];
}

export function getSpotifyTracks(slugs: string[]) {
  return slugs.map((slug) => spotifyTrackMap[slug]).filter(Boolean);
}

export function getSpotifyPlaylist(slug: string) {
  return spotifyPlaylistMap[slug];
}

export function getSpotifyAlbum(slug: string) {
  return spotifyAlbumMap[slug];
}

export function getSpotifyCollectionTracks(resourceType: 'playlist' | 'album', resourceId: string) {
  if (resourceType === 'playlist') {
    const playlist = getSpotifyPlaylist(resourceId);
    return playlist ? getSpotifyTracks(playlist.trackSlugs) : [];
  }

  const album = getSpotifyAlbum(resourceId);
  return album ? getSpotifyTracks(album.trackSlugs) : [];
}

export function getSpotifySearchResult(rawQuery: string): SpotifySearchResult {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return { songs: [], artists: [], albums: [] };
  }

  if (query.includes('olivia rodrigo') || query.includes('billie eilish') || query.includes('doja cat') || query.includes('cardi b') || query.includes('lil nas x') || query.includes('ai music')) {
    return {
      songs: [],
      artists: [],
      albums: [],
      message: 'No results found.',
      aside: 'Wrong era. Try again after several cultural resets.',
    };
  }

  if (query.includes('spotify wrapped')) {
    return {
      songs: [],
      artists: [],
      albums: [],
      message: 'No results found.',
      aside: 'Wrapped is not a thing yet. You get a humble Year in Music 2016 and you will like it.',
    };
  }

  if (query.includes('tiktok')) {
    return {
      songs: [spotifyTrackMap['tik-tok']],
      artists: [],
      albums: [],
      aside: 'Closest match: the Kesha song. The app does not exist yet.',
    };
  }

  if (query.includes('dua lipa')) {
    return {
      songs: [spotifyTrackMap['new-love']],
      artists: [spotifyArtists.find((artist) => artist.slug === 'dua-lipa')!],
      albums: [],
      aside: 'Promising, but still very much pre-supernova.',
    };
  }

  if (query.includes('post malone')) {
    return {
      songs: [spotifyTrackMap['white-iverson']],
      artists: [spotifyArtists.find((artist) => artist.slug === 'post-malone')!],
      albums: [],
      aside: 'One hit, a lot of face tattoos incoming.',
    };
  }

  if (query.includes('bad bunny')) {
    return {
      songs: [],
      artists: [spotifyArtists.find((artist) => artist.slug === 'bad-bunny')!],
      albums: [],
      aside: 'Technically present. Not remotely mainstream yet.',
    };
  }

  if (query.includes('lo-fi')) {
    return {
      songs: [],
      artists: [],
      albums: [],
      message: 'One suspiciously tiny chill playlist exists somewhere.',
      aside: 'The full lo-fi empire has not been invented yet.',
    };
  }

  if (query.includes('kanye') || query.includes('pablo')) {
    return {
      songs: [spotifyTrackMap['ultralight-beam'], spotifyTrackMap['fade']],
      artists: [spotifyArtists.find((artist) => artist.slug === 'kanye-west')!],
      albums: [spotifyAlbumMap['the-life-of-pablo']],
      aside: 'Reminder: this was a Tidal exclusive for a bit, and everyone was annoyingly calm about it by which I mean absolutely not calm.',
    };
  }

  if (query.includes('beyonce') || query.includes('beyoncé') || query.includes('lemonade')) {
    return {
      songs: [spotifyTrackMap['formation']],
      artists: [spotifyArtists.find((artist) => artist.slug === 'beyonce')!],
      albums: [spotifyAlbumMap['lemonade']],
      aside: 'Also briefly trapped behind a Tidal wall.',
    };
  }

  if (query.includes('drake')) {
    return {
      songs: [spotifyTrackMap['one-dance'], spotifyTrackMap['work']],
      artists: [spotifyArtists.find((artist) => artist.slug === 'drake')!],
      albums: [spotifyAlbumMap['views']],
      aside: 'Drake is unavoidable in 2016. Searching him was mostly a formality.',
    };
  }

  const matchingSongs = spotifyTracks.filter((track) => {
    const haystack = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
    return haystack.includes(query);
  });

  const matchingAlbums = spotifyAlbums.filter((album) => {
    const haystack = `${album.title} ${album.artist}`.toLowerCase();
    return haystack.includes(query);
  });

  const matchingArtists = spotifyArtists.filter((artist) => artist.name.toLowerCase().includes(query));

  if (!matchingSongs.length && !matchingArtists.length && !matchingAlbums.length) {
    return {
      songs: [],
      artists: [],
      albums: [],
      message: 'No results found.',
      aside: '2016 Spotify was confident enough to leave empty space on the page.',
    };
  }

  return {
    songs: matchingSongs,
    artists: matchingArtists,
    albums: matchingAlbums,
  };
}
