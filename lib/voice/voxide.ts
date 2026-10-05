// lib/voice/voxide.ts
// Smallest interface contract for Person A's Voxide voice client.
// Minimal interface stub to satisfy typechecking. Owned by Person A.

export interface VoiceListenOptions {
  language: "en" | "am";
  onResult: (text: string) => void;
  onError: (err: string) => void;
  onEnd: () => void;
}

export interface VoiceClient {
  isSupported(): boolean;
  startListening(options: VoiceListenOptions): void;
  stopListening(): void;
  speak(text: string, language: "en" | "am", onEnd?: () => void): void;
  stopSpeaking(): void;
}

export const voiceClient: VoiceClient = {
  isSupported() {
    return typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  },
  startListening(options: VoiceListenOptions) {
    // Stub implementation for frontend contract
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      options.onError("Speech recognition not supported in this browser");
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = options.language === "am" ? "am-ET" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        options.onResult(transcript);
      };
      recognition.onerror = (event: any) => {
        options.onError(event.error || "Speech recognition error");
      };
      recognition.onend = () => {
        options.onEnd();
      };
      recognition.start();
    } catch (err: any) {
      options.onError(err?.message || "Failed to start voice recognition");
    }
  },
  stopListening() {
    // Stub
  },
  speak(text: string, language: "en" | "am", onEnd?: () => void) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      onEnd?.();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "am" ? "am-ET" : "en-US";
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  },
  stopSpeaking() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },
};
