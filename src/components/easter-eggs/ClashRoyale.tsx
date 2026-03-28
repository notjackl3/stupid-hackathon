import { useState, useEffect, useCallback, useRef } from 'react';

interface ClashRoyaleProps {
  onDismiss: () => void;
}

interface Card {
  id: string;
  name: string;
  emoji: string;
  image?: string;
  cost: number;
  hp: number;
  damage: number;
  speed: number; // pixels per tick
  range: number; // attack range in pixels
  attackSpeed: number; // ticks between attacks
  isSpell?: boolean;
  spellRadius?: number;
  color: string;
}

interface DeployedTroop {
  id: string;
  card: Card;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  team: 'player' | 'enemy';
  targetId: string | null;
  lastAttackTick: number;
  deployTick: number;
}

interface Tower {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  team: 'player' | 'enemy';
  type: 'king' | 'princess';
  damage: number;
  range: number;
  lastAttackTick: number;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  tick: number;
}

const CARD_DEFS: Card[] = [
  { id: 'giant', name: 'Giant', emoji: '🟤', image: '/giant.webp', cost: 5, hp: 200, damage: 12, speed: 0.8, range: 20, attackSpeed: 20, color: '#8B4513' },
  { id: 'musketeer', name: 'Musketeer', emoji: '🔫', image: '/musketeer.webp', cost: 4, hp: 80, damage: 18, speed: 1.0, range: 80, attackSpeed: 15, color: '#FF69B4' },
  { id: 'knight', name: 'Knight', emoji: '⚔️', image: '/knight.webp', cost: 3, hp: 120, damage: 14, speed: 1.2, range: 18, attackSpeed: 12, color: '#4169E1' },
  { id: 'archer', name: 'Archer', emoji: '🏹', image: '/ArchersCardOld.webp', cost: 3, hp: 50, damage: 10, speed: 1.1, range: 70, attackSpeed: 10, color: '#FF1493' },
  { id: 'hog', name: 'Hog Rider', emoji: '🐗', image: '/hog.webp', cost: 4, hp: 110, damage: 16, speed: 2.0, range: 18, attackSpeed: 14, color: '#FF8C00' },
  { id: 'skeleton', name: 'Skeletons', emoji: '💀', image: '/skeleton.webp', cost: 1, hp: 20, damage: 8, speed: 1.5, range: 14, attackSpeed: 8, color: '#F5F5DC' },
  { id: 'wizard', name: 'Wizard', emoji: '🧙', image: '/wizard.webp', cost: 5, hp: 70, damage: 22, speed: 1.0, range: 70, attackSpeed: 18, color: '#9400D3' },
  { id: 'prince', name: 'Prince', emoji: '🐴', image: '/prince.webp', cost: 5, hp: 130, damage: 20, speed: 1.6, range: 18, attackSpeed: 14, color: '#FFD700' },
  { id: 'fireball', name: 'Fireball', emoji: '🔥', cost: 4, hp: 0, damage: 60, speed: 0, range: 0, attackSpeed: 0, isSpell: true, spellRadius: 40, color: '#FF4500' },
  { id: 'arrows', name: 'Arrows', emoji: '➡️', image: '/arrows.webp', cost: 3, hp: 0, damage: 35, speed: 0, range: 0, attackSpeed: 0, isSpell: true, spellRadius: 55, color: '#32CD32' },
  { id: 'minipekka', name: 'Mini P.E.K.K.A', emoji: '🤖', image: '/mini.webp', cost: 4, hp: 100, damage: 28, speed: 1.2, range: 16, attackSpeed: 18, color: '#1E90FF' },
  { id: 'goblin', name: 'Goblins', emoji: '👺', image: '/goblins.webp', cost: 2, hp: 35, damage: 11, speed: 1.6, range: 14, attackSpeed: 9, color: '#32CD32' },
];

const ARENA_WIDTH = 340;
const ARENA_HEIGHT = 500;
const BRIDGE_LEFT_X = 55;
const BRIDGE_RIGHT_X = 285;
const RIVER_Y = 275;

