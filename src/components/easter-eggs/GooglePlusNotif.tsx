import { useState } from 'react';

export function GooglePlusNotif() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-16 right-4 z-[120] bg-white border border-gray-300 rounded-lg shadow-xl w-[300px] select-none">
      <div className="bg-[#d34836] text-white px-3 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">g+</span>
          <span className="text-sm">Google+</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white hover:text-red-200 text-lg leading-none cursor-pointer"
        >
          &#10005;
        </button>
      </div>
      <div className="p-4">
        <div className="text-sm text-[#333] mb-2">
          <span className="font-bold">You have 0 new circles!</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Connect with friends, family, and that one person from middle school you forgot existed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setDismissed(true)}
            className="bg-[#d34836] text-white text-xs px-3 py-1.5 rounded hover:bg-[#b13a2e] cursor-pointer"
          >
            Join Google+
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            No thanks (for the 100th time)
          </button>
        </div>
      </div>
    </div>
  );
}
