interface VirusWarningProps {
  onClose: () => void;
  onSpawnNew: () => void;
  onVirusClick?: () => void;
  floodMode?: boolean;
}

export function VirusWarning({ onClose, onSpawnNew, onVirusClick, floodMode }: VirusWarningProps) {
  function handleButtonClick(cb: () => void) {
    onVirusClick?.();
    cb();
  }
  return (
    <div className="bg-[#f0f0f0] border-2 border-[#cc0000] shadow-2xl rounded w-[420px] select-none">
      {/* Windows XP style title bar */}
      <div className="bg-gradient-to-r from-[#cc0000] to-[#ff3333] text-white py-1 px-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-yellow-300">&#9888;</span>
          <span className="text-sm font-bold">Windows Security Alert</span>
        </div>
        <button onClick={() => handleButtonClick(onClose)} className="text-white hover:text-red-200 font-bold text-lg leading-none cursor-pointer">&#10005;</button>
      </div>
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <span className="text-4xl">&#9888;&#65039;</span>
          <div>
            <div className="text-base font-bold text-[#cc0000] mb-1">
              Your PC may be at risk!
            </div>
            <p className="text-sm text-gray-700">
              Windows has detected <span className="font-bold text-red-600">47 viruses</span> on your computer.
              Your personal data and banking information may be compromised.
            </p>
          </div>
        </div>

        {/* Fake scan results */}
        <div className="bg-white border border-gray-300 rounded p-3 mb-3 text-xs font-mono">
          <div className="text-red-500">&#10008; Trojan.Win32.Generic — CRITICAL</div>
          <div className="text-red-500">&#10008; Worm.Harambe.2016 — HIGH RISK</div>
          <div className="text-orange-500">&#10008; Adware.PokemonGO.Fake — MEDIUM</div>
          <div className="text-red-500">&#10008; Ransomware.BottleFlip — CRITICAL</div>
          <div className="text-gray-400">... and 43 more threats detected</div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleButtonClick(onSpawnNew)}
            className="bg-[#cc0000] text-white px-5 py-2 rounded hover:bg-[#aa0000] font-bold cursor-pointer"
          >
            &#128274; Fix Now (Recommended)
          </button>
          <button
            onClick={() => handleButtonClick(onSpawnNew)}
            className="bg-gray-200 text-gray-600 px-4 py-2 rounded hover:bg-gray-300 cursor-pointer"
          >
            Remind Me Later
          </button>
        </div>
        {floodMode && (
          <p className="text-[10px] text-red-600 mt-2 text-center font-bold animate-pulse">
            &#9888; CRITICAL: VIRUS SPREADING... &#9888;
          </p>
        )}

        <p className="text-[10px] text-gray-400 mt-2 text-center">
          Windows Defender 2016 &middot; Totally Real Microsoft Software
        </p>
      </div>
    </div>
  );
}