function shuffleDeck(): Card[] {
  const shuffled = [...CARD_DEFS].sort(() => Math.random() - 0.5);
  return shuffled;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

let troopIdCounter = 0;
let floatIdCounter = 0;

export function ClashRoyale({ onDismiss }: ClashRoyaleProps) {
  const [deck] = useState<Card[]>(() => shuffleDeck());
  const [hand, setHand] = useState<Card[]>(() => deck.slice(0, 4));
  const [nextCardIndex, setNextCardIndex] = useState(4);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [elixir, setElixir] = useState(5);
  const [enemyElixir, setEnemyElixir] = useState(5);
  const [troops, setTroops] = useState<DeployedTroop[]>([]);
  const [towers, setTowers] = useState<Tower[]>(() => [
    { id: 'p-king', x: 170, y: 475, hp: 300, maxHp: 300, team: 'player', type: 'king', damage: 12, range: 80, lastAttackTick: 0 },
    { id: 'p-left', x: 70, y: 420, hp: 180, maxHp: 180, team: 'player', type: 'princess', damage: 10, range: 90, lastAttackTick: 0 },
    { id: 'p-right', x: 270, y: 420, hp: 180, maxHp: 180, team: 'player', type: 'princess', damage: 10, range: 90, lastAttackTick: 0 },
    { id: 'e-king', x: 170, y: 25, hp: 300, maxHp: 300, team: 'enemy', type: 'king', damage: 12, range: 80, lastAttackTick: 0 },
    { id: 'e-left', x: 70, y: 75, hp: 180, maxHp: 180, team: 'enemy', type: 'princess', damage: 10, range: 90, lastAttackTick: 0 },
    { id: 'e-right', x: 270, y: 75, hp: 180, maxHp: 180, team: 'enemy', type: 'princess', damage: 10, range: 90, lastAttackTick: 0 },
  ]);
  const [tick, setTick] = useState(0);
  const [gameTime, setGameTime] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'enemy' | 'draw' | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [spellEffects, setSpellEffects] = useState<{ x: number; y: number; radius: number; color: string; tick: number }[]>([]);

  const troopsRef = useRef(troops);
  const towersRef = useRef(towers);
  const tickRef = useRef(tick);
  const elixirRef = useRef(elixir);
  const enemyElixirRef = useRef(enemyElixir);
  troopsRef.current = troops;
  towersRef.current = towers;
  tickRef.current = tick;
  elixirRef.current = elixir;
  enemyElixirRef.current = enemyElixir;

  const addFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    setFloatingTexts(prev => [...prev, { id: floatIdCounter++, x, y, text, color, tick: tickRef.current }]);
  }, []);

  // Deploy a troop
  const deployTroop = useCallback((card: Card, x: number, y: number, team: 'player' | 'enemy') => {
    if (card.isSpell) {
      // Apply spell damage to all enemy troops and towers in radius
      const currentTroops = troopsRef.current;
      const currentTowers = towersRef.current;
      const enemyTeam = team === 'player' ? 'enemy' : 'player';

      setSpellEffects(prev => [...prev, { x, y, radius: card.spellRadius ?? 40, color: card.color, tick: tickRef.current }]);

      const updatedTroops = currentTroops.map(t => {
        if (t.team === enemyTeam && dist(t.x, t.y, x, y) <= (card.spellRadius ?? 40)) {
          addFloatingText(t.x, t.y, `-${card.damage}`, '#FF4444');
          return { ...t, hp: t.hp - card.damage };
        }
        return t;
      });
      setTroops(updatedTroops.filter(t => t.hp > 0));

      const updatedTowers = currentTowers.map(t => {
        if (t.team === enemyTeam && dist(t.x, t.y, x, y) <= (card.spellRadius ?? 40)) {
          addFloatingText(t.x, t.y, `-${card.damage}`, '#FF4444');
          return { ...t, hp: t.hp - card.damage };
        }
        return t;
      });
      setTowers(updatedTowers.filter(t => t.hp > 0));
      return;
    }

    const count = card.id === 'skeleton' ? 3 : card.id === 'goblin' ? 3 : card.id === 'archer' ? 2 : 1;
    const newTroops: DeployedTroop[] = [];
    for (let i = 0; i < count; i++) {
      const offsetX = count > 1 ? (i - (count - 1) / 2) * 16 : 0;
      const offsetY = count > 1 ? (i % 2) * 12 : 0;
      newTroops.push({
        id: `troop-${troopIdCounter++}`,
        card,
        x: x + offsetX,
        y: y + offsetY,
        hp: card.hp,
        maxHp: card.hp,
        team,
        targetId: null,
        lastAttackTick: 0,
        deployTick: tickRef.current,
      });
    }
    setTroops(prev => [...prev, ...newTroops]);
  }, [addFloatingText]);

  // Handle arena click for deployment
  const handleArenaClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedCard || gameOver) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * ARENA_WIDTH;
    const y = ((e.clientY - rect.top) / rect.height) * ARENA_HEIGHT;

    // Player can only deploy on their side (below river) unless spell
    if (!selectedCard.isSpell && y < RIVER_Y + 20) return;
    if (elixir < selectedCard.cost) return;

    setElixir(prev => prev - selectedCard.cost);
    deployTroop(selectedCard, x, y, 'player');

    // Replace card in hand
    setHand(prev => {
      const idx = prev.findIndex(c => c.id === selectedCard.id);
      if (idx === -1) return prev;
      const newHand = [...prev];
      newHand[idx] = deck[nextCardIndex % deck.length];
      return newHand;
    });
    setNextCardIndex(prev => prev + 1);
    setSelectedCard(null);
  }, [selectedCard, gameOver, elixir, deployTroop, deck, nextCardIndex]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1);

      // Elixir regen
      setElixir(prev => Math.min(10, prev + 0.05));
      setEnemyElixir(prev => Math.min(10, prev + 0.05));

      // Game timer
      setGameTime(prev => {
        const next = prev - 0.1;
        if (next <= 0) {
          setGameOver(true);
          // Determine winner by remaining tower HP
          const pTowers = towersRef.current.filter(t => t.team === 'player');
          const eTowers = towersRef.current.filter(t => t.team === 'enemy');
          const pHP = pTowers.reduce((s, t) => s + t.hp, 0);
          const eHP = eTowers.reduce((s, t) => s + t.hp, 0);
          if (pHP > eHP) setWinner('player');
          else if (eHP > pHP) setWinner('enemy');
          else setWinner('draw');
        }
        return Math.max(0, next);
      });

      // Clean up old floating texts
      setFloatingTexts(prev => prev.filter(f => tickRef.current - f.tick < 30));
      setSpellEffects(prev => prev.filter(f => tickRef.current - f.tick < 10));

      // Update troops
      setTroops(prevTroops => {
        const currentTowers = towersRef.current;
        const allTargets = [...prevTroops, ...currentTowers.map(t => ({ ...t, card: { speed: 0 } as Card }))];

        return prevTroops.map(troop => {
          const enemyTeam = troop.team === 'player' ? 'enemy' : 'player';

          // Find nearest enemy (troop or tower)
          let nearest: { x: number; y: number; id: string } | null = null;
          let nearestDist = Infinity;

          for (const target of allTargets) {
            const isEnemy = 'team' in target && target.team === enemyTeam;
            if (!isEnemy) continue;
            if ('hp' in target && target.hp <= 0) continue;
            const d = dist(troop.x, troop.y, target.x, target.y);
            if (d < nearestDist) {
              nearestDist = d;
              nearest = { x: target.x, y: target.y, id: target.id };
            }
          }

          if (!nearest) return troop;

          // Attack or move
          if (nearestDist <= troop.card.range) {
            // Attack
            if (tickRef.current - troop.lastAttackTick >= troop.card.attackSpeed) {
              return { ...troop, lastAttackTick: tickRef.current, targetId: nearest.id };
            }
            return { ...troop, targetId: nearest.id };
          } else {
            // Move toward target, respecting bridge paths
            let moveX = nearest.x - troop.x;
            let moveY = nearest.y - troop.y;

            // Bridge logic: if crossing river, guide toward nearest bridge
            const crossingRiver = (troop.team === 'player' && troop.y > RIVER_Y && nearest.y < RIVER_Y) ||
                                  (troop.team === 'enemy' && troop.y < RIVER_Y && nearest.y > RIVER_Y);

            if (crossingRiver && Math.abs(troop.y - RIVER_Y) < 30) {
              const nearestBridge = Math.abs(troop.x - BRIDGE_LEFT_X) < Math.abs(troop.x - BRIDGE_RIGHT_X)
                ? BRIDGE_LEFT_X : BRIDGE_RIGHT_X;
              if (Math.abs(troop.x - nearestBridge) > 10) {
                moveX = nearestBridge - troop.x;
                moveY = 0;
              }
            }

            const moveDist = Math.sqrt(moveX ** 2 + moveY ** 2);
            if (moveDist > 0) {
              return {
                ...troop,
                x: troop.x + (moveX / moveDist) * troop.card.speed,
                y: troop.y + (moveY / moveDist) * troop.card.speed,
              };
            }
          }
          return troop;
        });
      });

      // Process attacks - damage targets
      setTroops(prevTroops => {
        const damageMap: Record<string, number> = {};

        for (const troop of prevTroops) {
          if (troop.targetId && tickRef.current === troop.lastAttackTick) {
            damageMap[troop.targetId] = (damageMap[troop.targetId] ?? 0) + troop.card.damage;
          }
        }

        // Apply damage to troops
        const updatedTroops = prevTroops.map(t => {
          const dmg = damageMap[t.id];
          if (dmg) {
            return { ...t, hp: t.hp - dmg };
          }
          return t;
        });

        // Apply damage to towers
        setTowers(prevTowers => {
          return prevTowers.map(t => {
            const dmg = damageMap[t.id];
            if (dmg) {
              addFloatingText(t.x, t.y, `-${dmg}`, '#FF4444');
              return { ...t, hp: t.hp - dmg };
            }
            return t;
          }).filter(t => {
            if (t.hp <= 0) {
              addFloatingText(t.x, t.y, 'DESTROYED!', '#FF0000');
              // Check if king tower destroyed = game over
              if (t.type === 'king') {
                setGameOver(true);
                setWinner(t.team === 'enemy' ? 'player' : 'enemy');
              }
              return false;
            }
            return true;
          });
        });

        return updatedTroops.filter(t => {
          if (t.hp <= 0) {
            addFloatingText(t.x, t.y, '☠️', '#888');
            return false;
          }
          return true;
        });
      });

      // Tower attacks
      setTowers(prevTowers => {
        const currentTroops = troopsRef.current;
        return prevTowers.map(tower => {
          if (tickRef.current - tower.lastAttackTick < 15) return tower;

          const enemyTeam = tower.team === 'player' ? 'enemy' : 'player';
          let nearest: DeployedTroop | null = null;
          let nearestD = Infinity;
          for (const troop of currentTroops) {
            if (troop.team !== enemyTeam) continue;
            const d = dist(tower.x, tower.y, troop.x, troop.y);
            if (d < nearestD && d <= tower.range) {
              nearestD = d;
              nearest = troop;
            }
          }

          if (nearest) {
            setTroops(prev => prev.map(t => {
              if (t.id === nearest!.id) {
                addFloatingText(t.x, t.y, `-${tower.damage}`, '#FFAA00');
                return { ...t, hp: t.hp - tower.damage };
              }
              return t;
            }).filter(t => t.hp > 0));
            return { ...tower, lastAttackTick: tickRef.current };
          }
          return tower;
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver, addFloatingText]);

  // Enemy AI
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const eElixir = enemyElixirRef.current;
      const affordable = CARD_DEFS.filter(c => c.cost <= eElixir && !c.isSpell);
      if (affordable.length === 0) return;

      const card = affordable[Math.floor(Math.random() * affordable.length)];
      const lane = Math.random() < 0.5 ? BRIDGE_LEFT_X : BRIDGE_RIGHT_X;
      const x = lane + (Math.random() - 0.5) * 40;
      const y = 120 + Math.random() * 60;

      setEnemyElixir(prev => prev - card.cost);
      deployTroop(card, x, y, 'enemy');
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [gameOver, deployTroop]);

  // Enemy spell AI
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const eElixir = enemyElixirRef.current;
      const playerTroops = troopsRef.current.filter(t => t.team === 'player');
      if (playerTroops.length < 3 || eElixir < 3) return;

      // Find cluster of player troops
      let bestX = 170, bestY = 350;
      let bestCount = 0;
      for (const t of playerTroops) {
        const nearby = playerTroops.filter(o => dist(o.x, o.y, t.x, t.y) < 50).length;
        if (nearby > bestCount) {
          bestCount = nearby;
          bestX = t.x;
          bestY = t.y;
        }
      }
      if (bestCount >= 3) {
        const spell = Math.random() < 0.5 ? CARD_DEFS.find(c => c.id === 'fireball')! : CARD_DEFS.find(c => c.id === 'arrows')!;
        if (eElixir >= spell.cost) {
          setEnemyElixir(prev => prev - spell.cost);
          deployTroop(spell, bestX, bestY, 'enemy');
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [gameOver, deployTroop]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85" onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}>
      <div className="relative flex flex-col items-center" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="w-[340px] bg-gradient-to-r from-[#4a2] to-[#385] rounded-t-lg px-4 py-2 flex items-center justify-between">
          <div className="text-white font-bold text-lg" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: 1 }}>
            ⚔️ CLASH ROYALE
          </div>
          <div className="flex items-center gap-3">
            <span className="text-yellow-200 font-bold text-sm">{formatTime(gameTime)}</span>
            <button onClick={onDismiss} className="text-white/70 hover:text-white text-xl leading-none cursor-pointer">&times;</button>
          </div>
        </div>

        {/* Arena */}
        <div
          className="relative overflow-hidden cursor-crosshair select-none"
          style={{
            width: ARENA_WIDTH,
            height: ARENA_HEIGHT,
          }}
          onClick={handleArenaClick}
        >
          {/* Arena background image */}
          <img
            src="/clash.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Deployment zone indicator */}
          {selectedCard && !selectedCard.isSpell && (
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-white/30" style={{ top: RIVER_Y + 20 }} />
          )}

          {/* Towers */}
          {towers.map(tower => {
            const size = tower.type === 'king' ? 40 : 32;
            return (
              <div key={tower.id} className="absolute" style={{
                left: tower.x - size / 2,
                top: tower.y - size / 2,
                width: size,
              }}>
                {/* Invisible hitbox over the image tower */}
                <div style={{ width: size, height: size }} />
                {/* HP bar below tower */}
                <div className="h-[5px] bg-black/50 rounded-full overflow-hidden mt-0.5" style={{ width: size }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${(tower.hp / tower.maxHp) * 100}%`,
                      backgroundColor: tower.hp / tower.maxHp > 0.5 ? '#22c55e' : tower.hp / tower.maxHp > 0.25 ? '#eab308' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Troops */}
          {troops.map(troop => (
            <div
              key={troop.id}
              className="absolute transition-all duration-100"
              style={{
                left: troop.x - 10,
                top: troop.y - 10,
              }}
            >
              <div
                className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] border-2 overflow-hidden"
                style={{
                  backgroundColor: troop.card.image ? 'transparent' : troop.card.color,
                  borderColor: troop.team === 'player' ? '#3b82f6' : '#ef4444',
                  boxShadow: `0 0 4px ${troop.team === 'player' ? 'rgba(59,130,246,0.6)' : 'rgba(239,68,68,0.6)'}`,
                }}
              >
                {troop.card.image ? (
                  <img src={troop.card.image} alt={troop.card.name} className="w-full h-full object-cover" />
                ) : troop.card.emoji}
              </div>
              {/* Mini HP bar */}
              <div className="w-[20px] h-[3px] bg-black/40 rounded-full overflow-hidden mt-px">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(troop.hp / troop.maxHp) * 100}%`,
                    backgroundColor: troop.team === 'player' ? '#3b82f6' : '#ef4444',
                  }}
                />
              </div>
            </div>
          ))}

          {/* Spell effects */}
          {spellEffects.map((effect, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-ping"
              style={{
                left: effect.x - effect.radius,
                top: effect.y - effect.radius,
                width: effect.radius * 2,
                height: effect.radius * 2,
                backgroundColor: `${effect.color}33`,
                border: `2px solid ${effect.color}`,
              }}
            />
          ))}

          {/* Floating damage texts */}
          {floatingTexts.map(ft => (
            <div
              key={ft.id}
              className="absolute font-bold text-sm pointer-events-none"
              style={{
                left: ft.x - 15,
                top: ft.y - 15 - (tick - ft.tick) * 1.5,
                color: ft.color,
                opacity: Math.max(0, 1 - (tick - ft.tick) / 30),
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                fontSize: 12,
              }}
            >
              {ft.text}
            </div>
          ))}

          {/* Game over overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="text-4xl mb-2">
                {winner === 'player' ? '🏆' : winner === 'enemy' ? '💀' : '🤝'}
              </div>
              <div className="text-white text-2xl font-bold" style={{ fontFamily: 'Impact, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                {winner === 'player' ? 'VICTORY!' : winner === 'enemy' ? 'DEFEAT!' : 'DRAW!'}
              </div>
              <div className="text-white/70 text-sm mt-1">
                {winner === 'player'
                  ? 'You are the 2016 champion!'
                  : winner === 'enemy'
                    ? 'git gud scrub'
                    : 'perfectly balanced'}
              </div>
              <button
                onClick={onDismiss}
                className="mt-4 bg-[#4a2] text-white px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-[#5b3] text-sm"
              >
                Return to 2016
              </button>
            </div>
          )}
        </div>

        {/* Elixir bar + cards */}
        <div className="w-[340px] bg-[#1a1a2e] rounded-b-lg p-3">
          {/* Elixir bar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#e040fb] text-sm font-bold">{Math.floor(elixir)}</span>
            <div className="flex-1 h-[10px] bg-[#2a2a4e] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${(elixir / 10) * 100}%`,
                  background: 'linear-gradient(to right, #e040fb, #ab47bc)',
                }}
              />
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[6px] h-[10px] rounded-[1px]"
                  style={{ backgroundColor: i < Math.floor(elixir) ? '#e040fb' : '#2a2a4e' }}
                />
              ))}
            </div>
          </div>

          {/* Card hand */}
          <div className="flex gap-2 justify-center">
            {hand.map((card, i) => {
              const canAfford = elixir >= card.cost;
              const isSelected = selectedCard?.id === card.id;
              return (
                <div
                  key={`${card.id}-${i}`}
                  onClick={() => {
                    if (!gameOver && canAfford) {
                      setSelectedCard(isSelected ? null : card);
                    }
                  }}
                  className="relative cursor-pointer transition-all duration-150"
                  style={{
                    transform: isSelected ? 'translateY(-8px) scale(1.1)' : canAfford ? '' : 'grayscale(1)',
                    opacity: canAfford ? 1 : 0.5,
                  }}
                >
                  <div
                    className="w-[76px] h-[90px] rounded-lg flex items-center justify-center border-2 overflow-hidden"
                    style={{
                      background: isSelected
                        ? 'linear-gradient(to bottom, #fff3, #fff1)'
                        : 'linear-gradient(to bottom, #3a3a5e, #2a2a4e)',
                      borderColor: isSelected ? '#FFD700' : '#4a4a6e',
                    }}
                  >
                    {card.image ? (
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{card.emoji}</span>
                    )}
                    {/* Elixir cost */}
                    <div className="absolute -top-1.5 -right-1.5 w-[20px] h-[20px] rounded-full bg-[#e040fb] flex items-center justify-center text-white text-[11px] font-bold border border-[#ab47bc]">
                      {card.cost}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="text-center text-white/40 text-[10px] mt-2">
            {selectedCard ? `Tap arena to deploy ${selectedCard.name}` : 'Select a card, then tap the arena to deploy'}
          </div>
        </div>
      </div>
    </div>
  );
}
