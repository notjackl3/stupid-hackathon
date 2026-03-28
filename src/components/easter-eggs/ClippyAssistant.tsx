import { useState, useEffect, useMemo } from 'react';

interface ClippyAssistantProps {
  onDismiss: () => void;
}

const CLIPPY_MESSAGES = [
  "It looks like you're trying to browse the internet! Would you like help?",
  "I see you're using Google. Did you know Bing is a thing? No? That's fair.",
  "Did you know? The internet has over 1 billion websites! Most of them are spam.",
  "Pro tip: Try searching 'Google' on Google. See what happens!",
  "It looks like you're procrastinating! Would you like me to help you procrastinate more efficiently?",
  "Fun fact: In 2016, the top Google search was 'Pokemon GO.' That's the world you live in.",
  "I see you haven't updated Flash Player today. Just kidding, it'll ask you 47 more times.",
  "Have you tried turning it off and on again?",
  "You should really sign up for Google+. Everyone's doing it. (No one is doing it.)",
];

export function ClippyAssistant({ onDismiss }: ClippyAssistantProps) {
  const [visible, setVisible] = useState(false);
  const message = useMemo(() => CLIPPY_MESSAGES[Math.floor(Math.random() * CLIPPY_MESSAGES.length)], []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-[150] flex items-end gap-2 transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(100px)',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Speech bubble */}
      <div className="bg-[#ffffcc] border-2 border-[#333] rounded-lg p-3 max-w-[280px] shadow-lg relative">
        <button
          onClick={onDismiss}
          className="absolute -top-2 -right-2 bg-white border border-gray-400 rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-red-500 cursor-pointer shadow"
        >
          &#10005;
        </button>
        <p className="text-sm text-[#333]">{message}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onDismiss}
            className="bg-[#e0e0e0] text-xs px-2 py-0.5 rounded border border-gray-400 hover:bg-gray-300 cursor-pointer"
          >
            Go away
          </button>
          <button
            onClick={onDismiss}
            className="bg-[#e0e0e0] text-xs px-2 py-0.5 rounded border border-gray-400 hover:bg-gray-300 cursor-pointer"
          >
            Don't help
          </button>
        </div>
        {/* Speech bubble arrow */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#ffffcc] border-r-2 border-b-2 border-[#333] rotate-45" />
      </div>

      {/* Clippy */}
      <div className="text-5xl animate-bounce" style={{ animationDuration: '2s' }}>
        &#128206;
      </div>
    </div>
  );
}
