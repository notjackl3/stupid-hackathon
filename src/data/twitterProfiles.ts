import type { Tweet } from '../types';

export interface TwitterProfileMeta {
  avatarSrc: string;
  displayName?: string;
  verified?: boolean;
}

export const TWITTER_HOME_PROFILE = {
  name: 'waff',
  handle: 'dangeredwolf',
  avatarSrc: '/twitter/avatars/selfie-copper.svg',
  bannerSrc: '/twitter/headers/retro-grid.svg',
  tweets: '38.9K',
  following: '1,981',
  followers: '3,419',
};

export const TWITTER_TRENDS = [
  { tag: '#Election2016', tweets: '2.4M Tweets', context: '@CNNPolitics and @NateSilver538 are Tweeting about this' },
  { tag: '#PokemonGO', tweets: '911K Tweets' },
  { tag: '#RIPVine', tweets: '2.3M Tweets' },
  { tag: '#Rio2016', tweets: '768K Tweets' },
  { tag: '#DamnDaniel', tweets: '454K Tweets' },
  { tag: '#Harambe', tweets: '30.9K Tweets', context: '@CincinnatiZoo and 12 others are Tweeting about this' },
  { tag: '#MannequinChallenge', tweets: '677K Tweets' },
];

export const TWITTER_WHO_TO_FOLLOW = [
  { handle: 'TwitterMoments', name: 'Twitter Moments', verified: true },
  { handle: 'BarackObama', name: 'Barack Obama', verified: true },
  { handle: 'PokemonGoApp', name: 'Pokemon GO', verified: true },
];

