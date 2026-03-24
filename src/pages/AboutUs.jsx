import { useState, useEffect } from "react";

const FloatingOrb = ({ style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(60px)",
      opacity: 0.35,
      pointerEvents: "none",
      ...style,
    }}
  />
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#7B2FBE" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#C084FC" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z"/>
  </svg>
);

const GlossIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2FBE" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="6" ry="9"/>
    <path d="M12 3 Q15 7 15 12 Q15 17 12 21"/>
    <path d="M9 5 Q8 8 8 12"/>
  </svg>
);

const ResinIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2FBE" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/>
    <polygon points="12,6 18,9.5 18,14.5 12,18 6,14.5 6,9.5" fill="#E9D5FF" stroke="none"/>
  </svg>
);

const HandIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7B2FBE" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
  </svg>
);

const ValueCard = ({ icon, title, description, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(196, 132, 252, 0.3)",
      borderRadius: "20px",
      padding: "32px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "16px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      boxShadow: "0 4px 24px rgba(123, 47, 190, 0.08)",
    }}>
      <div style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #F3E8FF, #E9D5FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(196, 132, 252, 0.3)",
      }}>
        {icon}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#4A1D96", margin: 0 }}>{title}</h3>
      <p style={{ fontFamily: "'Lato', sans-serif", fontSize: "0.92rem", color: "#6D28D9", lineHeight: 1.7, margin: 0 }}>{description}</p>
    </div>
  );
};

const Tag = ({ label }) => (
  <span style={{
    background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
    color: "#5B21B6",
    fontFamily: "'Lato', sans-serif",
    fontSize: "0.78rem",
    fontWeight: "700",
    padding: "6px 14px",
    borderRadius: "100px",
    letterSpacing: "0.05em",
    border: "1px solid rgba(167, 139, 250, 0.4)",
  }}>
    {label}
  </span>
);

