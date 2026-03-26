import { useState } from "react";
import { useNavigate } from "react-router-dom";


/* ─── Animated Counter ───────────────────────────────────────────── */
function Counter({ end, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = () => {
        start += end / 60;
        if (start >= end) { setVal(end); return; }
        setVal(Math.floor(start));
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Main Landing Page ──────────────────────────────────────────── */
export default function LandingPage({ setUser }) {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: "⚡",
      title: "Real-time Messaging",
      desc: "Zero-latency conversations powered by WebSocket connections.",
    },
    {
      icon: "🔒",
      title: "End-to-End Encrypted",
      desc: "Your messages are yours alone. Military-grade encryption.",
    },
    {
      icon: "🌐",
      title: "Cross-platform",
      desc: "Seamlessly switch between web, desktop, and mobile.",
    },
    {
      icon: "🎨",
      title: "Expressive Chats",
      desc: "Reactions, threads, rich media — conversations come alive.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-root {
          font-family: 'DM Sans', sans-serif;
          background: #070410;
          color: #f0eaff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* NAV */
        .lp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 48px;
          backdrop-filter: blur(18px);
          background: rgba(7, 4, 16, 0.45);
          border-bottom: 1px solid rgba(225, 0, 255, 0.08);
        }

        .lp-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          color: #fff;
        }

        .lp-logo span {
          color: #e100ff;
        }

        .lp-nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }

        .lp-nav-links a {
          color: rgba(240, 234, 255, 0.65);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 400;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }

        .lp-nav-links a:hover { color: #fff; }

        .lp-nav-cta {
          display: flex;
          gap: 12px;
        }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(225, 0, 255, 0.35);
          color: rgba(240, 234, 255, 0.8);
          padding: 9px 22px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .btn-ghost:hover {
          border-color: #e100ff;
          color: #fff;
        }

        .btn-primary {
          background: linear-gradient(135deg, #e100ff, #7b00ff);
          border: none;
          color: #fff;
          padding: 9px 22px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.25s;
          letter-spacing: 0.02em;
          box-shadow: 0 0 24px rgba(225, 0, 255, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 32px rgba(225, 0, 255, 0.5);
        }

        /* HERO */
        .lp-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .lp-hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 0 24px;
          max-width: 820px;
          animation: fadeUp 1s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #e100ff;
          margin-bottom: 28px;
          padding: 6px 18px;
          border: 1px solid rgba(225, 0, 255, 0.3);
          border-radius: 100px;
          background: rgba(225, 0, 255, 0.06);
          animation: fadeUp 1s 0.1s ease both;
        }

        .lp-eyebrow::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #e100ff;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .lp-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 8vw, 6.5rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #fff;
          margin-bottom: 28px;
          animation: fadeUp 1s 0.2s ease both;
        }

        .lp-h1 em {
          font-style: italic;
          background: linear-gradient(90deg, #e100ff, #a855f7, #f7f7f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .lp-sub {
          font-size: 1.05rem;
          line-height: 1.7;
          color: rgba(240, 234, 255, 0.6);
          max-width: 520px;
          margin: 0 auto 44px;
          font-weight: 300;
          animation: fadeUp 1s 0.3s ease both;
        }

        .lp-cta-group {
          display: flex;
          gap: 14px;
          justify-content: center;
          animation: fadeUp 1s 0.4s ease both;
        }

        .btn-hero {
          background: linear-gradient(135deg, #e100ff, #7b00ff);
          border: none;
          color: #fff;
          padding: 15px 36px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          letter-spacing: 0.02em;
          box-shadow: 0 0 48px rgba(225, 0, 255, 0.4);
          transition: all 0.25s;
        }

        .btn-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 48px rgba(225, 0, 255, 0.6);
        }

        .btn-hero-ghost {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(240, 234, 255, 0.8);
          padding: 15px 36px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          cursor: pointer;
          letter-spacing: 0.02em;
          backdrop-filter: blur(8px);
          transition: all 0.25s;
        }

        .btn-hero-ghost:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(225, 0, 255, 0.4);
          color: #fff;
        }

        /* SCROLL INDICATOR */
        .lp-scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(240, 234, 255, 0.3);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          animation: fadeUp 1s 0.8s ease both;
        }

        .lp-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(225, 0, 255, 0.6), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.5); opacity: 0.4; }
        }

        /* STATS */
        .lp-stats {
          padding: 80px 48px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(225, 0, 255, 0.1);
          border-top: 1px solid rgba(225, 0, 255, 0.1);
          border-bottom: 1px solid rgba(225, 0, 255, 0.1);
        }

        .lp-stat {
          text-align: center;
          padding: 40px 24px;
          background: #070410;
        }

        .lp-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 300;
          color: #fff;
          line-height: 1;
          margin-bottom: 8px;
        }

        .lp-stat-num span { color: #e100ff; }

        .lp-stat-label {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 234, 255, 0.4);
        }

        /* FEATURES */
        .lp-features {
          padding: 120px 48px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .lp-section-label {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #e100ff;
          margin-bottom: 16px;
        }

        .lp-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 64px;
        }

        .lp-features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: rgba(225, 0, 255, 0.08);
          border: 1px solid rgba(225, 0, 255, 0.08);
          border-radius: 16px;
          overflow: hidden;
        }

        .lp-feature {
          padding: 44px 40px;
          background: rgba(7, 4, 16, 0.95);
          transition: background 0.3s;
          cursor: default;
        }

        .lp-feature:hover {
          background: rgba(225, 0, 255, 0.04);
        }

        .lp-feature-icon {
          font-size: 2rem;
          margin-bottom: 20px;
          display: block;
        }

        .lp-feature-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 12px;
        }

        .lp-feature-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: rgba(240, 234, 255, 0.5);
          font-weight: 300;
        }

        /* CHAT PREVIEW */
        .lp-preview {
          padding: 80px 48px 120px;
          max-width: 760px;
          margin: 0 auto;
        }

        .lp-chat-window {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(225, 0, 255, 0.15);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5), 0 0 80px rgba(225, 0, 255, 0.08);
        }

        .lp-chat-header {
          padding: 16px 24px;
          background: rgba(225, 0, 255, 0.07);
          border-bottom: 1px solid rgba(225, 0, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lp-chat-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e100ff, #7b00ff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: #fff;
          font-weight: 500;
        }

        .lp-chat-name {
          font-size: 0.88rem;
          color: rgba(240, 234, 255, 0.8);
        }

        .lp-chat-online {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22d3a5;
          margin-left: auto;
          box-shadow: 0 0 8px #22d3a5;
        }

        .lp-chat-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lp-msg {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          opacity: 0;
          animation: msgIn 0.4s ease forwards;
        }

        .lp-msg:nth-child(1) { animation-delay: 0.5s; }
        .lp-msg:nth-child(2) { animation-delay: 1.1s; }
        .lp-msg:nth-child(3) { animation-delay: 1.7s; flex-direction: row-reverse; }
        .lp-msg:nth-child(4) { animation-delay: 2.3s; }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-msg-av {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7b00ff, #e100ff);
          flex-shrink: 0;
          font-size: 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .lp-msg-av.self {
          background: linear-gradient(135deg, #1a0535, #4a0080);
        }

        .lp-msg-bubble {
          max-width: 72%;
          padding: 10px 16px;
          border-radius: 16px 16px 16px 4px;
          background: rgba(255, 255, 255, 0.07);
          font-size: 0.88rem;
          line-height: 1.5;
          color: rgba(240, 234, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .lp-msg-bubble.self {
          border-radius: 16px 16px 4px 16px;
          background: linear-gradient(135deg, rgba(225, 0, 255, 0.18), rgba(123, 0, 255, 0.18));
          border-color: rgba(225, 0, 255, 0.2);
          color: rgba(240, 234, 255, 0.95);
        }

        /* CTA */
        .lp-cta-section {
          padding: 100px 48px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .lp-cta-glow {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 600px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(225, 0, 255, 0.12), transparent 70%);
          pointer-events: none;
        }

        .lp-cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 300;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 20px;
          position: relative;
        }

        .lp-cta-sub {
          font-size: 0.95rem;
          color: rgba(240, 234, 255, 0.5);
          margin-bottom: 40px;
          font-weight: 300;
          position: relative;
        }

        /* FOOTER */
        .lp-footer {
          padding: 40px 48px;
          border-top: 1px solid rgba(225, 0, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .lp-footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          color: rgba(240, 234, 255, 0.4);
        }

        .lp-footer-logo span { color: #e100ff; }

        .lp-footer-copy {
          font-size: 0.78rem;
          color: rgba(240, 234, 255, 0.25);
        }

        @media (max-width: 768px) {
          .lp-nav { padding: 16px 20px; }
          .lp-nav-links { display: none; }
          .lp-stats { grid-template-columns: 1fr; }
          .lp-features-grid { grid-template-columns: 1fr; }
          .lp-features, .lp-preview, .lp-cta-section { padding-left: 20px; padding-right: 20px; }
          .lp-footer { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      <div className="lp-root">
        {/* NAV */}
        <nav className="lp-nav">
          <div className="lp-logo">Aura<span>.</span>Chat</div>
          <ul className="lp-nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#preview">Preview</a></li>
            <li><a href="#about">About</a></li>
          </ul>
          <div className="lp-nav-cta">
            <button className="btn-ghost" onClick={() => navigate("/")}>Log in</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>Sign up</button>
          </div>
        </nav>

        {/* HERO */}
        <section className="lp-hero">
          <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <SoftAurora
              speed={0.6}
              scale={0.7}
              brightness={1.2}
              color1="#f7f7f7"
              color2="#e100ff"
              noiseFrequency={2.5}
              noiseAmplitude={4}
              bandHeight={0.5}
              bandSpread={1}
              octaveDecay={0.1}
              layerOffset={0}
              colorSpeed={1}
              enableMouseInteraction
              mouseInfluence={0.25}
            />
          </div>
          <div className="lp-hero-content">
            <div className="lp-eyebrow">Now in open beta</div>
            <h1 className="lp-h1">
              Conversations<br />that feel <em>alive</em>
            </h1>
            <p className="lp-sub">
              A messaging experience built for depth — where every word
              travels instantly, privately, and beautifully.
            </p>
            <div className="lp-cta-group">
              <button className="btn-hero" onClick={() => navigate("/signup")}>
                Start for free
              </button>
              <button className="btn-hero-ghost" onClick={() => navigate("/")}>
                Sign in →
              </button>
            </div>
          </div>
          <div className="lp-scroll">
            <div className="lp-scroll-line" />
            scroll
          </div>
        </section>

        {/* STATS */}
        <div className="lp-stats">
          {[
            { num: 2400000, suffix: "+", label: "Messages sent daily" },
            { num: 120000, suffix: "+", label: "Active users" },
            { num: 99, suffix: ".9%", label: "Uptime guaranteed" },
          ].map((s) => (
            <div className="lp-stat" key={s.label}>
              <div className="lp-stat-num">
                <Counter end={s.num} suffix={s.suffix} />
              </div>
              <div className="lp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="lp-features" id="features">
          <div className="lp-section-label">Why Aura</div>
          <h2 className="lp-section-title">
            Every detail<br />considered.
          </h2>
          <div className="lp-features-grid">
            {features.map((f) => (
              <div
                className="lp-feature"
                key={f.title}
                onMouseEnter={() => setHoveredFeature(f.title)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <span className="lp-feature-icon">{f.icon}</span>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT PREVIEW */}
        <section className="lp-preview" id="preview">
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="lp-section-label">Live preview</div>
            <h2 className="lp-section-title">Feel the difference</h2>
          </div>
          <div className="lp-chat-window">
            <div className="lp-chat-header">
              <div className="lp-chat-avatar">S</div>
              <span className="lp-chat-name">Sara & You</span>
              <div className="lp-chat-online" />
            </div>
            <div className="lp-chat-body">
              <div className="lp-msg">
                <div className="lp-msg-av">S</div>
                <div className="lp-msg-bubble">Hey! Did you see the aurora last night? 🌌</div>
              </div>
              <div className="lp-msg">
                <div className="lp-msg-av">S</div>
                <div className="lp-msg-bubble">It was absolutely stunning from up north.</div>
              </div>
              <div className="lp-msg">
                <div className="lp-msg-av self">Y</div>
                <div className="lp-msg-bubble self">Oh wow, I missed it! Send me the photos! ✨</div>
              </div>
              <div className="lp-msg">
                <div className="lp-msg-av">S</div>
                <div className="lp-msg-bubble">Sending them now — just like this chat, instantly 💜</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta-section">
          <div className="lp-cta-glow" />
          <h2 className="lp-cta-title">
            Ready to experience<br />the aurora?
          </h2>
          <p className="lp-cta-sub">Join thousands already having better conversations.</p>
          <button className="btn-hero" onClick={() => navigate("/signup")}>
            Create your account — it's free
          </button>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">Aura<span>.</span>Chat</div>
          <div className="lp-footer-copy">© 2026 AuraChat. All rights reserved.</div>
        </footer>
      </div>
    </>
  );
}