const REAL_PROFILES: Record<string, TwitterProfileMeta> = {
  Apple: { avatarSrc: '/twitter/avatars/apple.png', verified: true },
  BarackObama: { avatarSrc: '/twitter/avatars/barack-obama.jpg', verified: true },
  BBCBreaking: { avatarSrc: '/twitter/avatars/bbc.png', verified: true },
  Bloomberg: { avatarSrc: '/twitter/avatars/bloomberg.png', verified: true },
  BuzzFeed: { avatarSrc: '/twitter/avatars/buzzfeed.png', verified: true },
  BuzzFeedTech: { avatarSrc: '/twitter/avatars/buzzfeed.png', verified: true },
  CNBC: { avatarSrc: '/twitter/avatars/cnbc.png', verified: true },
  CNN: { avatarSrc: '/twitter/avatars/cnn.png', verified: true },
  CNNPolitics: { avatarSrc: '/twitter/avatars/cnn.png', verified: true },
  CNNTech: { avatarSrc: '/twitter/avatars/cnn.png', verified: true },
  CincinnatiZoo: { avatarSrc: '/twitter/avatars/cincinnati-zoo.png', verified: true },
  CollegeHumor: { avatarSrc: '/twitter/avatars/collegehumor.png', verified: true },
  DudePerfect: { avatarSrc: '/twitter/avatars/dude-perfect.png', verified: true },
  FTC: { avatarSrc: '/twitter/avatars/ftc.png', verified: true },
  Google: { avatarSrc: '/twitter/avatars/google.png', verified: true },
  HuffPost: { avatarSrc: '/twitter/avatars/huffpost.png', verified: true },
  Instagram: { avatarSrc: '/twitter/avatars/instagram.png', verified: true },
  Josholzz: { avatarSrc: '/twitter/avatars/selfie-indigo.svg', verified: true },
  NateSilver538: { avatarSrc: '/twitter/avatars/fivethirtyeight.png', verified: true },
  POTUS: { avatarSrc: '/twitter/avatars/barack-obama.jpg', verified: true },
  PokemonGoApp: { avatarSrc: '/twitter/avatars/pokemon-go.png', verified: true },
  PrimeVideo: { avatarSrc: '/twitter/avatars/prime-video.png', verified: true },
  SamsungMobile: { avatarSrc: '/twitter/avatars/samsung.png', verified: true },
  Snapchat: { avatarSrc: '/twitter/avatars/snapchat.png', verified: true },
  SpaceX: { avatarSrc: '/twitter/avatars/spacex.png', verified: true },
  TheEconomist: { avatarSrc: '/twitter/avatars/economist.png', verified: true },
  TheEllenShow: { avatarSrc: '/twitter/avatars/ellen.jpg', verified: true },
  ThomasSanders: { avatarSrc: '/twitter/avatars/selfie-gold.svg', verified: true },
  TwitterMoments: { avatarSrc: '/bookmarks/twitter-bird.svg', verified: true },
  Uber: { avatarSrc: '/twitter/avatars/uber.png', verified: true },
  VANS_66: { avatarSrc: '/twitter/avatars/vans.png', verified: true },
  WarrenBuffett: { avatarSrc: '/twitter/avatars/warren-buffett.jpg', verified: true },
  WebMD: { avatarSrc: '/twitter/avatars/webmd.png', verified: true },
  WIRED: { avatarSrc: '/twitter/avatars/wired.png', verified: true },
  YouTube: { avatarSrc: '/twitter/avatars/youtube.png', verified: true },
  business: { avatarSrc: '/twitter/avatars/bloomberg.png', verified: true },
  djkhaled: { avatarSrc: '/twitter/avatars/dj-khaled.jpg', verified: true },
  elonmusk: { avatarSrc: '/twitter/avatars/elon-musk.jpg', verified: true },
  espn: { avatarSrc: '/twitter/avatars/espn.png', verified: true },
  finkd: { avatarSrc: '/twitter/avatars/mark-zuckerberg.jpg', verified: true },
  googleplus: { avatarSrc: '/twitter/avatars/google.png', verified: true },
  instagram: { avatarSrc: '/twitter/avatars/instagram.png', verified: true },
  jpmorgan: { avatarSrc: '/twitter/avatars/jpmorgan.png', verified: true },
  king_bach: { avatarSrc: '/twitter/avatars/selfie-indigo.svg', verified: true },
  marissamayer: { avatarSrc: '/twitter/avatars/marissa-mayer.jpg', verified: true },
  nbcsnl: { avatarSrc: '/twitter/avatars/snl.png', verified: true },
  netflix: { avatarSrc: '/twitter/avatars/netflix.png', verified: true },
  nytpolitics: { avatarSrc: '/twitter/avatars/default-slate.svg', verified: true },
  realDonaldTrump: { avatarSrc: '/trump.png', verified: true },
  tim_cook: { avatarSrc: '/twitter/avatars/tim-cook.jpg', verified: true },
  verge: { avatarSrc: '/twitter/avatars/verge.png', verified: true },
};

const FEMALE_POOL = [
  '/twitter/avatars/portrait-female-1.jpg',
  '/twitter/avatars/portrait-female-2.jpg',
  '/twitter/avatars/portrait-female-3.jpg',
  '/twitter/avatars/portrait-female-4.jpg',
  '/twitter/avatars/portrait-female-5.jpg',
  '/twitter/avatars/portrait-female-6.jpg',
];

const MALE_POOL = [
  '/twitter/avatars/portrait-male-1.jpg',
  '/twitter/avatars/portrait-male-2.jpg',
  '/twitter/avatars/portrait-male-3.jpg',
  '/twitter/avatars/portrait-male-4.jpg',
  '/twitter/avatars/portrait-male-5.jpg',
  '/twitter/avatars/portrait-male-6.jpg',
];

const FEMALE_HANDLES = new Set([
  'avocado_toast_',
  'binge_queen',
  'concerned_mom16',
  'fitnessmom2016',
  'hey_siri_2016',
  'hillary_stan_16',
  'hopeful_2017',
  'hr_director_amy',
  'jenny_2016',
  'jess_2016',
  'karen_mom_2016',
  'karen_sick_2016',
  'lisa_normal',
  'mom_of_daniel',
  'momof3_2016',
  'new_year_new_me',
  'nye_party_2017',
  'predictions_2017',
  'sarahxoxo2016',
  'sniffles_2016',
  'standup_sarah',
  'susan_at_home',
]);

