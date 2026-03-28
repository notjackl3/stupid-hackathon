import { useState, useCallback, useEffect } from 'react';

interface DialupOverlayProps {
  onDismiss: () => void;
}

export function DialupOverlay({ onDismiss }: DialupOverlayProps) {
  const [dots, setDots] = useState('');
  const [status, setStatus] = useState('Initializing modem...');

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    const timer1 = setTimeout(() => setStatus('Dialing...'), 1500);
    const timer2 = setTimeout(() => setStatus('Connecting to ISP...'), 3000);
    const timer3 = setTimeout(() => setStatus('Authenticating...'), 4500);
    const timer4 = setTimeout(() => setStatus('Connected! Welcome to the World Wide Web.'), 6000);

    return () => {
      clearInterval(dotTimer);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const handleClick = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="text-green-400 font-mono text-center">
        <pre className="text-xs mb-8 text-green-600 opacity-60">
{`
 ____   ___  __  __
|___ \\ / _ \\/ / / /_
  __) | | | / /_/ __ \\
 / __/| |_| \\__ \\ (_) |
|_____|\\___/|___/\\___/

 INTERNET TIME MACHINE
`}
        </pre>

        <div className="text-lg mb-4">
          <span className="text-yellow-400">&#9742;</span> {status}{status.includes('Connected') ? '' : dots}
        </div>

        {/* Fake modem indicators */}
        <div className="flex gap-8 mb-8 text-xs text-green-600">
          <span>TX: &#9608;&#9608;&#9608;&#9601;&#9601;</span>
          <span>RX: &#9608;&#9601;&#9608;&#9608;&#9601;</span>
          <span>CD: ON</span>
          <span>56K</span>
        </div>

        <div className="text-sm text-green-300 animate-pulse">
          Click anywhere to enter 2016
        </div>
      </div>
    </div>
  );
}
