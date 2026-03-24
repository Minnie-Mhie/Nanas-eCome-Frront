import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import "../style/Auth.css"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  const formik = useFormik({
    initialValues: {
      email:           "",
      otp:             "",
      newPassword:     "",
      confirmPassword: "",
    },
    validate: values => {
      const errors = {}
      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }
      if (!values.otp) {
        errors.otp = "OTP is required"
      }
      if (!values.newPassword) {
        errors.newPassword = "New password is required"
      } else if (values.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters"
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
      } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
      return errors
    },
    onSubmit: async (values) => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/forgotpassword`, {
          email:       values.email,
          otp:         values.otp,
          newPassword: values.newPassword,
        })
        showModal(
          "Password Reset!",
          "Your password has been reset successfully. You can now log in with your new password.",
          "success"
        )
        setTimeout(() => navigate("/login"), 2500)
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to reset password", "danger")
      }
    },
  })

  const getFieldClass = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "form-control is-invalid auth-dark-input"
    return "form-control auth-dark-input"
  }

  const renderFieldError = (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      return <div className="invalid-feedback">{formik.errors[field]}</div>
    }
    return null
  }

  const renderSubmitButton = () => {
    if (formik.isSubmitting) {
      return (
        <button type="submit" className="btn btn-primary auth-dark-submit-btn" disabled>
          <span className="spinner-border spinner-border-sm me-2" />
          Resetting...
        </button>
      )
    }
    return (
      <button type="submit" className="btn btn-primary auth-dark-submit-btn">
        <i className="bi bi-check-circle-fill me-2" />Reset Password
      </button>
    )
  }

  const getNewPasswordType = () => {
    if (showNew) return "text"
    return "password"
  }

  const getConfirmPasswordType = () => {
    if (showConfirm) return "text"
    return "password"
  }

  const getNewEyeIcon = () => {
    if (showNew) return "bi bi-eye-slash auth-dark-eye"
    return "bi bi-eye auth-dark-eye"
  }

  const getConfirmEyeIcon = () => {
    if (showConfirm) return "bi bi-eye-slash auth-dark-eye"
    return "bi bi-eye auth-dark-eye"
  }

  return (
    <div className="auth-dark-page">
      <div className="auth-dark-blob-1" />
      <div className="auth-dark-blob-2" />

      <div className="auth-dark-inner">

        <div className="auth-dark-header">
          <div className="auth-dark-brand">
            Nana's <span>Pourfection</span> Hub
          </div>
          <div className="auth-dark-tagline">Create a new password</div>
        </div>

        <div className="auth-dark-card">

          <div className="auth-dark-icon">
            <i className="bi bi-shield-lock-fill" />
          </div>

          <div className="auth-dark-title">Reset Password</div>
          <div className="auth-dark-desc">
            Enter the OTP sent to your email along with your new password.
          </div>

          <form onSubmit={formik.handleSubmit}>

            <div className="mb-3">
              <label className="auth-dark-label">Email Address</label>
              <input
                name="email" type="email" placeholder="Enter your email"
                className={getFieldClass("email")}
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
              />
              {renderFieldError("email")}
            </div>

            <div className="mb-3">
              <label className="auth-dark-label">OTP Code</label>
              <input
                name="otp" type="text" placeholder="Enter 4-digit OTP" maxLength={4}
                className={getFieldClass("otp") + " otp-input"}
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.otp}
              />
              {renderFieldError("otp")}
            </div>

            <div className="mb-3">
              <label className="auth-dark-label">New Password</label>
              <div className="auth-dark-input-wrap">
                <input
                  name="newPassword" type={getNewPasswordType()} placeholder="Enter new password"
                  className={getFieldClass("newPassword")}
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.newPassword}
                  />
                <i className={getNewEyeIcon()} onClick={() => setShowNew(!showNew)} />
                {renderFieldError("newPassword")}
              </div>
            </div>

            <div className="mb-4">
              <label className="auth-dark-label">Confirm Password</label>
              <div className="auth-dark-input-wrap">
                <input
                  name="confirmPassword" type={getConfirmPasswordType()} placeholder="Confirm new password"
                  className={getFieldClass("confirmPassword")}
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
                  />
                <i className={getConfirmEyeIcon()} onClick={() => setShowConfirm(!showConfirm)} />
                {renderFieldError("confirmPassword")}
              </div>
            </div>

            {renderSubmitButton()}
          </form>

          <div className="auth-dark-footer">
            <Link to="/forgotPassword" className="link-lavender">← Resend OTP</Link>
            <span className="auth-dark-divider">·</span>
            <Link to="/login" className="link-pink">Back to Login</Link>
          </div>

        </div>
      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default ResetPassword