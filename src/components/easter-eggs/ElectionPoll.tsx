import { useState, useCallback, useEffect } from 'react';

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
  "BREAKING: New poll asks:",
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
        {/* Neck */}
        <line x1="50" y1="0" x2="50" y2="18" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        {/* Body */}
        <line x1="50" y1="18" x2="50" y2="90" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        {/* Tie */}
        <polygon points="50,18 44,42 50,48 56,42" fill={tieColor} />
        {/* Arms */}
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
        {/* Legs */}
        <line x1="50" y1="90" x2="25" y2="155" stroke="#333" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="90" x2="75" y2="155" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function ElectionPoll({ onDismiss }: ElectionPollProps) {
  const [voted, setVoted] = useState(false);
  const [winner, setWinner] = useState('');
  const [showBreaking, setShowBreaking] = useState(false);
  const [questionIdx] = useState(() => Math.floor(Math.random() * POLL_QUESTIONS.length));
  const [pairIdx] = useState(() => Math.floor(Math.random() * OPTION_PAIRS.length));
  const [trumpSpeaking, setTrumpSpeaking] = useState(true);
  const [trumpQuote] = useState(() => TRUMP_QUOTES[Math.floor(Math.random() * TRUMP_QUOTES.length)]);
  const [hillaryQuote] = useState(() => HILLARY_QUOTES[Math.floor(Math.random() * HILLARY_QUOTES.length)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrumpSpeaking(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const question = POLL_QUESTIONS[questionIdx];
  const [optionA, optionB] = OPTION_PAIRS[pairIdx];

  const handleVote = useCallback((choice: string) => {
    setVoted(true);
    setWinner(choice);
    setShowBreaking(true);
    setTimeout(() => {
      setShowBreaking(false);
      onDismiss?.();
    }, 4000);
  }, [onDismiss]);

  if (showBreaking) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
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
            padding: '20px 40px',
            borderBottom: '4px solid #cc0000',
          }}>
            <div style={{
              background: '#cc0000',
              color: 'white',
              padding: '4px 16px',
              fontWeight: 'bold',
              fontSize: '13px',
              display: 'inline-block',
              marginBottom: '10px',
            }}>
              CNN PROJECTION
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              fontFamily: 'Georgia, serif',
            }}>
              {winner.toUpperCase()} WINS
            </div>
            <div style={{
              fontSize: '14px',
              opacity: 0.7,
              marginTop: '6px',
              fontFamily: 'Georgia, serif',
            }}>
              AMERICA HAS SPOKEN — {Math.floor(Math.random() * 30 + 50)}% to {Math.floor(Math.random() * 20 + 30)}%
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  if (voted) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9998,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      pointerEvents: 'auto',
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

      {/* Poll question + voting at top center */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
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
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          }}>
            🗳️ {question}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => handleVote(optionA)}
            style={{
              background: '#002868',
              color: 'white',
              border: '3px solid white',
              padding: '10px 28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {optionA}
          </button>

          <span style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            fontFamily: 'Georgia, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            VS
          </span>

          <button
            onClick={() => handleVote(optionB)}
            style={{
              background: '#BF0A30',
              color: 'white',
              border: '3px solid white',
              padding: '10px 28px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Georgia, serif',
              textTransform: 'uppercase',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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
