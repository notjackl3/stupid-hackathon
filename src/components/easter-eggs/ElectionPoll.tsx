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

const TRUMP_QUOTES = [
  "We're gonna make the internet great again!",
  "Wrong. WRONG!",
  "Nobody knows more about memes than me.",
  "Believe me, it's gonna be HUGE.",
  "This is a disaster. Total disaster.",
  "I have the best words.",
  "You're fired!",
];

const HILLARY_QUOTES = [
  "When they go low, we go high.",
  "That's just not true, Donald.",
  "I have 30 years of experience.",
  "Delete your account.",
  "Pokémon GO to the polls!",
  "I'm with her... I mean, me.",
  "That's a debunked conspiracy.",
];

type Phase = 'voting' | 'results' | 'breaking';

function StickFigure({ side, speaking }: { side: 'left' | 'right'; speaking: boolean }) {
  const isTrump = side === 'left';
  const headImg = isTrump ? '/trump.png' : '/hillary.png';
  const tieColor = isTrump ? '#cc0000' : '#1a5dab';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      <img
        src={headImg}
        alt=""
        style={{
          width: '120px',
          height: '120px',
          objectFit: 'cover',
          animation: speaking
            ? 'headShake 0.15s ease-in-out infinite alternate'
            : 'headIdle 2s ease-in-out infinite',
          transformOrigin: 'bottom center',
        }}
      />
      <svg width="100" height="160" viewBox="0 0 100 160" style={{ marginTop: '-4px' }}>
        <line x1="50" y1="0" x2="50" y2="18" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="18" x2="50" y2="90" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <polygon points="50,18 44,42 50,48 56,42" fill={tieColor} />
        {speaking ? (
          <>
            <line x1="50" y1="34" x2={isTrump ? 90 : 10} y2="14"
              stroke="#333" strokeWidth="4" strokeLinecap="round"
              style={{ animation: 'armWave 0.3s ease-in-out infinite alternate' }} />
            <line x1="50" y1="34" x2={isTrump ? 10 : 90} y2="48"
              stroke="#333" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1="50" y1="34" x2="15" y2="70" stroke="#333" strokeWidth="4" strokeLinecap="round" />
            <line x1="50" y1="34" x2="85" y2="70" stroke="#333" strokeWidth="4" strokeLinecap="round" />
          </>
        )}
        <line x1="50" y1="90" x2="25" y2="155" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="90" x2="75" y2="155" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ElectionPoll({ onDismiss }: ElectionPollProps) {
  const [phase, setPhase] = useState<Phase>('voting');
  const [questionIdx] = useState(() => Math.floor(Math.random() * POLL_QUESTIONS.length));
  const [pairIdx] = useState(() => Math.floor(Math.random() * OPTION_PAIRS.length));
  const [trumpSpeaking, setTrumpSpeaking] = useState(true);
  const [trumpQuote] = useState(() => TRUMP_QUOTES[Math.floor(Math.random() * TRUMP_QUOTES.length)]);
  const [hillaryQuote] = useState(() => HILLARY_QUOTES[Math.floor(Math.random() * HILLARY_QUOTES.length)]);
  const [votesA, setVotesA] = useState(0);
  const [votesB, setVotesB] = useState(0);
  const [winner, setWinner] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  const question = POLL_QUESTIONS[questionIdx];
  const [optionA, optionB] = OPTION_PAIRS[pairIdx];

  // Generate a unique topic for this voting session
  const [topic] = useState(() => `election2016-${Math.random().toString(36).slice(2, 10)}`);

  // Build the QR URL — replace localhost with the real network IP so phones can reach it
  const [networkOrigin, setNetworkOrigin] = useState(window.location.origin);

  useEffect(() => {
    // Use WebRTC to discover local network IP
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

  // Alternate who's speaking
  useEffect(() => {
    const interval = setInterval(() => {
      setTrumpSpeaking(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to votes via ntfy.sh SSE
  useEffect(() => {
    const es = new EventSource(`https://ntfy.sh/${topic}/sse`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message) {
          const parsed = JSON.parse(data.message);
          if (parsed.vote === optionA) {
            setVotesA(prev => prev + 1);
          } else if (parsed.vote === optionB) {
            setVotesB(prev => prev + 1);
          }
        }
      } catch {
        // ignore parse errors
      }
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [topic, optionA, optionB]);

  // Host can also vote directly
  const hostVote = useCallback((choice: 'a' | 'b') => {
    if (choice === 'a') setVotesA(prev => prev + 1);
    else setVotesB(prev => prev + 1);
  }, []);

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

  // Breaking news
  if (phase === 'breaking') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        animation: 'fadeIn 0.3s ease-out',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(to right, #cc0000, #990000)',
            color: 'white',
            padding: '8px 40px',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            borderBottom: '4px solid #ff0000',
          }}>
            ⚡ BREAKING NEWS ⚡
          </div>
          <div style={{
            background: '#1a1a2e',
            color: 'white',
            padding: '24px 48px',
            borderBottom: '4px solid #cc0000',
          }}>
            <div style={{
              background: '#cc0000',
              padding: '4px 16px',
              fontWeight: 'bold',
              fontSize: '13px',
              display: 'inline-block',
              marginBottom: '12px',
            }}>
              CNN PROJECTION
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
            }}>
              {winner.toUpperCase()} WINS
            </div>
            <div style={{
              fontSize: '16px',
              opacity: 0.7,
              marginTop: '8px',
              fontFamily: 'Georgia, serif',
            }}>
              {pctA}% to {pctB}% — {totalVotes} votes cast
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </div>
    );
  }

  // Results reveal
  if (phase === 'results') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
      }}>
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗳️</div>
          <div style={{
            color: 'white',
            fontSize: '28px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
          }}>
            THE VOTES ARE IN...
          </div>
        </div>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  // Voting phase
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
      {/* Close button */}
      <button
        onClick={onDismiss}
        style={{
          position: 'absolute',
          right: '16px',
          top: '16px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '20px',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      {/* Top center: Question + QR + Vote bar + End button */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
      }}>
        {/* Question */}
        <div style={{
          background: 'linear-gradient(135deg, #002868, #BF0A30)',
          padding: '12px 32px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          <span style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Georgia, serif',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            🗳️ {question}
          </span>
        </div>

        {/* QR Code */}
        <div style={{
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}>
          <QRCodeSVG value={voteUrl} size={140} level="L" />
          <span style={{
            fontSize: '11px',
            color: '#666',
            fontFamily: 'Georgia, serif',
          }}>
            Scan to vote!
          </span>
        </div>

        {/* Live vote tally bar */}
        <div style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'white',
            fontSize: '14px',
            fontFamily: 'Georgia, serif',
            fontWeight: 'bold',
          }}>
            <span>{optionA}: {votesA}</span>
            <span style={{ opacity: 0.6, fontSize: '12px' }}>{totalVotes} votes</span>
            <span>{optionB}: {votesB}</span>
          </div>
          <div style={{
            height: '24px',
            borderRadius: '4px',
            overflow: 'hidden',
            display: 'flex',
            border: '2px solid white',
          }}>
            <div style={{
              width: `${pctA}%`,
              background: '#002868',
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: 'white',
              fontWeight: 'bold',
              minWidth: totalVotes > 0 ? '30px' : '50%',
            }}>
              {totalVotes > 0 ? `${pctA}%` : ''}
            </div>
            <div style={{
              width: `${pctB}%`,
              background: '#BF0A30',
              transition: 'width 0.5s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              color: 'white',
              fontWeight: 'bold',
              minWidth: totalVotes > 0 ? '30px' : '50%',
            }}>
              {totalVotes > 0 ? `${pctB}%` : ''}
            </div>
          </div>
        </div>

        {/* Host voting + End button */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => hostVote('a')}
            style={{
              background: '#002868',
              color: 'white',
              border: '2px solid white',
              padding: '8px 20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              borderRadius: '4px',
            }}
          >
            {optionA}
          </button>

          <button
            onClick={endVoting}
            style={{
              background: '#333',
              color: '#FFD700',
              border: '2px solid #FFD700',
              padding: '8px 20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '13px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              borderRadius: '4px',
              letterSpacing: '1px',
            }}
          >
            🔔 End Voting
          </button>

          <button
            onClick={() => hostVote('b')}
            style={{
              background: '#BF0A30',
              color: 'white',
              border: '2px solid white',
              padding: '8px 20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              borderRadius: '4px',
            }}
          >
            {optionB}
          </button>
        </div>
      </div>

      {/* Trump — bottom left */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: '8%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
      }}>
        <StickFigure side="left" speaking={trumpSpeaking} />
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
          padding: '10px 14px',
          maxWidth: '180px',
          fontSize: '13px',
          color: '#333',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          marginBottom: '120px',
          opacity: trumpSpeaking ? 1 : 0.3,
          transition: 'opacity 0.3s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          "{trumpQuote}"
          <div style={{
            position: 'absolute',
            left: '-8px',
            bottom: '16px',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '8px solid rgba(255,255,255,0.95)',
          }} />
        </div>
      </div>

      {/* Hillary — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        right: '8%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
          padding: '10px 14px',
          maxWidth: '180px',
          fontSize: '13px',
          color: '#333',
          fontFamily: 'Georgia, serif',
          position: 'relative',
          marginBottom: '120px',
          opacity: !trumpSpeaking ? 1 : 0.3,
          transition: 'opacity 0.3s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}>
          "{hillaryQuote}"
          <div style={{
            position: 'absolute',
            right: '-8px',
            bottom: '16px',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid rgba(255,255,255,0.95)',
          }} />
        </div>
        <StickFigure side="right" speaking={!trumpSpeaking} />
      </div>

      <style>{`
        @keyframes headShake {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(8deg); }
        }
        @keyframes headIdle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes armWave {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
