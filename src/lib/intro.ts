declare global {
  interface Window {
    __introDone?: boolean;
  }
}

const EVENT = "intro:done";

export function finishIntro() {
  window.__introDone = true;
  window.dispatchEvent(new Event(EVENT));
}

/** Roda `callback` quando a intro terminar (ou já, se ela já terminou). */
export function onIntroDone(callback: () => void) {
  if (window.__introDone) {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}
