interface AdPopupProps {
  variant: 'winner' | 'singles' | 'ram';
  onClose: () => void;
  onSpawnNew: () => void;
}

export function AdPopup({ variant, onClose, onSpawnNew }: AdPopupProps) {
  const handleFakeClose = () => {
    // Clicking the wrong area spawns a new popup!
    onSpawnNew();
  };

  if (variant === 'winner') {
    return (
      <div className="bg-gradient-to-b from-[#ffcc00] to-[#ff9900] border-4 border-[#ff6600] shadow-2xl rounded p-0 w-[420px] select-none">
        <div className="bg-[#ff0000] text-white text-center py-1 px-2 flex items-center justify-between">
          <span className="text-sm font-bold">&#127881; CONGRATULATIONS!!! &#127881;</span>
          <button onClick={onClose} className="text-white hover:text-yellow-200 font-bold text-lg leading-none cursor-pointer">&#10005;</button>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-[#cc0000] mb-2 animate-pulse">
            &#127881; YOU ARE THE 1,000,000th VISITOR! &#127881;
          </div>
          <p className="text-sm mb-3">Click OK to claim your FREE iPad Mini!</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleFakeClose}
              className="bg-[#00cc00] text-white font-bold px-6 py-2 rounded shadow hover:bg-[#00aa00] cursor-pointer"
            >
              OK! CLAIM PRIZE!
            </button>
            <button
              onClick={handleFakeClose}
              className="bg-[#cc0000] text-white font-bold px-4 py-2 rounded shadow hover:bg-[#aa0000] cursor-pointer"
            >
              No Thanks
            </button>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">*Terms and conditions apply. Prize may be a virus.</p>
        </div>
      </div>
    );
  }

  if (variant === 'singles') {
    return (
      <div className="bg-white border-2 border-[#e91e63] shadow-2xl rounded w-[350px] select-none">
        <div className="bg-[#e91e63] text-white py-1 px-3 flex items-center justify-between">
          <span className="text-sm">&#128149; Local Matches</span>
          <button onClick={onClose} className="text-white hover:text-pink-200 font-bold text-lg leading-none cursor-pointer">&#10005;</button>
        </div>
        <div className="p-4 text-center">
          <div className="text-lg font-bold text-[#e91e63] mb-2">
            Hot Singles in Your Area! &#128293;
          </div>
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocINlBUVcPutS2-B0LiRmB32lN6bfhjxaBZmyNQyLL7-oN0EukAc=s300-c"
            alt=""
            className="w-20 h-20 mx-auto rounded-full mb-3 object-cover"
          />
          <p className="text-sm text-gray-600 mb-3">3 people nearby want to meet you!</p>
          <button
            onClick={handleFakeClose}
            className="bg-[#e91e63] text-white px-6 py-2 rounded-full hover:bg-[#c2185b] cursor-pointer"
          >
            See Who's Interested
          </button>
        </div>
      </div>
    );
  }

  // variant === 'ram'
  return (
    <div className="bg-[#f0f0f0] border-2 border-[#0078d7] shadow-2xl rounded w-[380px] select-none">
      <div className="bg-gradient-to-r from-[#0078d7] to-[#00a4ef] text-white py-1 px-3 flex items-center justify-between">
        <span className="text-sm">&#128190; System Utility</span>
        <button onClick={onClose} className="text-white hover:text-blue-200 font-bold text-lg leading-none cursor-pointer">&#10005;</button>
      </div>
      <div className="p-4 text-center">
        <div className="text-xl font-bold text-[#0078d7] mb-2">
          &#128190; Download More RAM &#128190;
        </div>
        <div className="bg-white border border-gray-300 rounded p-3 mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Current RAM:</span>
            <span className="text-red-500 font-bold">4 GB (LOW!)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>After download:</span>
            <span className="text-green-500 font-bold">32 GB (FAST!)</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded h-4 mb-3">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded animate-pulse" style={{ width: '67%' }} />
        </div>
        <button
          onClick={handleFakeClose}
          className="bg-[#0078d7] text-white px-6 py-2 rounded hover:bg-[#005a9e] cursor-pointer"
        >
          &#9889; Download 28 GB FREE RAM &#9889;
        </button>
      </div>
    </div>
  );
}
