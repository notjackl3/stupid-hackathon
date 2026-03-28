const COMMENTS_2016 = [
  { user: 'xXDarkSlayer420Xx', text: 'First', likes: 2847 },
  { user: 'Jessica Smith', text: 'like if you\'re watching in 2016!! 😂😂', likes: 1203 },
  { user: 'GamerDude99', text: 'who\'s watching this in 2016?? 🔥🔥🔥', likes: 982 },
  { user: 'SarahLovesLife', text: 'came here from Facebook lol', likes: 456 },
  { user: 'MLGpro360', text: '😂😂😂💀💀 IM DEAD', likes: 723 },
  { user: 'John', text: 'this is better than homework 😂', likes: 334 },
  { user: 'PokemonMaster2016', text: 'I caught a Pikachu while watching this 😂', likes: 891 },
  { user: 'MusicFan42', text: 'if you dislike this video you have no soul', likes: 1567 },
  { user: 'RandomPerson', text: 'anyone else here at 3am? just me? ok', likes: 2103 },
  { user: 'harambe_rip', text: 'RIP Harambe 🦍 never forget', likes: 4521 },
  { user: 'DanielWhite', text: 'my teacher showed us this in class today', likes: 267 },
  { user: 'CoolKid2004', text: 'I\'m 12 and I love this more than kids my age', likes: 89 },
  { user: 'MinecraftSteve', text: 'who else is watching this instead of doing homework', likes: 1834 },
  { user: 'Xx_Sniper_xX', text: 'like = 1 prayer for Harambe 😢', likes: 3412 },
  { user: 'BuzzfeedFan', text: 'BuzzFeed brought me here lol', likes: 156 },
  { user: 'AnnonymousDude', text: 'thumbs up if you agree!!!! 👍', likes: 678 },
  { user: 'VineLover', text: 'this is almost as good as Vine 😂', likes: 923 },
  { user: 'SkaterBoi', text: 'bottle flip challenge at 0:32 anyone?? 😂', likes: 445 },
  { user: 'InsertNameHere', text: 'I can\'t even 💀💀💀 I\'m screaming', likes: 1678 },
  { user: 'ThatOneGuy', text: 'plot twist: you searched for this', likes: 2341 },
  { user: 'MemeLord9000', text: 'here come dat boi!!!! o shit waddup 🐸', likes: 3156 },
  { user: 'future_me_2020', text: 'I bet 2017 is gonna be amazing 😊', likes: 567 },
  { user: 'DabKing', text: '*dabs* 😎', likes: 234 },
  { user: 'ObamaFan', text: 'thanks Obama, unironically', likes: 1890 },
  { user: 'JustinBieberStan', text: 'still better than Justin Bieber 😂😂 jk I love him', likes: 445 },
  { user: 'conspiracy_bob', text: 'the government doesn\'t want you to see this video', likes: 123 },
  { user: 'WatchMojo', text: 'Top 10 reasons this video is on our list', likes: 3456 },
  { user: 'NotARobot', text: 'like this comment for no reason 😂', likes: 891 },
  { user: 'Hillary2016', text: 'can\'t wait for our first woman president!! 💪', likes: 2345 },
  { user: 'FidgetSpinnerKid', text: 'edit: omg thanks for 100 likes!!! 😱', likes: 112 },
];

export function getRandomComments(count: number = 8): typeof COMMENTS_2016 {
  const shuffled = [...COMMENTS_2016].sort(() => Math.random() - 0.5);
  // "First" is always first
  const firstComment = COMMENTS_2016[0];
  const rest = shuffled.filter((c) => c.text !== 'First').slice(0, count - 1);
  return [firstComment, ...rest];
}

export function getRandomRecommendedTitle(): string {
  const clickbait = [
    'You Won\'t BELIEVE What Happens Next... (GONE WRONG)',
    '10 Things You Didn\'t Know About 2016',
    'TRY NOT TO LAUGH Challenge 2016 (IMPOSSIBLE)',
    'Top 10 Anime Betrayals',
    'INSANE Bottle Flip Trick Shots!! (WORLD RECORD)',
    'Reacting to My Old Videos (SO CRINGE)',
    'REAL Hoverboard vs FAKE Hoverboard',
    'POKEMON GO IN REAL LIFE 😱😱',
    'I Spent 24 Hours In Walmart Challenge',
    'Harambe Tribute Video 😢 (RIP)',
    'DAMN DANIEL Compilation 2016',
    'iPhone 7 vs Galaxy S7 DROP TEST',
    'What\'s In My Mouth Challenge!! 🤢',
    'Mannequin Challenge (BEST ONE YET)',
    'Fidget Spinner Tricks for Beginners',
  ];
  return clickbait[Math.floor(Math.random() * clickbait.length)];
}
