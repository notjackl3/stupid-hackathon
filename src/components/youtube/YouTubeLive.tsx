import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from 'react';
import { YouTubeLogo } from './YouTubeLogo';

interface YouTubeLiveProps {
  onSearch: (query: string) => void;
  onHome: () => void;
}

interface ChatMessage {
  id: number;
  username: string;
  text: string;
  color: string;
  badge?: string;
}

const USERNAMES = [
  'xXDarkSlayer2016Xx', 'HarambeForever', 'DamnDaniel420', 'BottleFlipKing',
  'PokemonGoTrainer', 'DabOnEmHaters', 'VineIsLife', 'pepe_the_frog',
  'triggered_liberal', 'MakeMemesGreat', 'Netflix_And_Chill', 'Damn_Daniel',
  'WhipAndNaeNae', 'CashMeOutside', 'FidgetMaster', 'MLGProSniper',
  'SpongebobMemes', 'TrumpTrain2016', 'FeelTheBern420', 'illuminati_confirmed',
  'deez_nuts_lol', 'RickRoll_Expert', 'JohnCena_Invisible', 'dat_boi_waddup',
  'harambe_rip', '21_savage_fan', 'doge_much_wow', 'swag_yolo_360',
  'le_epic_troll', 'SaltBae2016', 'CroppingKing', 'Kappa123',
  'PogChamp42', 'MonkaS_Andy', 'ResidentSleeper', 'BibleThump99',
  'TriHard7', 'LUL_Master', 'Jebaited_Again', '4Head_Larry',
];

const CHAT_MESSAGES = [
  'POGGERS', 'LUL', 'Kappa', 'monkaS', 'PogChamp', 'ResidentSleeper',
  'BibleThump', 'Jebaited', '4Head', 'TriHard 7', 'haHAA',
  'OMEGALUL', 'EZ Clap', 'FeelsBadMan', 'FeelsGoodMan',
  'dicks out for harambe', 'RIP HARAMBE', 'F', 'F in the chat',
  'FFFFFFFF', 'damn daniel', 'back at it again with the white vans',
  'what are thooooose', 'cash me outside how bout dat',
  'is this 2016??', 'wait this is live???', 'yo is that really them',
  'hi mom!!!', 'first!!!!', 'SUB HYPE', 'LETS GOOOOO',
  'W', 'L', 'this stream is fire', 'bruh moment',
  'can we get some Fs in the chat', 'spam Kappa if you agree',
  'WHO DID THIS 😂😂😂', 'IM DYING 💀💀', 'LMAOOOOO',
  'obama was still president btw', 'vine was still alive btw',
  'pokemon go to the polls', 'ken bone 2016', 'dabbing intensifies',
  'bottle flip challenge!!', 'whip and nae nae', 'juju on that beat',
  'running man challenge', 'mannequin challenge',
  'pen pineapple apple pen', 'PPAP PPAP PPAP',
  'does anyone play clash royale', 'overwatch is so good',
  'anyone else watching from school?', 'my mom is behind me act normal',
  'MODS', 'BAN HIM', 'TIMEOUT', 'monkaW', 'D:',
  'THIS IS SO SCUFFED LMAO', 'CONTENT', 'REAL',
  'yo chat am i shadow banned??', 'type 1 if youre alive',
  '1', '1', '1', '1', '1', '1',
  '!raffle', '!giveaway', '!points', '!lurk',
  'just subbed lets go', 'GIFTED SUB POGGERS', 'HYPE TRAIN',
  'TwitchUnity', 'GlitchCat', 'bleedPurple',
];

const USERNAME_COLORS = [
  '#FF4500', '#00FF7F', '#1E90FF', '#FF69B4', '#FFD700',
  '#9400D3', '#00CED1', '#FF6347', '#7CFC00', '#FF1493',
  '#00BFFF', '#FF8C00', '#ADFF2F', '#DC143C', '#00FA9A',
];

const BADGES = ['👑', '⭐', '🗡️', '💎', '🔥', '', '', '', '', '', '', ''];

let messageIdCounter = 0;

function generateMessage(): ChatMessage {
  const username = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
  const text = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
  const color = USERNAME_COLORS[Math.floor(Math.random() * USERNAME_COLORS.length)];
  const badge = BADGES[Math.floor(Math.random() * BADGES.length)];
  return { id: messageIdCounter++, username, text, color, badge: badge || undefined };
}

