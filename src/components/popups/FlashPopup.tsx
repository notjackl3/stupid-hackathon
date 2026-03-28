interface FlashPopupProps {
  onClose: () => void;
}

export function FlashPopup({ onClose }: FlashPopupProps) {
  return (
    <div className="bg-white border-2 border-gray-400 shadow-2xl rounded w-[400px] select-none">
      <div className="bg-gradient-to-r from-[#333] to-[#555] text-white py-1 px-3 flex items-center justify-between">
        <span className="text-sm">Adobe Flash Player</span>
        <button onClick={onClose} className="text-white hover:text-gray-300 font-bold text-lg leading-none cursor-pointer">&#10005;</button>
      </div>
      <div className="p-6 text-center">
        <div className="flex justify-center mb-4">
          {/* Flash Player icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-[#cc0000] to-[#990000] rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl font-bold italic">f</span>
          </div>
        </div>
        <div className="text-base font-medium text-[#333] mb-2">
          Adobe Flash Player is required
        </div>
        <p className="text-sm text-gray-500 mb-4">
          This content requires the Adobe Flash Player plugin.<br />
          Click below to download the latest version.
        </p>
        <div className="bg-[#fff3cd] border border-[#ffc107] rounded p-2 mb-4 text-xs text-[#856404]">
          &#9888; Flash Player is essential for the modern web experience.
        </div>
        <button
          onClick={onClose}
          className="bg-[#cc0000] text-white px-6 py-2 rounded hover:bg-[#aa0000] cursor-pointer"
        >
          Download Flash Player
        </button>
        <div className="text-[10px] text-gray-400 mt-3">
          Adobe Flash Player version 23.0.0.185
        </div>
      </div>
    </div>
  );
}