export default function AboutUs() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  const hashtags = [
    "#MeetTheBrand", "#GlossByNanasPourfection", "#NanasPourfection",
    "#BeautyInEveryPour", "#HandmadeWithLove", "#LipCareAndResinArt",
    "#SupportMySmallBusiness", "#ResinArtworkByNanasPourfection"
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Lato:wght@300;400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes floatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.08); }
        }
        @keyframes floatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 25px) scale(0.94); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196, 132, 252, 0.4); }
          50% { box-shadow: 0 0 0 16px rgba(196, 132, 252, 0); }
        }

        .orb-a { animation: floatA 8s ease-in-out infinite; }
        .orb-b { animation: floatB 11s ease-in-out infinite; }
        .orb-c { animation: floatA 13s ease-in-out infinite reverse; }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 700;
          background: linear-gradient(135deg, #3B0764, #7B2FBE, #A855F7, #7B2FBE, #3B0764);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
          line-height: 1.15;
        }

        .section-label {
          font-family: 'Lato', sans-serif;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #A855F7;
        }

        .divider-line {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C084FC, transparent);
          margin: 0 auto;
        }

        .quote-block {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(1.25rem, 2.5vw, 1.6rem);
          color: #5B21B6;
          line-height: 1.7;
          text-align: center;
        }

        .body-text {
          font-family: 'Lato', sans-serif;
          font-size: 1rem;
          color: #4C1D95;
          line-height: 1.85;
          font-weight: 300;
        }

        .avatar-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }

        .fade-up {
          animation: fadeUp 0.8s ease forwards;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FAF5FF 0%, #F3E8FF 35%, #EDE9FE 65%, #FAF5FF 100%)",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background orbs */}
        <FloatingOrb className="orb-a" style={{ width: 500, height: 500, top: -100, right: -100, background: "radial-gradient(circle, #E9D5FF, #C084FC)" }} />
        <FloatingOrb className="orb-b" style={{ width: 400, height: 400, bottom: 100, left: -150, background: "radial-gradient(circle, #DDD6FE, #A78BFA)" }} />
        <FloatingOrb className="orb-c" style={{ width: 300, height: 300, top: "40%", left: "30%", background: "radial-gradient(circle, #F5D0FE, #E879F9)" }} />

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>

          {/* ── HERO ── */}
          <section style={{
            textAlign: "center",
            padding: "80px 0 60px",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(20px)",
            transition: "all 0.9s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
              <SparkleIcon />
              <span className="section-label">Meet the brand</span>
              <SparkleIcon />
            </div>

            <h1 className="hero-title" style={{ marginBottom: "16px" }}>
              Nana's Pourfection
            </h1>

            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "1.2rem",
              color: "#7C3AED",
              letterSpacing: "0.04em",
              marginBottom: "32px",
            }}>
              Beauty should feel good, look good, and come from the heart.
            </p>

            <div className="divider-line" />
          </section>

          {/* ── FOUNDER SECTION ── */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "40px",
            padding: "40px 0 60px",
            alignItems: "center",
          }}>
            {/* Avatar placeholder */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div className="avatar-ring" style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7B2FBE, #C084FC, #A855F7)",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <div style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #F3E8FF, #EDE9FE)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "4px",
                  }}>
                    <span style={{ fontSize: "3rem" }}>👋🏽</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#7B2FBE", fontWeight: 600 }}>Hi, I'm Nana</span>
                  </div>
                </div>
                {/* Decorative dots */}
                <div style={{ position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%", background: "#C084FC", opacity: 0.7 }} />
                <div style={{ position: "absolute", bottom: 5, left: -12, width: 14, height: 14, borderRadius: "50%", background: "#A855F7", opacity: 0.5 }} />
              </div>
            </div>

            {/* Story text */}
            <div style={{ textAlign: "center" }}>
              <p className="section-label" style={{ marginBottom: "16px" }}>Our story</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#3B0764", marginBottom: "24px", lineHeight: 1.3 }}>
                The heart & hands behind<br />
                <em style={{ color: "#7B2FBE" }}>every pour</em>
              </h2>
              <p className="body-text" style={{ marginBottom: "20px" }}>
                What started as a love for self-care and creativity has grown into a beautiful blend of hydrating lip care and handcrafted resin art — made just for <strong style={{ color: "#6D28D9" }}>YOU</strong>.
              </p>
              <p className="body-text">
                Every gloss is handmade, every resin piece is unique, and every order is packed with love and perfection. Whether it's a glossy shine, a sparkling tray, or custom jewelry, there's always a touch of perfection in everything we create.
              </p>
            </div>
          </section>

          {/* ── QUOTE BANNER ── */}
          <section style={{
            background: "linear-gradient(135deg, rgba(123, 47, 190, 0.08), rgba(167, 139, 250, 0.12))",
            border: "1px solid rgba(196, 132, 252, 0.25)",
            borderRadius: "24px",
            padding: "48px 40px",
            marginBottom: "64px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.06, fontSize: "10rem", fontFamily: "Georgia, serif", color: "#7B2FBE", userSelect: "none" }}>"</div>
            <p className="quote-block">
              Welcome to Nana's Pourfection, where there's<br />
              beauty in every pour. From silky-smooth glosses<br />
              to elegant resin pieces, everything we create is<br />
              designed to make you feel <em>confident, cared for,<br />and a little more you.</em>
            </p>
          </section>

          {/* ── VALUES ── */}
          <section style={{ marginBottom: "72px" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p className="section-label" style={{ marginBottom: "12px" }}>What we stand for</p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.7rem, 3vw, 2.2rem)", color: "#3B0764" }}>
                Our Promise to You
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
              <ValueCard
                delay={100}
                icon={<GlossIcon />}
                title="Handcrafted with Care"
                description="Every lip gloss is carefully hand-poured, ensuring quality and love in every single tube."
              />
              <ValueCard
                delay={250}
                icon={<ResinIcon />}
                title="Unique Resin Art"
                description="No two resin pieces are alike. Each tray, coaster, or jewelry item is a one-of-a-kind creation."
              />
              <ValueCard
                delay={400}
                icon={<HandIcon />}
                title="Quality & Affordability"
                description="We believe beauty essentials should be accessible without compromising on quality or craftsmanship."
              />
            </div>
          </section>

          {/* ── MISSION STRIP ── */}
          <section style={{
            background: "linear-gradient(135deg, #4A1D96, #7B2FBE)",
            borderRadius: "28px",
            padding: "52px 40px",
            textAlign: "center",
            marginBottom: "64px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "8px" }}>
                <HeartIcon />
                <HeartIcon />
                <HeartIcon />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#F3E8FF", marginBottom: "20px", lineHeight: 1.4 }}>
                We're just getting started —<br />and we're so glad you're here.
              </h2>
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#DDD6FE", fontSize: "1rem", lineHeight: 1.8, maxWidth: "520px", margin: "0 auto 28px", fontWeight: 300 }}>
                Thank you for being part of this journey. Let's create beauty together, one gloss pour and resin piece at a time.
              </p>
              <button style={{
                background: "linear-gradient(135deg, #C084FC, #A855F7)",
                color: "white",
                border: "none",
                borderRadius: "100px",
                padding: "14px 36px",
                fontFamily: "'Lato', sans-serif",
                fontSize: "0.9rem",
                fontWeight: "700",
                letterSpacing: "0.08em",
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                textTransform: "uppercase",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)"; }}
                onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
              >
                Shop the Collection
              </button>
            </div>
          </section>

          {/* ── HASHTAGS ── */}
          <section style={{ paddingBottom: "80px", textAlign: "center" }}>
            <p className="section-label" style={{ marginBottom: "20px" }}>Follow our journey</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              {hashtags.map(tag => <Tag key={tag} label={tag} />)}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