export function YouTubeLive({ onSearch, onHome }: YouTubeLiveProps) {
  const [searchInput, setSearchInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    Array.from({ length: 20 }, () => generateMessage())
  );
  const [viewerCount, setViewerCount] = useState(
    () => 1200 + Math.floor(Math.random() * 3000)
  );
  const chatRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const streamRef = useRef<MediaStream | null>(null);

  // Start webcam
  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        if (!cancelled) setCameraError(true);
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // Auto-generate chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const burstSize = Math.random() < 0.15 ? Math.floor(Math.random() * 4) + 2 : 1;
      const newMsgs = Array.from({ length: burstSize }, () => generateMessage());
      setMessages((prev) => [...prev.slice(-(100 - burstSize)), ...newMsgs]);
    }, 300 + Math.random() * 700);

    return () => clearInterval(interval);
  }, []);

  // Fluctuate viewer count
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const delta = Math.floor(Math.random() * 50) - 20;
        return Math.max(500, prev + delta);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const msg: ChatMessage = {
      id: messageIdCounter++,
      username: 'You',
      text: chatInput.trim(),
      color: '#9146FF',
      badge: '👤',
    };
    setMessages((prev) => [...prev.slice(-99), msg]);
    setChatInput('');
  }, [chatInput]);

  return (
    <div className="min-h-full bg-[#0e0e10]">
      {/* YouTube Header */}
      <div className="bg-[#cc181e] h-[50px] flex items-center px-4 gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-white text-xl cursor-pointer">&#9776;</span>
          <div className="flex items-center cursor-pointer" onClick={onHome}>
            <YouTubeLogo variant="white" />
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-[530px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="flex-1 px-3 py-1.5 border border-[#999] rounded-l text-sm outline-none"
            />
            <button
              onClick={() => searchInput.trim() && onSearch(searchInput.trim())}
              className="bg-[#e9e9e9] border border-l-0 border-[#999] px-5 rounded-r text-[#666] hover:bg-[#ddd] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-white text-sm border border-white/50 px-3 py-1 rounded hover:bg-white/10 cursor-pointer">
            Upload
          </button>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-sm cursor-pointer">
            U
          </div>
        </div>
      </div>

      {/* Live content */}
      <div className="flex h-[calc(100vh-50px)]">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          {/* Camera feed */}
          <div className="relative bg-black flex items-center justify-center" style={{ height: '70%' }}>
            {cameraError ? (
              <div className="text-white text-center">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-lg">Camera not available</p>
                <p className="text-sm text-gray-400 mt-2">
                  Please allow camera access to go live
                </p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            )}

            {/* LIVE badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="bg-[#cc181e] text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
              <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                {viewerCount.toLocaleString()} watching
              </div>
            </div>

            {/* Stream title overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-white text-lg font-bold">
                🔴 LIVE - Streaming from 2016!!! (NOT CLICKBAIT)
              </h2>
              <p className="text-gray-300 text-sm mt-1">
                YouTuber2016 &middot; Started streaming 2 hours ago
              </p>
            </div>
          </div>

          {/* Stream info below video */}
          <div className="bg-[#18181b] p-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#cc181e] flex items-center justify-center text-white font-bold">
                Y
              </div>
              <div>
                <div className="text-white font-medium">YouTuber2016</div>
                <div className="text-gray-400 text-sm">
                  {(viewerCount * 3 + 12847).toLocaleString()} subscribers
                </div>
              </div>
              <button className="ml-4 bg-[#cc181e] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#b31217] cursor-pointer">
                SUBSCRIBE
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              {['IRL', '2016', 'Live', 'Nostalgic'].map((tag) => (
                <span
                  key={tag}
                  className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chat sidebar */}
        <div className="w-[340px] bg-[#18181b] border-l border-[#2f2f35] flex flex-col">
          {/* Chat header */}
          <div className="h-[42px] border-b border-[#2f2f35] flex items-center justify-between px-3">
            <span className="text-white text-sm font-semibold">Live Chat</span>
            <div className="flex items-center gap-2">
              <span className="text-[#adadb8] text-xs">
                {viewerCount.toLocaleString()} viewers
              </span>
              <button className="text-[#adadb8] hover:text-white cursor-pointer">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm leading-relaxed hover:bg-[#26262c] px-1 py-0.5 rounded">
                {msg.badge && (
                  <span className="mr-1 text-xs">{msg.badge}</span>
                )}
                <span className="font-semibold" style={{ color: msg.color }}>
                  {msg.username}
                </span>
                <span className="text-[#efeff1]">: {msg.text}</span>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-[#2f2f35] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                placeholder="Send a message"
                className="flex-1 bg-[#2f2f35] text-white text-sm px-3 py-2 rounded outline-none placeholder-[#adadb8] focus:ring-1 focus:ring-[#9146FF]"
              />
              <button
                onClick={handleChatSend}
                className="bg-[#9146FF] text-white px-3 py-2 rounded text-sm font-medium hover:bg-[#772ce8] cursor-pointer"
              >
                Chat
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-[#adadb8]">
              <span>Slow mode: Off</span>
              <span>Emotes only: Off</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
