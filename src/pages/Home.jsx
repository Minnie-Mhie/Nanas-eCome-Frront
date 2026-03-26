import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import "../style/Home.css"

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  const slides = [
    {
      title: "Beauty in Every Pour",
      subtitle: "Handcrafted lip care & resin art made with love",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&q=80",
      icon: "bi-stars",
      cta: "Shop Now",
      link: "/register",
    },
    {
      title: "Sell on Our Platform",
      subtitle: "Join hundreds of vendors growing their brand with Nana's Pourfection Hub",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
      icon: "bi-shop",
      cta: "Become a Vendor",
      link: "/register",
    },
    {
      title: "Unique. Handmade. Yours.",
      subtitle: "From silky-smooth glosses to elegant resin pieces...everything made just for you",
      image: "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=1400&q=80",
      icon: "bi-heart-fill",
      cta: "Get Started",
      link: "/register",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const advantages = [
    { icon: "bi-shield-check",   title: "Verified Vendors",    desc: "Every vendor is reviewed and approved by our admin team before going live." },
    { icon: "bi-bag-heart-fill", title: "Handmade Products",   desc: "Every product is crafted with love...no mass production, just authentic quality." },
    { icon: "bi-truck",          title: "Easy Ordering",        desc: "Add to cart, checkout, and track your orders all in one place." },
    { icon: "bi-cash-coin",      title: "Affordable Prices",    desc: "Quality beauty and art products that don't break the bank." },
    { icon: "bi-people-fill",    title: "Growing Community",    desc: "Join a marketplace built on creativity, trust, and self-expression." },
    { icon: "bi-star-fill",      title: "Curated Experience",   desc: "Admin-approved listings ensure only the best products reach you." },
  ]

  const vendorPerks = [
    { icon: "bi-graph-up-arrow",  title: "Grow Your Brand",      desc: "Reach thousands of customers who love handmade and beauty products." },
    { icon: "bi-box-seam",        title: "Manage Products Easily", desc: "Add, edit and track all your products from your vendor dashboard." },
    { icon: "bi-receipt-cutoff",  title: "Track Your Orders",    desc: "Get notified and manage orders in real time from one place." },
    { icon: "bi-megaphone-fill",  title: "Zero Listing Stress",  desc: "Simple product submission process...we handle the rest." },
  ]

  return (
    <div className="home-page">

      {/* ─── NAVBAR ─── */}
      <nav className="home-navbar nana-navbar navbar navbar-expand-lg sticky-top">
        <Link to="/" className="home-navbar-brand">
          Nana's <span>Pourfection</span> Hub
        </Link>
        <div className="home-nav-links">
          <a href="#about"   className="home-nav-link">About</a>
          <a href="#vendors" className="home-nav-link">Vendor</a>
          <a href="#why"     className="home-nav-link">Why Us</a>
          <a href="/contact" className="home-nav-link">Contact</a> <br />
          <Link to="/login"    className="home-btn-outline">Login</Link>
          <Link to="/register" className="home-btn-solid">Start</Link>
        </div>
      </nav>

      {/* ─── CAROUSEL ─── */}
      <div className="home-carousel">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`carousel-slide ${activeSlide === i ? "active" : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Dark overlay so text is readable */}
            <div className="carousel-overlay" />

            <div className="carousel-icon-box">
              <i className={`bi ${slide.icon}`} />
            </div>

            <h1 className="carousel-title">{slide.title}</h1>
            <p className="carousel-subtitle">{slide.subtitle}</p>
            <Link to={slide.link} className="carousel-cta">{slide.cta} →</Link>
          </div>
        ))}

        {/* Dots */}
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${activeSlide === i ? "active" : ""}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>

        {/* Arrows */}
        <button className="carousel-arrow left" onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}>‹</button>
        <button className="carousel-arrow right" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>›</button>
      </div>

      {/* ─── STATS ─── */}
      <div className="home-stats">
        {[
          { num: "500+", label: "Happy Customers"       },
          { num: "50+",  label: "Verified Vendors"      },
          { num: "200+", label: "Products Listed"       },
          { num: "100%", label: "Handmade & Authentic"  },
        ].map((stat, i) => (
          <div key={i} className="stat-item">
            <div className="stat-num">{stat.num}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ─── ABOUT THE BRAND ─── */}
      <div id="about" className="home-section home-section-light">
        <div className="section-inner">

          <div className="section-header">
            <div className="section-tag">Meet The Brand</div>
            <h2 className="section-title">Nana's Pourfection Hub</h2>
            <div className="section-divider" />
          </div>

          <div className="about-flex">

            <div className="about-card">
              <div className="about-card-blob-1" />
              <div className="about-card-blob-2" />
              <h3 className="about-card-title">Where there's beauty in every pour</h3>
              <p className="about-card-text">
                We're a small business with a love for hydrating lip care and handmade resin art pieces. From silky-smooth glosses to elegant resin pieces, everything we create is designed to make you feel confident, cared for, and a little more you.
              </p>
              <div className="about-quote">
                <p>"We believe in quality, affordability, and adding a touch of perfection to everyday essentials."</p>
              </div>
            </div>

            <div className="about-details">
              <h3 className="about-story-title">Our Story</h3>
              <p className="about-story-text">
                Thanks for joining our journey. Let's create beauty, one gloss pour and resin piece at a time. We started with a passion for self-care and creativity, and it has grown into something beautiful...a marketplace for authentic, handmade products.
              </p>
              <div className="tags-wrap">
                {["#MeetTheBrand", "#GlossByNanasPourfectionHub", "#ResinArtworkByNanasPourfectionHub", "#HandmadeWithLove", "#LipCareAndResinArt", "#BeautyInEveryPour"].map((tag, i) => (
                  <span key={i} className={`tag ${i % 2 === 0 ? "tag-pink" : "tag-purple"}`}>{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── MEET THE CEO ─── */}
      <div className="home-section home-section-white">
        <div className="section-inner">

          <div className="section-header">
            <div className="section-tag">The Heart Behind It All</div>
            <h2 className="section-title">Meet Nana 👋🏽</h2>
            <div className="section-divider" />
          </div>

          <div className="ceo-flex">

            <div className="ceo-avatar-wrap">
              <div className="ceo-avatar">👩🏽‍💼</div>
              <div className="ceo-name">Nana</div>
              <div className="ceo-role">Founder & CEO</div>
              <div className="ceo-company">Nana's Pourfection Hub</div>
            </div>

            <div className="ceo-message">
              <div className="ceo-quote-mark">"</div>
              <p className="ceo-text">
                Hi, I'm Nana 👋🏽 <br />The heart and hands behind Nana's Pourfection Hub. What started as a love for self-care and creativity has grown into a beautiful blend of hydrating lip care and handcrafted resin art, made just for <strong>YOU</strong>.
              </p>
              <p className="ceo-text">
                At Nana's Pourfection Hub, we believe that beauty should feel good, look good, and come from the heart. Every gloss is handmade, every resin piece is unique, and every order is packed with love and perfection.
              </p>
              <p className="ceo-text-sm">
                Whether it's a glossy shine, a sparkling tray or custom jewelry, there's always a touch of perfection in everything we create. <strong>Thank you for being part of this journey! We're just getting started.</strong>
              </p>
              <div className="tags-wrap">
                {["#NanasPourfectionHub", "#BeautyInEveryPour", "#SupportMySmallBusiness"].map((tag, i) => (
                  <span key={i} className="tag tag-pink">{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── VENDOR SECTION ─── */}
      <div id="vendors" className="home-section home-section-dark">
        <div className="section-inner">

          <div className="section-header">
            <div className="section-tag section-tag-light">For Businesses & Creators</div>
            <h2 className="section-title section-title-light">Sell on Nana's Pourfection Hub</h2>
            <p className="section-desc">
              Whether you sell lip gloss, resin art, skincare, jewellery, or any handmade product. Our platform is built for creators like you.
            </p>
            <div className="section-divider" />
          </div>

          <div className="vendor-grid">
            {vendorPerks.map((perk, i) => (
              <div key={i} className="vendor-card">
                <div className="vendor-card-icon">
                  <i className={`bi ${perk.icon}`} />
                </div>
                <h4 className="vendor-card-title">{perk.title}</h4>
                <p className="vendor-card-desc">{perk.desc}</p>
              </div>
            ))}
          </div>

          <div className="vendor-steps-box">
            <h3 className="vendor-steps-title">How to Start Selling</h3>
            <div className="vendor-steps-flex">
              {[
                { step: "01", title: "Register as Vendor", desc: "Create your account and select the vendor role." },
                { step: "02", title: "Await Approval",     desc: "Our admin team reviews and approves your account." },
                { step: "03", title: "Add Products",       desc: "Submit your products for admin review." },
                { step: "04", title: "Start Selling",      desc: "Once approved, your products go live in the marketplace." },
              ].map((s, i) => (
                <div key={i} className="vendor-step">
                  <div className="vendor-step-num">{s.step}</div>
                  <h5 className="vendor-step-title">{s.title}</h5>
                  <p className="vendor-step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="vendor-cta-wrap">
              <Link to="/register" className="vendor-cta-btn">Register as a Vendor →</Link>
            </div>
          </div>

        </div>
      </div>

      {/* ─── WHY CHOOSE US ─── */}
      <div id="why" className="home-section home-section-light">
        <div className="section-inner">

          <div className="section-header">
            <div className="section-tag">Why Everyone Needs This App</div>
            <h2 className="section-title">The Advantages</h2>
            <div className="section-divider" />
          </div>

          <div className="advantages-grid">
            {advantages.map((adv, i) => (
              <div key={i} className="advantage-card">
                <div className={`advantage-icon ${i % 2 === 0 ? "advantage-icon-pink" : "advantage-icon-purple"}`}>
                  <i className={`bi ${adv.icon}`} />
                </div>
                <div>
                  <h4 className="advantage-title">{adv.title}</h4>
                  <p className="advantage-desc">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ─── CTA BANNER ─── */}
      <div className="home-cta-banner">
        <h2 className="cta-title">Ready to Join the Journey?</h2>
        <p className="cta-subtitle">
          Whether you're here to shop, explore, or sell...Nana's Pourfection Hub has something for you.
        </p>
        <div className="cta-btns">
          <Link to="/register" className="cta-btn-white">Create Account</Link>
          <Link to="/login"    className="cta-btn-ghost">Login</Link>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div className="home-footer">
        <div className="home-footer-brand">
          Nana's <span>Pourfection</span> Hub
        </div>
        <p className="home-footer-copy">
          © {new Date().getFullYear()} Nana's Pourfection Hub. Made with 💗 ...Beauty in every pour.
        </p>
      </div>

    </div>
  )
}

export default Home