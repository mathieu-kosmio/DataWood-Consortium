import { recordings } from './recordings.js';
// Local ElevenLabs recordings: playback never sends the API key or text to a service.
export function createNarrator(onStatus) {
  let enabled = true, busy = false, generation = 0, key = '', audio = null;
  const status = () => onStatus(enabled, enabled ? 'Voix : ElevenLabs' : 'Voix : désactivée');
  function pause() { audio?.pause(); busy = false; }
  function cancel() { generation++; pause(); key = ''; audio = null; }
  function playCurrent(token) {
    busy = true;
    audio.play().catch(() => {
      if (token !== generation) return;
      busy = false; enabled = false; onStatus(false, 'Activer la voix');
    });
  }
  function speak(_text, nextKey) {
    if (!enabled) return;
    if (key === nextKey) {
      if (audio?.paused && !audio.ended) playCurrent(generation);
      return;
    }
    cancel(); key = nextKey;
    if (!recordings[nextKey]) { enabled = false; onStatus(false, 'Audio indisponible'); return; }
    const token = generation;
    audio = new Audio(recordings[nextKey]);
    audio.onended = () => { if (token === generation) busy = false; };
    audio.onerror = () => {
      if (token !== generation) return;
      pause(); enabled = false; onStatus(false, 'Audio indisponible');
    };
    playCurrent(token);
  }
  status();
  return {
    speak, pause, cancel,
    get busy() { return busy; },
    get enabled() { return enabled; },
    toggle() { cancel(); enabled = !enabled; status(); },
  };
}
