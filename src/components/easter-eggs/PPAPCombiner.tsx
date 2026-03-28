import { useState, useCallback } from 'react';

interface PPAPCombinerProps {
  onCombine: (combined: string) => void;
  onCancel: () => void;
}

const ITEMS_A = ['🖊️ Pen', '🍍 Pineapple', '🍎 Apple', '📱 Phone', '💾 File', '🔍 Search', '🐦 Tweet'];
const ITEMS_B = ['🍍 Pineapple', '🍎 Apple', '🖊️ Pen', '📧 Email', '📁 Folder', '🔗 Link', '💬 Comment'];

export function PPAPCombiner({ onCombine, onCancel }: PPAPCombinerProps) {
  const [itemA, setItemA] = useState<string | null>(null);
  const [itemB, setItemB] = useState<string | null>(null);
  const [combined, setCombined] = useState(false);
  const [dancing, setDancing] = useState(false);

  const handleCombine = useCallback(() => {
    if (!itemA || !itemB) return;
    setDancing(true);
    setTimeout(() => {
      setCombined(true);
      setTimeout(() => {
        onCombine(`${itemA} + ${itemB}`);
      }, 1500);
    }, 2000);
  }, [itemA, itemB, onCombine]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10001,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #fff9c4, #fff)',
        borderRadius: '12px',
        padding: '24px',
        width: '400px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '3px solid #f9a825',
      }}>
        <h3 style={{
          margin: '0 0 4px',
          fontSize: '18px',
          color: '#333',
        }}>
          🎵 PPAP File Manager 🎵
        </h3>
        <p style={{
          color: '#666',
          fontSize: '12px',
          margin: '0 0 20px',
          fontStyle: 'italic',
        }}>
          You must combine two items to proceed!
        </p>

        {dancing ? (
          <div style={{
            fontSize: '64px',
            animation: 'ppapDance 0.5s ease-in-out infinite alternate',
            margin: '20px 0',
          }}>
            {combined ? (
              <span>
                {itemA?.split(' ')[0]}{itemB?.split(' ')[0]}
                <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 'bold', marginTop: '8px' }}>
                  ✨ {itemA?.split(' ').slice(1).join(' ')}-{itemB?.split(' ').slice(1).join(' ')}! ✨
                </div>
              </span>
            ) : (
              '🕺'
            )}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            {/* Item A selection */}
            <div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>I have a...</p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {ITEMS_A.map(item => (
                  <button
                    key={item}
                    onClick={() => setItemA(item)}
                    style={{
                      padding: '4px 12px',
                      background: itemA === item ? '#f9a825' : 'white',
                      color: itemA === item ? 'white' : '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textAlign: 'left',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Plus sign */}
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f9a825' }}>+</div>

            {/* Item B selection */}
            <div>
              <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>I have a...</p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                {ITEMS_B.map(item => (
                  <button
                    key={item}
                    onClick={() => setItemB(item)}
                    style={{
                      padding: '4px 12px',
                      background: itemB === item ? '#f9a825' : 'white',
                      color: itemB === item ? 'white' : '#333',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      textAlign: 'left',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!dancing && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={handleCombine}
              disabled={!itemA || !itemB}
              style={{
                padding: '8px 24px',
                background: itemA && itemB ? '#f9a825' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: itemA && itemB ? 'pointer' : 'default',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              🎵 UGH! Combine!
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#666',
                fontSize: '13px',
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes ppapDance {
          from { transform: rotate(-10deg) scale(1); }
          to { transform: rotate(10deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
