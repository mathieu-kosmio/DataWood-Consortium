export function createScore(button) {
  const track = new Audio('./assets/audio/datawood-score.mp3');
  track.loop = true; track.preload = 'metadata'; track.volume = 0;
  let enabled = true, playing = false, target = 0, failed = false;
  function label() { button.textContent = failed ? 'Musique indisponible' : enabled ? 'Musique : activée' : 'Musique : coupée'; button.setAttribute('aria-pressed', String(enabled && !failed)); }
  function start() { if (enabled && playing && !failed && track.paused) track.play().catch(() => { failed=true; label(); }); }
  track.onerror = () => { failed=true; track.pause(); label(); };
  button.onclick = () => { enabled=!enabled; if (!enabled) { track.pause(); track.volume=0; } else start(); label(); };
  label();
  return {
    setPlaying(value) { playing=value; if(value) start(); else { track.pause(); track.volume=0; } },
    reset() { track.currentTime=0; },
    render(dt, speaking) {
      target=playing && enabled && !failed ? speaking ? .09 : .22 : 0;
      const next = track.volume + (target-track.volume)*(1-Math.exp(-dt*2.5));
      track.volume = Math.min(1, Math.max(0, next));
    },
  };
}
