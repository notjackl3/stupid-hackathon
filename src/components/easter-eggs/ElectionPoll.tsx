import { useState, useCallback, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ElectionPollProps {
  onDismiss?: () => void;
}

const POLL_QUESTIONS = [
  "Which site is better?",
  "Best meme of 2016?",
  "Who would win in a fight?",
  "Which is more important?",
  "America's real choice:",
  "The people demand answers:",
  "Tonight's debate topic:",
];

const OPTION_PAIRS = [
  ["Google", "Bing"],
  ["Harambe", "Cecil the Lion"],
  ["Vine", "Musical.ly"],
  ["iPhone 7", "Galaxy Note 7"],
  ["Netflix and Chill", "Actually Watching Netflix"],
  ["Dabbing", "Whipping"],
  ["Pokémon GO", "Going Outside"],
  ["Trump", "Hillary"],
  ["Mannequin Challenge", "Ice Bucket Challenge"],
  ["Water Bottle Flip", "Fidget Spinner"],
  ["YouTube Red", "YouTube Free"],
  ["Twitter", "Facebook"],
];

type Phase = 'voting' | 'results' | 'breaking';

export function ElectionPoll({ onDismiss }: ElectionPollProps) {
  const [phase, setPhase] = useState<Phase>('voting');
  const [questionIdx] = useState(() => Math.floor(Math.random() * POLL_QUESTIONS.length));
  const [pairIdx] = useState(() => Math.floor(Math.random() * OPTION_PAIRS.length));
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [winner, setWinner] = useState('');
  const [timer, setTimer] = useState(30);
  const eventSourceRef = useRef<EventSource | null>(null);

  const question = POLL_QUESTIONS[questionIdx];
  const [optionA, optionB] = OPTION_PAIRS[pairIdx];

  const [topic] = useState(() => `election2016-${Math.random().toString(36).slice(2, 10)}`);
  const [networkOrigin, setNetworkOrigin] = useState(window.location.origin);

  useEffect(() => {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      const match = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
      if (match && match[1] !== '0.0.0.0') {
        const ip = match[1];
        const port = window.location.port;
        setNetworkOrigin(`http://${ip}${port ? ':' + port : ''}`);
        pc.close();
      }
    };
    return () => { pc.close(); };
  }, []);

  const voteUrl = `${networkOrigin}/vote.html?t=${topic}&q=${encodeURIComponent(question)}&a=${encodeURIComponent(optionA)}&b=${encodeURIComponent(optionB)}`;

  // Countdown timer
  useEffect(() => {
    if (phase !== 'voting') return;
    if (timer <= 0) {
      endVoting();
      return;
    }
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, phase]);

  // Subscribe to votes via ntfy.sh SSE
  useEffect(() => {
    const es = new EventSource(`https://ntfy.sh/${topic}/sse`);
    eventSourceRef.current = es;
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          const parsed = JSON.parse(data.message);
          if (parsed.vote === optionA) setVotesA((prev) => prev + 1);
          else if (parsed.vote === optionB) setVotesB((prev) => prev + 1);
        }
      } catch { /* ignore */ }
    };
    return () => { es.close(); eventSourceRef.current = null; };
  }, [topic, optionA, optionB]);

  const hostVote = useCallback((choice: 'a' | 'b') => {
    if (choice === 'a') setVotesA((prev) => prev + 1);
    else setVotesB((prev) => prev + 1);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endVoting = useCallback(() => {
    eventSourceRef.current?.close();
    const w = votesA >= votesB ? optionA : optionB;
    setWinner(w);
    setPhase('results');
    setTimeout(() => {
      setPhase('breaking');
      setTimeout(() => onDismiss?.(), 4000);
    }, 2000);
  }, [votesA, votesB, optionA, optionB, onDismiss]);

  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const pctB = totalVotes > 0 ? 100 - pctA : 50;
  const answersCount = totalVotes;

  // ── Breaking news ──
  if (phase === 'breaking') {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/80">
        <div className="text-center animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-gradient-to-r from-red-700 to-red-900 text-white px-10 py-2 text-sm font-bold tracking-[4px] uppercase border-b-4 border-red-500">
            BREAKING NEWS
          </div>
          <div className="bg-[#1a1a2e] text-white px-12 py-6 border-b-4 border-red-700">
            <div className="bg-red-700 px-4 py-1 font-bold text-sm inline-block mb-3">CNN PROJECTION</div>
            <div className="text-4xl font-bold font-serif">{winner.toUpperCase()} WINS</div>
            <div className="text-base opacity-70 mt-2 font-serif">{pctA}% to {pctB}% — {totalVotes} votes cast</div>
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  // ── Results reveal ──
  if (phase === 'results') {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70">
        <div className="text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="text-5xl mb-3">🗳️</div>
          <div className="text-white text-3xl font-serif font-bold">THE VOTES ARE IN...</div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }`}</style>
      </div>
    );
  }

  // ── Voting phase — Kahoot-style ──
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col" style={{ background: '#46178f', fontFamily: "'Montserrat', Arial, sans-serif" }}>
      {/* Close button */}
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 text-white text-lg flex items-center justify-center cursor-pointer hover:bg-black/50"
      >
        ✕
      </button>

      {/* Top bar — question + timer */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-white/60 text-sm font-bold">{answersCount} Answers</div>
        <div className="text-white text-lg font-bold tracking-wide uppercase">{question}</div>
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
          {timer}
        </div>
      </div>

      {/* Middle — QR code + live bar */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* QR */}
        <div className="flex flex-col items-center gap-2">
          <QRCodeSVG value={voteUrl} size={180} level="L" fgColor="white" bgColor="transparent" />
          <span className="text-white/80 text-sm font-bold">Scan to vote!</span>
        </div>

        {/* Live vote bar */}
        <div className="w-[500px] max-w-[90vw]">
          <div className="flex justify-between text-white text-sm font-bold mb-1">
            <span>{optionA}: {votesA}</span>
            <span className="opacity-60">{totalVotes} votes</span>
            <span>{optionB}: {votesB}</span>
          </div>
          <div className="h-8 rounded-lg overflow-hidden flex bg-white/20">
            <div
              className="flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{ width: `${pctA}%`, background: '#e21b3c', minWidth: totalVotes > 0 ? 40 : '50%' }}
            >
              {totalVotes > 0 ? `${pctA}%` : ''}
            </div>
            <div
              className="flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{ width: `${pctB}%`, background: '#1368ce', minWidth: totalVotes > 0 ? 40 : '50%' }}
            >
              {totalVotes > 0 ? `${pctB}%` : ''}
            </div>
          </div>
        </div>

        {/* End voting */}
        <span
          onClick={endVoting}
          className="text-white/50 text-sm font-bold cursor-pointer hover:text-white/80 underline uppercase tracking-wider"
        >
          End Voting
        </span>
      </div>

      {/* Bottom — two big vote buttons, Kahoot-style split with stickmen */}
      <div className="flex h-[260px]">
        {/* Left option — red */}
        <button
          onClick={() => hostVote('a')}
          className="flex-1 flex items-end justify-center cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] relative overflow-hidden"
          style={{ background: '#e21b3c' }}
        >
          <div className="text-white text-4xl font-bold absolute inset-0 flex items-center justify-center drop-shadow-lg z-10 pointer-events-none">{optionA}</div>
          <div className="flex flex-col items-center mb-0" style={{ animation: 'walkLeftRight 2s ease-in-out infinite alternate' }}>
            <img src="/trump.png" alt="" className="w-32 h-32 object-cover" style={{ animation: 'headShake 0.4s ease-in-out infinite alternate' }} />
            <svg width="80" height="140" viewBox="0 0 80 140" className="mt-[-2px]">
              <line x1="40" y1="0" x2="40" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="14" x2="40" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <polygon points="40,14 36,34 40,38 44,34" fill="#ff6b6b" />
              <line x1="40" y1="28" x2="10" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" style={{ animation: 'armWaveL 0.6s ease-in-out infinite alternate' }} />
              <line x1="40" y1="28" x2="72" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round" style={{ animation: 'armWaveR 0.8s ease-in-out infinite alternate' }} />
              <line x1="40" y1="75" x2="22" y2="135" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="75" x2="58" y2="135" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </button>

        {/* Right option — blue */}
        <button
          onClick={() => hostVote('b')}
          className="flex-1 flex items-end justify-center cursor-pointer transition-all hover:brightness-110 active:scale-[0.98] relative overflow-hidden"
          style={{ background: '#1368ce' }}
        >
          <div className="text-white text-4xl font-bold absolute inset-0 flex items-center justify-center drop-shadow-lg z-10 pointer-events-none">{optionB}</div>
          <div className="flex flex-col items-center mb-0" style={{ animation: 'walkLeftRight 2.3s ease-in-out infinite alternate-reverse' }}>
            <img src="/hillary.png" alt="" className="w-32 h-32 object-cover" style={{ animation: 'headShake 0.5s ease-in-out infinite alternate-reverse' }} />
            <svg width="80" height="140" viewBox="0 0 80 140" className="mt-[-2px]">
              <line x1="40" y1="0" x2="40" y2="14" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="14" x2="40" y2="75" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="28" x2="8" y2="40" stroke="white" strokeWidth="3" strokeLinecap="round" style={{ animation: 'armWaveR 0.7s ease-in-out infinite alternate' }} />
              <line x1="40" y1="28" x2="70" y2="12" stroke="white" strokeWidth="3" strokeLinecap="round" style={{ animation: 'armWaveL 0.5s ease-in-out infinite alternate' }} />
              <line x1="40" y1="75" x2="22" y2="135" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <line x1="40" y1="75" x2="58" y2="135" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes headShake {
          0% { transform: rotate(-10deg) translateX(-4px); }
          100% { transform: rotate(10deg) translateX(4px); }
        }
        @keyframes armWaveL {
          0% { transform: rotate(-10deg); }
          100% { transform: rotate(10deg); }
        }
        @keyframes armWaveR {
          0% { transform: rotate(8deg); }
          100% { transform: rotate(-8deg); }
        }
        @keyframes walkLeftRight {
          0% { transform: translateX(-60px); }
          100% { transform: translateX(60px); }
        }
      `}</style>
    </div>
  );
}
