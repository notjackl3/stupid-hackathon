export interface CoolmathGame {
  slug: string;
  title: string;
  category: string;
  description: string;
  color: string;
  embedUrl: string;
  icon: string;
}

export const CATEGORIES = [
  { id: 'strategy', label: 'Strategy' },
  { id: 'skill', label: 'Skill' },
  { id: 'numbers', label: 'Numbers' },
  { id: 'logic', label: 'Logic' },
  { id: 'classic', label: 'Classic' },
  { id: 'more', label: 'More Games' },
];

export const GAMES: CoolmathGame[] = [
  {
    slug: 'run-3',
    title: 'Run 3',
    category: 'skill',
    description: 'Run and jump through an increasingly difficult space tunnel. Watch out for gaps!',
    color: '#2d1b4e',
    embedUrl: 'https://html5.gamedistribution.com/rvvASMiM/a]4f2a5a54a6425faab05c8c52a2ab75c/index.html',
    icon: '🏃',
  },
  {
    slug: 'papas-freezeria',
    title: "Papa's Freezeria",
    category: 'strategy',
    description: "You're working at an ice cream shop on a tropical island. Take orders, mix and blend, add toppings, and serve!",
    color: '#4fc3f7',
    embedUrl: 'https://www.miniplay.com/embed/papas-freezeria',
    icon: '🍦',
  },
  {
    slug: 'fireboy-and-watergirl',
    title: 'Fireboy and Watergirl',
    category: 'logic',
    description: 'Help Fireboy and Watergirl work together to get through the Forest Temple. Use teamwork to solve puzzles!',
    color: '#e65100',
    embedUrl: 'https://html5.gamedistribution.com/rvvASMiM/b2e5c8485f5c4ed5b26783a5dd8a85b2/index.html',
    icon: '🔥',
  },
  {
    slug: 'duck-life',
    title: 'Duck Life',
    category: 'skill',
    description: 'Train your duck to run, swim, and fly. Enter races to earn coins and become the champion!',
    color: '#fdd835',
    embedUrl: 'https://html5.gamedistribution.com/rvvASMiM/9f0e09f732774ce49c23c8e63e1b3b47/index.html',
    icon: '🦆',
  },
  {
    slug: 'bloxorz',
    title: 'Bloxorz',
    category: 'logic',
    description: 'Roll the block around the floating platforms and try to get it to fall through the square hole.',
    color: '#37474f',
    embedUrl: 'https://www.miniplay.com/embed/bloxorz',
    icon: '🧊',
  },
  {
    slug: 'b-cubed',
    title: 'B-Cubed',
    category: 'logic',
    description: 'Slide the block to hit every square on your way to the goal. Plan your path carefully!',
    color: '#1565c0',
    embedUrl: 'https://www.miniplay.com/embed/b-cubed',
    icon: '🟦',
  },
  {
    slug: 'snake',
    title: 'Snake',
    category: 'classic',
    description: 'The classic snake game. Eat the apples, grow longer, and try not to run into yourself!',
    color: '#2e7d32',
    embedUrl: 'https://playsnake.org',
    icon: '🐍',
  },
  {
    slug: 'chess',
    title: 'Chess',
    category: 'classic',
    description: 'The classic game of strategy. Play against the computer or challenge a friend.',
    color: '#4e342e',
    embedUrl: 'https://lichess.org/embed/game/q7ZvsdUF?theme=brown&bg=dark',
    icon: '♟️',
  },
  {
    slug: 'minesweeper',
    title: 'Minesweeper',
    category: 'numbers',
    description: 'Use logic and numbers to figure out where the mines are hiding. Classic Windows game!',
    color: '#546e7a',
    embedUrl: 'https://minesweeper.online/game/new?mode=0',
    icon: '💣',
  },
  {
    slug: 'sugar-sugar',
    title: 'Sugar Sugar',
    category: 'logic',
    description: 'Draw lines to guide falling sugar into the cups. A sweet physics puzzle!',
    color: '#fff9c4',
    embedUrl: 'https://www.miniplay.com/embed/sugar-sugar',
    icon: '🍬',
  },
  {
    slug: 'red-ball',
    title: 'Red Ball',
    category: 'skill',
    description: 'Roll and jump through levels as a bouncy red ball. Watch out for obstacles!',
    color: '#c62828',
    embedUrl: 'https://www.miniplay.com/embed/red-ball',
    icon: '🔴',
  },
  {
    slug: 'bob-the-robber',
    title: 'Bob the Robber',
    category: 'strategy',
    description: 'Sneak past guards, avoid cameras, and crack safes in this stealth adventure!',
    color: '#1a237e',
    embedUrl: 'https://www.miniplay.com/embed/bob-the-robber',
    icon: '🥷',
  },
  {
    slug: 'wheely',
    title: 'Wheely',
    category: 'logic',
    description: 'Help the little red car solve puzzles and find its way through each level.',
    color: '#d32f2f',
    embedUrl: 'https://www.miniplay.com/embed/wheely',
    icon: '🚗',
  },
  {
    slug: 'parking-fury',
    title: 'Parking Fury',
    category: 'skill',
    description: 'Can you park the car without crashing? Navigate tight parking lots and tricky spots.',
    color: '#455a64',
    embedUrl: 'https://html5.gamedistribution.com/rvvASMiM/0dd5c8d2c9ac48e8b8c8c5a22e0f2e03/index.html',
    icon: '🅿️',
  },
  {
    slug: 'iq-ball',
    title: 'IQ Ball',
    category: 'logic',
    description: 'Use your stretchy arm to grab onto objects and swing to the goal. A brainy physics game!',
    color: '#7cb342',
    embedUrl: 'https://www.miniplay.com/embed/iq-ball',
    icon: '🧠',
  },
  {
    slug: 'checkers',
    title: 'Checkers',
    category: 'classic',
    description: 'The classic board game. Jump your opponent and try to king your pieces!',
    color: '#bf360c',
    embedUrl: 'https://cardgames.io/checkers/',
    icon: '🏁',
  },
  {
    slug: '2048',
    title: '2048',
    category: 'numbers',
    description: 'Slide numbered tiles on a grid to combine them and create a tile with the number 2048.',
    color: '#f9a825',
    embedUrl: 'https://play2048.co/',
    icon: '🔢',
  },
  {
    slug: 'civiballs',
    title: 'Civiballs',
    category: 'logic',
    description: 'Cut the chains to drop the balls into the matching colored pots. Ancient puzzles await!',
    color: '#8d6e63',
    embedUrl: 'https://www.miniplay.com/embed/civiballs',
    icon: '⛓️',
  },
];

export function getGameBySlug(slug: string): CoolmathGame | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getGamesByCategory(category: string): CoolmathGame[] {
  if (category === 'all') return GAMES;
  return GAMES.filter((g) => g.category === category);
}