const MALE_HANDLES = new Set([
  'alex_shitposts',
  'android4lyfe',
  'apple_sheep',
  'arthurs_fist',
  'bitcoin_forever',
  'bottleflip_wr',
  'broke_student_',
  'captainhook_fan',
  'career_tips_2016',
  'corporate_dave',
  'cortana_is_bae',
  'crypto_chad420',
  'cs_major_2016',
  'cynical_2016',
  'dad_drives_fine',
  'dad_jokes_daily',
  'danny_caught_em',
  'dave_normal_guy',
  'dat_boi_frog',
  'data_nerd_dc',
  'dcpolitics_pro',
  'dcinsider2016',
  'detroit_worker',
  'dev_in_sf',
  'dr_smith_md',
  'engineer_envy',
  'film_critic_joe',
  'flip_master_16',
  'food_facts',
  'freelance_life_',
  'from_the_future',
  'future_is_now',
  'funny_mike_2016',
  'gamerjosh99',
  'get_off_my_lawn',
  'grandma_online',
  'harambe4prez',
  'here_come_dat',
  'hodl_btc_2016',
  'insurance_guru',
  'internet_hist',
  'janitor_steve_',
  'jake_ai_fan',
  'just_me_2016',
  'just_watching',
  'just_a_person_',
  'kyle_codes',
  'local_news_guy',
  'marketing_pro_',
  'math_teacher_j',
  'memes_2016',
  'meme_lord_9000',
  'mike_maga2016',
  'mike_skeptic',
  'mikey_bottles',
  'ml_researcher_',
  'pastor_mike_2016',
  'physics_is_cool',
  'poly_sci_major',
  'principal_j',
  'reddit_memes',
  'rip_aux_cord',
  'satoshi_is_god',
  'siri_fails_lol',
  'skeptic_dan_',
  'skynet_is_real',
  'smarterchild',
  'student_life_16',
  'survived_2016',
  'tech_reviewer_m',
  'tech_reporter_j',
  'techreporter_sf',
  'tesla_bro_2016',
  'ticktock_clocks',
  'timezonebot',
  'tired_teacher_',
  'trump_train_16',
  'truth_seeker_99',
  'vine_energy_',
  'vine_is_life',
  'vine_quotes_bot',
  'whats_a_hulu',
]);

const FALLBACKS: Record<Tweet['avatar'], string[]> = {
  anime: ['/twitter/avatars/anime-violet.svg'],
  default: ['/twitter/avatars/default-slate.svg', '/twitter/avatars/default-navy.svg'],
  dog: ['/twitter/avatars/default-slate.svg'],
  egg: ['/twitter/avatars/egg-blue.svg', '/twitter/avatars/egg-olive.svg'],
  logo: ['/twitter/avatars/default-slate.svg'],
  selfie: ['/twitter/avatars/selfie-copper.svg', '/twitter/avatars/selfie-gold.svg', '/twitter/avatars/selfie-indigo.svg'],
  sunset: ['/twitter/avatars/default-navy.svg'],
};

function hash(input: string) {
  let value = 0;
  for (let i = 0; i < input.length; i += 1) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function getTwitterProfile(handle: string, avatarKind: Tweet['avatar'] = 'egg'): TwitterProfileMeta {
  const exact = REAL_PROFILES[handle];
  if (exact) return exact;

  if (FEMALE_HANDLES.has(handle)) {
    return {
      avatarSrc: FEMALE_POOL[hash(handle) % FEMALE_POOL.length],
    };
  }

  if (MALE_HANDLES.has(handle)) {
    return {
      avatarSrc: MALE_POOL[hash(handle) % MALE_POOL.length],
    };
  }

  const pool = FALLBACKS[avatarKind] ?? FALLBACKS.egg;
  return {
    avatarSrc: pool[hash(handle) % pool.length],
  };
}
