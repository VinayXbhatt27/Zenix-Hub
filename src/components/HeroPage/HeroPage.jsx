import { useEffect, useState } from "react";
import styles from "./HeroPage.module.css";
import Orb from "./Orb";

// Firebase imports
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";

const Icon = {
  Sparkles: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.8 4.8L18 8.6l-4.2 1.8L12 15l-1.8-4.6L6 8.6l4.2-1.8L12 2z" fill="currentColor" opacity=".95" />
      <path d="M5 14l.9 2.4L8 17.3l-2.1.9L5 20l-.9-1.8L2 17.3l2.1-.9L5 14z" fill="currentColor" opacity=".75" />
      <path d="M19 13l.9 2.4L22 16.3l-2.1.9L19 20l-.9-1.8L16 16.3l2.1-.9L19 13z" fill="currentColor" opacity=".75" />
    </svg>
  ),
  Bot: ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="7" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="12" r="1.3" fill="currentColor" />
      <circle cx="15" cy="12" r="1.3" fill="currentColor" />
      <path d="M12 3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.2" fill="currentColor" />
      <path d="M7 19h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  Image: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path d="M7 17l4-4 3 3 3-3 0 7H7z" fill="currentColor" />
    </svg>
  ),
  Brain: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 4.5a3 3 0 00-3 3V9a3 3 0 00-3 3c0 1.7 1.3 3 3 3h.5a3 3 0 003 3h1v-16h-1.5z"
        fill="currentColor"
        opacity=".85"
      />
      <path
        d="M14.5 4.5a3 3 0 013 3V9a3 3 0 013 3c0 1.7-1.3 3-3 3h-.5a3 3 0 01-3 3h-1v-16h1.5z"
        fill="currentColor"
        opacity=".85"
      />
    </svg>
  ),
  Message: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a2 2 0 012 2v6a2 2 0 01-2 2H9l-5 4V8a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
      <circle cx="13" cy="11" r="1" fill="currentColor" />
      <circle cx="17" cy="11" r="1" fill="currentColor" />
    </svg>
  ),
  Zap: ({ size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M13 2L4 14h7l-1 8 10-14h-7l1-6z" fill="currentColor" />
    </svg>
  ),
};

// … aiAgents and features remain the same …

export default function HeroPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % aiAgents.length), 6000);
    return () => clearInterval(t);
  }, []);

  // 🔑 Google Sign-in handler (popup works on desktop + mobile)
  const handleGetStarted = async () => {
    try {
      await signInWithPopup(auth, googleProvider); // ✅ popup for all devices
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLearnMore = () => {
    window?.scrollTo?.({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <div className={styles.heroContainer}>
      <div
        style={{
          width: "100%",
          height: window.innerWidth <= 768 ? "500px" : "700px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Orb
          hoverIntensity={3}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
          showContent={true}
          onGetStarted={handleGetStarted} // ✅ works on mobile + desktop
          onLearnMore={handleLearnMore}
        />
      </div>

      <div className={styles.contentWrapper}>
        {/* … Carousel and Features Section remain unchanged … */}
      </div>
    </div>
  );
}
