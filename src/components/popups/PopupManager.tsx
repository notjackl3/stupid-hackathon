import { useState, useCallback, useEffect, useRef } from 'react';
import type { PopupType } from '../../types';
import { AdPopup } from './AdPopup';
import { FlashPopup } from './FlashPopup';
import { VirusWarning } from './VirusWarning';

interface PopupInstance {
  id: number;
  type: PopupType;
  variant?: 'winner' | 'singles' | 'ram';
  x: number;
  y: number;
}

interface PopupManagerProps {
  triggerCount: number; // Increments on each navigation to trigger popup logic
}

const AD_VARIANTS: Array<'winner' | 'singles' | 'ram'> = ['winner', 'singles', 'ram'];

function randomPosition(): { x: number; y: number } {
  return {
    x: 50 + Math.floor(Math.random() * (window.innerWidth - 500)),
    y: 50 + Math.floor(Math.random() * (window.innerHeight - 400)),
  };
}

function randomPopup(): PopupInstance {
  const types: PopupType[] = ['ad', 'ad', 'flash', 'virus', 'ram'];
  const type = types[Math.floor(Math.random() * types.length)];
  const pos = randomPosition();

  return {
    id: Date.now() + Math.random(),
    type,
    variant: type === 'ad' ? AD_VARIANTS[Math.floor(Math.random() * AD_VARIANTS.length)] : undefined,
    ...pos,
  };
}

export function PopupManager({ triggerCount }: PopupManagerProps) {
  const [popups, setPopups] = useState<PopupInstance[]>([]);
  const [dragging, setDragging] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
  const lastTrigger = useRef(0);

  // 30% chance of popup on navigation
  useEffect(() => {
    if (triggerCount === lastTrigger.current) return;
    lastTrigger.current = triggerCount;

    if (triggerCount < 2) return; // Skip first 2 navigations

    const timer = window.setTimeout(() => {
      if (Math.random() < 0.3 && popups.length < 3) {
        setPopups((prev) => [...prev, randomPopup()]);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [triggerCount, popups.length]);

  const closePopup = useCallback((id: number) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const spawnNew = useCallback(() => {
    if (popups.length < 4) {
      setPopups((prev) => [...prev, randomPopup()]);
    }
  }, [popups.length]);

  const handleMouseDown = useCallback((id: number, e: React.MouseEvent<HTMLDivElement>) => {
    const popup = popups.find((p) => p.id === id);
    if (!popup) return;
    setDragging({
      id,
      offsetX: e.clientX - popup.x,
      offsetY: e.clientY - popup.y,
    });
  }, [popups]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPopups((prev) =>
      prev.map((p) =>
        p.id === dragging.id
          ? { ...p, x: e.clientX - dragging.offsetX, y: e.clientY - dragging.offsetY }
          : p
      )
    );
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  if (popups.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ pointerEvents: dragging ? 'auto' : 'none' }}
    >
      {popups.map((popup) => (
        <div
          key={popup.id}
          className="absolute pointer-events-auto"
          style={{ left: popup.x, top: popup.y }}
          onMouseDown={(e) => handleMouseDown(popup.id, e)}
        >
          {popup.type === 'ad' && (
            <AdPopup
              variant={popup.variant ?? 'winner'}
              onClose={() => closePopup(popup.id)}
              onSpawnNew={spawnNew}
            />
          )}
          {popup.type === 'flash' && (
            <FlashPopup onClose={() => closePopup(popup.id)} />
          )}
          {(popup.type === 'virus' || popup.type === 'ram') && (
            <VirusWarning
              onClose={() => closePopup(popup.id)}
              onSpawnNew={spawnNew}
            />
          )}
        </div>
      ))}
    </div>
  );
}
