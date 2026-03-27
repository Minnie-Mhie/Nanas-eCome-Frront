import { useState } from "react"
import axios from "axios"
import Navbar from "../components/Navbar"
import "../style/ContactUs.css"

const ContactUs = () => {
  const [name, setName]       = useState("")
  const [email, setEmail]     = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }
    if (!message.trim()) newErrors.message = "Message is required"
    return newErrors
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/contact`, { name, email, message })
      setSuccess(true)
      setName("")
      setEmail("")
      setMessage("")
    } catch (error) {
      console.log(error)
      setErrors({ submit: "Failed to send message. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const renderForm = () => {
    if (success) {
      return (
        <div className="contact-success-box">
          <div className="contact-success-icon">
            <i className="bi bi-check-lg" />
          </div>
          <div className="contact-success-title">Message Sent!</div>
          <p className="contact-success-text">
            Thank you for reaching out. We will get back to you as soon as possible.
          </p>
          <button className="contact-success-back" onClick={() => setSuccess(false)}>
            Send Another Message
          </button>
        </div>
      )
    }

    return (
      <div>
        <div className="contact-form-title">Send Us a Message</div>
        <p className="contact-form-sub">Fill in the form below and we will respond within 24 hours</p>

        <div className="contact-form-group">
          <label className="contact-form-label">Your Name</label>
          <input
            type="text"
            className={errors.name ? "contact-form-input input-error" : "contact-form-input"}
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && <p className="contact-error-text">{errors.name}</p>}
        </div>

        <div className="contact-form-group">
          <label className="contact-form-label">Email Address</label>
          <input
            type="email"
            className={errors.email ? "contact-form-input input-error" : "contact-form-input"}
            placeholder="e.g. jane@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {errors.email && <p className="contact-error-text">{errors.email}</p>}
        </div>

        <div className="contact-form-group">
          <label className="contact-form-label">Message</label>
          <textarea
            rows={5}
            className={errors.message ? "contact-form-input input-error" : "contact-form-input"}
            placeholder="Write your message here..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          {errors.message && <p className="contact-error-text">{errors.message}</p>}
        </div>

        {errors.submit && <p className="contact-error-text">{errors.submit}</p>}

        <button className="contact-submit-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </div>
    )
  }

  return (
    <div className="contact-page">
      <Navbar />

      <div className="contact-hero">
        <div className="contact-hero-tag">Get In Touch</div>
        <h1 className="contact-hero-title">Contact Us</h1>
        <p className="contact-hero-sub">
          Have a question, order enquiry or just want to say hello? We would love to hear from you.
        </p>
      </div>

      <div className="contact-body">

        <div className="contact-info-card">
          <div className="contact-info-title">Our Contact Info</div>
          <p className="contact-info-sub">Reach us through any of the channels below</p>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <i className="bi bi-envelope-fill" />
            </div>
            <div>
              <div className="contact-info-label">Email</div>
              <div className="contact-info-value">
                <a href="mailto:nanaspourfectionhub@gmail.com">nanaspourfectionhub@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <i className="bi bi-telephone-fill" />
            </div>
            <div>
              <div className="contact-info-label">Phone</div>
              <div className="contact-info-value">
                <a href="tel:+2348102232987">08102232987</a>
              </div>
            </div>
          </div>

          <div className="contact-info-item">
            <div className="contact-info-icon">
              <i className="bi bi-geo-alt-fill" />
            </div>
            <div>
              <div className="contact-info-label">Location</div>
              <div className="contact-info-value">
                Temidire Estate, Osogbo,<br />Osun State, Nigeria
              </div>
            </div>
          </div>

          <hr className="contact-divider" />

          <div className="contact-social-title">Find Us On</div>
          <div className="contact-socials">
            <a
              href="https://instagram.com/nanas_pourfection_hub"
              target="_blank"
              rel="noreferrer"
              className="contact-social-btn social-instagram"
              title="Instagram"
            >
              <i className="bi bi-instagram" />
            </a>
            <a
              href="https://wa.me/qr/TWR3UEYYQ4MGF1"
              target="_blank"
              rel="noreferrer"
              className="contact-social-btn social-whatsapp"
              title="WhatsApp"
            >
              <i className="bi bi-whatsapp" />
            </a>
            <a
              href="https://tiktok.com/@nanaspourfectionhub"
              target="_blank"
              rel="noreferrer"
              className="contact-social-btn social-tiktok"
              title="TikTok"
            >
              <i className="bi bi-tiktok" />
            </a>
          </div>
          <p className="contact-info-sub"><marquee>Kindly follow us on all our social media handles.</marquee></p>
        </div>

        <div className="contact-form-card">
          {renderForm()}
        </div>

      </div>
    </div>
  )
}

export default ContactUs