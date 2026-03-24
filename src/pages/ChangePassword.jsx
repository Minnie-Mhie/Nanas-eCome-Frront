import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import "../style/Auth.css"

const ChangePassword = () => {
  const navigate  = useNavigate()
  const [showOld,     setShowOld]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token   = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  let role = "user"
  try {
    const decoded = jwtDecode(token)
    role = decoded.roles || "user"
  } catch (e) { console.log(e) }

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  const formik = useFormik({
    initialValues: {
      oldPassword:     "",
      newPassword:     "",
      confirmPassword: "",
    },
    validate: values => {
      const errors = {}
      if (!values.oldPassword) {
        errors.oldPassword = "Current password is required"
      }
      if (!values.newPassword) {
        errors.newPassword = "New password is required"
      } else if (values.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters"
      } else if (values.newPassword === values.oldPassword) {
        errors.newPassword = "New password must be different from current password"
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your new password"
      } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
      return errors
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/changepassword`, {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }, { headers })
        showModal(
          "Password Changed!",
          "Your password has been updated successfully. Please use your new password next time you log in.",
          "success"
        )
        resetForm()
        setTimeout(() => navigate("/me"), 2000)
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to change password", "danger")
      }
    },
  })

  const getFieldClass = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "form-control is-invalid"
    return "form-control"
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
        <button type="submit" className="btn btn-primary" disabled>
          <span className="spinner-border spinner-border-sm me-2" />
          Updating...
        </button>
      )
    }
    return (
      <button type="submit" className="btn btn-primary">
        <i className="bi bi-check-circle-fill me-2" />Update Password
      </button>
    )
  }

  const getOldType    = () => { if (showOld)     return "text"; return "password" }
  const getNewType    = () => { if (showNew)     return "text"; return "password" }
  const getConfirmType = () => { if (showConfirm) return "text"; return "password" }

  const getOldEyeIcon     = () => { if (showOld)     return "bi bi-eye-slash change-password-eye"; return "bi bi-eye change-password-eye" }
  const getNewEyeIcon     = () => { if (showNew)     return "bi bi-eye-slash change-password-eye"; return "bi bi-eye change-password-eye" }
  const getConfirmEyeIcon = () => { if (showConfirm) return "bi bi-eye-slash change-password-eye"; return "bi bi-eye change-password-eye" }

  return (
    <div className="change-password-page">
      <Sidebar role={role} />
      <div className="main-content w-100">

        <div className="page-header">
          <h2>Change Password</h2>
          <p>Update your account password</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card fade-up change-password-card">
              <div className="card-body">

                <div className="change-password-form-title">Update Password</div>
                <div className="change-password-form-sub">Choose a strong password with at least 6 characters.</div>

                <form onSubmit={formik.handleSubmit}>

                  <div className="mb-3">
                    <label className="change-password-label">Current Password</label>
                    <div className="change-password-input-wrap">
                      <input
                        name="oldPassword" type={getOldType()} placeholder="Enter current password"
                        className={getFieldClass("oldPassword")}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.oldPassword}
                        style={{ paddingRight: 44 }}
                      />
                      <i className={getOldEyeIcon()} onClick={() => setShowOld(!showOld)} />
                      {renderFieldError("oldPassword")}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="change-password-label">New Password</label>
                    <div className="change-password-input-wrap">
                      <input
                        name="newPassword" type={getNewType()} placeholder="Enter new password"
                        className={getFieldClass("newPassword")}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.newPassword}
                        style={{ paddingRight: 44 }}
                      />
                      <i className={getNewEyeIcon()} onClick={() => setShowNew(!showNew)} />
                      {renderFieldError("newPassword")}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="change-password-label">Confirm New Password</label>
                    <div className="change-password-input-wrap">
                      <input
                        name="confirmPassword" type={getConfirmType()} placeholder="Confirm new password"
                        className={getFieldClass("confirmPassword")}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
                        style={{ paddingRight: 44 }}
                      />
                      <i className={getConfirmEyeIcon()} onClick={() => setShowConfirm(!showConfirm)} />
                      {renderFieldError("confirmPassword")}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    {renderSubmitButton()}
                    <button type="button" className="btn btn-ghost" onClick={() => navigate("/me")}>
                      Cancel
                    </button>
                  </div>

                </form>
              </div>
            </div>
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

export default ChangePassword