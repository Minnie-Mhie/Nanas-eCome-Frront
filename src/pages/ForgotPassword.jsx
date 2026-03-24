import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Modal from "../components/Modal"

const ForgotPassword = () => {
  const navigate  = useNavigate()
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: values => {
      const errors = {}
      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }
      return errors
    },
    onSubmit: async (values) => {
      try {
        console.log(values)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/request-otp`, {
          email: values.email,
        })
        console.log(response)
        showModal(
          "OTP Sent!",
          "A one-time password has been sent to your email. Check your inbox then proceed to reset your password.",
          "success"
        )
        setTimeout(() => navigate("/change-password"), 2500)
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to send OTP", "danger")
      }
    },
  })

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, var(--navy) 0%, #2D0A6B 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", fontFamily: "var(--font-body)",
    }}>

      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,45,139,0.08)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(201,168,240,0.08)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            Nana's <span style={{ color: "var(--pink)" }}>Pourfection</span> Hub
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Reset your password</div>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20, padding: "36px 32px", backdropFilter: "blur(12px)",
        }}>

          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px",
            background: "linear-gradient(135deg, var(--lavender), var(--pink))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className="bi bi-envelope-fill" style={{ color: "#fff", fontSize: 22 }} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Forgot Password?
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7 }}>
              Enter your registered email and we'll send you a one-time password (OTP) to reset your account.
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>
                Email Address
              </label>
              <input
                name="email" type="email" placeholder="Enter your email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", borderRadius: 10, padding: "12px 16px", fontSize: 14 }}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={formik.isSubmitting}
              style={{ padding: "12px", fontSize: 15, fontWeight: 700, borderRadius: 10 }}>
              {formik.isSubmitting
                ? <><span className="spinner-border spinner-border-sm me-2" />Sending OTP...</>
                : <><i className="bi bi-send-fill me-2" />Send OTP</>
              }
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Remembered your password?{" "}
            <Link to="/login" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>
              Back to Login
            </Link>
          </div>

          <div style={{ textAlign: "center", marginTop: 12, fontSize: 13 }}>
            <Link to="/change-password" style={{ color: "var(--lavender)", fontWeight: 600, textDecoration: "none" }}>
              Already have an OTP? Reset Password →
            </Link>
          </div>

        </div>
      </div>

      <Modal isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })} />
    </div>
  )
}

export default ForgotPassword