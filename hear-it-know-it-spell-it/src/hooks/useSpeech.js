import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Wraps the Web Speech API (SpeechSynthesis).
 * No API key, no network — built into the browser.
 *
 * @param {string} word  The word to speak.
 * @returns {{ speak, isSpeaking, isReady }}
 *   speak()     — play the word aloud (safe to call any time)
 *   isSpeaking  — true while the utterance is playing
 *   isReady     — true once voices have loaded (use to gate the audio button)
 */
export function useSpeech(word) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const voicesRef = useRef([]);

  // Load voices. Chrome fires voiceschanged; Firefox/Safari populate synchronously.
  useEffect(() => {
    function loadVoices() {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        voicesRef.current = available;
        setIsReady(true);
      }
    }

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Cancel any in-flight speech when the word changes.
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [word]);

  // Cancel on unmount.
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(() => {
    if (!word) return;

    // Cancel anything already playing before starting a new utterance.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.85;   // slightly slower so every syllable is clear
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Prefer a Google or Natural voice; fall back to any en-US voice, then default.
    const voices = voicesRef.current;
    const preferred =
      voices.find((v) => /google/i.test(v.name) && v.lang === 'en-US') ||
      voices.find((v) => /natural/i.test(v.name) && v.lang === 'en-US') ||
      voices.find((v) => v.lang === 'en-US') ||
      voices.find((v) => v.lang.startsWith('en')) ||
      null;

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [word]);

  return { speak, isSpeaking, isReady };
}
