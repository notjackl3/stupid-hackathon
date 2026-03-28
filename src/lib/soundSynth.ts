const audioCache = new Map<string, HTMLAudioElement>();

export function playSound(soundUrl: string): void {
  const cached = audioCache.get(soundUrl);
  if (cached) {
    cached.currentTime = 0;
    cached.play();
    return;
  }

  const audio = new Audio(soundUrl);
  audioCache.set(soundUrl, audio);
  audio.play();
}
