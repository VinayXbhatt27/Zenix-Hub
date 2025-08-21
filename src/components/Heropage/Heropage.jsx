import { useEffect, useState } from "react"
import styles from "./HeroPage.module.css"
import Orb from "./Orb"

// Firebase imports
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth, googleProvider } from "../../firebase"

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
}

const aiAgents = [
  { id: 1, name: "Creative Writer", description: "Crafts compelling stories, articles, and creative content with human-like creativity.", icon: Icon.Sparkles, gradient: ["#a855f7", "#ec4899", "#ef4444"] },
  { id: 2, name: "Code Assistant", description: "Expert programming companion for debugging, optimization, and code generation.", icon: Icon.Bot, gradient: ["#3b82f6", "#06b6d4", "#14b8a6"] },
  { id: 3, name: "Image Generator", description: "Creates stunning visuals and artwork from text descriptions using advanced AI.", icon: Icon.Image, gradient: ["#10b981", "#14b8a6", "#06b6d4"] },
  { id: 4, name: "Data Analyst", description: "Processes and analyzes complex data to provide actionable insights.", icon: Icon.Brain, gradient: ["#6366f1", "#a855f7", "#ec4899"] },
  { id: 5, name: "Chat Companion", description: "Engaging conversational AI for natural, helpful, and friendly interactions.", icon: Icon.Message, gradient: ["#14b8a6", "#06b6d4", "#3b82f6"] },
  { id: 6, name: "Task Optimizer", description: "Streamlines workflows and automates repetitive tasks for maximum efficiency.", icon: Icon.Zap, gradient: ["#f59e0b", "#ef4444", "#ec4899"] },
]

const features = [
  { icon: Icon.Image, title: "Image Generation", description: "Create stunning visuals with our advanced AI image generation technology.", gradient: ["#10b981", "#06b6d4"] },
  { icon: Icon.Bot, title: "6 AI Models", description: "Specialized models for writing, coding, analysis, and more.", gradient: ["#3b82f6", "#7c3aed"] },
  { icon: Icon.Zap, title: "Lightning Fast", description: "Get instant responses and results with our optimized AI infrastructure.", gradient: ["#7c3aed", "#ec4899"] },
]

export default function HeroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % aiAgents.length), 6000)
    return () => clearInterval(t)
  }, [])

  // ✅ Handle login result after redirect (mobile)
  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        console.log("Logged in:", result.user)
      }
    }).catch((err) => console.error("Redirect login failed:", err))
  }, [])

  // 🔑 Google Sign-in handler
  const handleGetStarted = async () => {
    try {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        await signInWithRedirect(auth, googleProvider) // Mobile
      } else {
        await signInWithPopup(auth, googleProvider) // Desktop
      }
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  const handleLearnMore = () => {
    window?.scrollTo?.({ top: window.innerHeight, behavior: "smooth" })
  }

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
          onGetStarted={handleGetStarted}  // ✅ works on desktop + mobile
          onLearnMore={handleLearnMore}
        />
      </div>

      <div className={styles.contentWrapper}>
        {/* AI Agents Carousel */}
        <section className={styles.carouselSection} aria-label="AI Agents carousel">
          <h2 className={styles.carouselTitle}>Meet Your AI Agents</h2>

          <div className={styles.carouselContainer}>
            <div className={styles.carouselWrapper}>
              <div className={styles.carouselTrack} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {aiAgents.map((agent) => {
                  const IconCmp = agent.icon
                  return (
                    <div key={agent.id} className={styles.carouselSlide}>
                      <div className={styles.agentCard}>
                        <div className={styles.agentCardContent}>
                          <div
                            className={styles.agentIcon}
                            style={{
                              background: `linear-gradient(135deg, ${agent.gradient[0]}, ${agent.gradient[1]}, ${agent.gradient[2]})`,
                            }}
                            aria-hidden="true"
                          >
                            <IconCmp size={28} />
                          </div>
                          <div>
                            <h3 className={styles.agentName}>{agent.name}</h3>
                            <p className={styles.agentDescription}>{agent.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button className={`${styles.carouselButton} ${styles.carouselButtonLeft}`} onClick={() => setCurrentSlide((p) => (p - 1 + aiAgents.length) % aiAgents.length)} aria-label="Previous slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className={`${styles.carouselButton} ${styles.carouselButtonRight}`} onClick={() => setCurrentSlide((p) => (p + 1) % aiAgents.length)} aria-label="Next slide">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className={styles.carouselDots}>
              {aiAgents.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.carouselDot} ${i === currentSlide ? styles.carouselDotActive : styles.carouselDotInactive}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection} aria-label="Key features">
          {features.map((f, idx) => {
            const IconCmp = f.icon
            return (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureCardContent}>
                  <div
                    className={styles.featureIcon}
                    style={{
                      background: `linear-gradient(135deg, ${f.gradient[0]}, ${f.gradient[1]})`,
                    }}
                    aria-hidden="true"
                  >
                    <IconCmp size={22} />
                  </div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDescription}>{f.description}</p>
                </div>
              </div>
            )
          })}
        </section>
      </div>
    </div>
  )
}
