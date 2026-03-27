import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import Modal from "../components/Modal"
import "../style/Register.css"

const Register = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  const formik = useFormik({
    initialValues: {
      firstName:        "",
      lastName:         "",
      email:            "",
      password:         "",
      confirmPassword:  "",
      roles:            selectedRole || "user",
      storeName:        "",
      storeDescription: "",
    },
    enableReinitialize: true,
    validate: values => {
      const errors = {}

      if (!values.firstName) {
        errors.firstName = "First name is required"
      }

      if (!values.lastName) {
        errors.lastName = "Last name is required"
      }

      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Password is required"
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(values.password)) {
        errors.password = "Min 8 characters, uppercase, lowercase, number and special character"
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password"
      } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match"
      }

      if (values.roles === "vendor") {
        if (!values.storeName) {
          errors.storeName = "Store name is required"
        }
        if (!values.storeDescription) {
          errors.storeDescription = "Store description is required"
        }
      }

      return errors
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/register`, {
          firstName: values.firstName,
          lastName:  values.lastName,
          email:     values.email,
          password:  values.password,
          roles:     values.roles,
        })

        if (values.roles === "vendor") {
          const token = response.data.token
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/vendor/apply`,
            {
              storeName:        values.storeName,
              storeDescription: values.storeDescription,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          showModal(
            "Application Submitted!",
            "Your vendor account has been created and is awaiting admin approval. You can log in once approved.",
            "success"
          )
        } else {
          showModal(
            "Account Created!",
            "Your account has been created successfully. You can now log in.",
            "success"
          )
        }

      } catch (error) {
        console.log(error)
        showModal(
          "Registration Failed",
          error.response?.data?.message || "Registration failed. Please try again.",
          "danger"
        )
      }
    },
  })

  const isVendor = selectedRole === "vendor"

  const getRoleBadgeClass = () => {
    if (isVendor) return "register-role-badge register-role-badge-vendor"
    return "register-role-badge register-role-badge-buyer"
  }

  const renderRoleSelection = () => {
    return (
      <div className="auth-page">
        <div className="role-pick-wrap">
          <div className="role-pick-logo">Nana's <span>Pourfection</span> Hub</div>
          <h2 className="role-pick-heading">How would you like to join?</h2>
          <p className="role-pick-sub">Choose your account type to get started</p>

          <div className="role-cards">

            <div className="role-card role-card-buyer" onClick={() => setSelectedRole("user")}>
              <div className="role-card-icon-wrap">
                <i className="bi bi-bag-heart-fill" />
              </div>
              <div className="role-card-title">Register as a Buyer</div>
              <p className="role-card-desc">Shop handmade beauty and resin art products from verified vendors.</p>
              <ul className="role-card-perks">
                <li><i className="bi bi-check-circle-fill" /> Browse & shop all products</li>
                <li><i className="bi bi-check-circle-fill" /> Track your orders</li>
                <li><i className="bi bi-check-circle-fill" /> Instant account activation</li>
              </ul>
              <button className="role-card-btn">Get Started as Buyer</button>
            </div>

            <div className="role-card role-card-seller" onClick={() => setSelectedRole("vendor")}>
              <div className="role-card-icon-wrap">
                <i className="bi bi-shop" />
              </div>
              <div className="role-card-title">Register as a Seller</div>
              <p className="role-card-desc">List your handmade products and grow your brand on our marketplace.</p>
              <ul className="role-card-perks">
                <li><i className="bi bi-check-circle-fill" /> Create your own store</li>
                <li><i className="bi bi-check-circle-fill" /> Manage products & orders</li>
                <li><i className="bi bi-check-circle-fill" /> Reach thousands of buyers</li>
              </ul>
              <button className="role-card-btn">Get Started as Seller</button>
            </div>

          </div>

          <div className="role-login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>

        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ ...modal, isOpen: false })}
        />
      </div>
    )
  }

  const renderVendorFields = () => {
    if (!isVendor) return null

    return (
      <div className="register-vendor-box mb-3">
        <div className="register-vendor-label mb-2">
          <i className="bi bi-shop me-1" />Store Information
        </div>

        <div className="mb-3">
          <label htmlFor="storeName">Store Name</label>
          <input
            id="storeName" name="storeName" type="text"
            className={`form-control ${formik.touched.storeName && formik.errors.storeName ? "is-invalid" : ""}`}
            placeholder="e.g. Nana's Crafts"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.storeName}
          />
          {formik.touched.storeName && formik.errors.storeName && (
            <div className="invalid-feedback">{formik.errors.storeName}</div>
          )}
        </div>

        <div className="mb-2">
          <label htmlFor="storeDescription">Store Description</label>
          <textarea
            id="storeDescription" name="storeDescription" rows={3}
            className={`form-control ${formik.touched.storeDescription && formik.errors.storeDescription ? "is-invalid" : ""}`}
            placeholder="Tell us about your store..."
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.storeDescription}
          />
          {formik.touched.storeDescription && formik.errors.storeDescription && (
            <div className="invalid-feedback">{formik.errors.storeDescription}</div>
          )}
        </div>

        <small className="register-vendor-note">
          <i className="bi bi-info-circle me-1" />
          Your vendor account will require admin approval before you can list products.
        </small>
      </div>
    )
  }

  const renderForm = () => {
    return (
      <div className="auth-page">
        <div className="auth-card fade-up register-form-card">

          <button className="register-back-btn" onClick={() => setSelectedRole(null)}>
            <i className="bi bi-arrow-left" /> Change account type
          </button>

          <div className="auth-logo">
             <Link to="/">
    Nana's <span>Pourfection</span> Hub
  </Link>Hub
          </div>

          <div className="register-role-badge-wrap">
            <span className={getRoleBadgeClass()}>
              <i className={`bi ${isVendor ? "bi-shop" : "bi-bag-heart-fill"}`} />
              {isVendor ? "Seller Account" : "Buyer Account"}
            </span>
          </div>

          <div className="auth-subtitle">Create your account to get started</div>

          <form onSubmit={formik.handleSubmit}>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName" name="firstName" type="text"
                  className={`form-control ${formik.touched.firstName && formik.errors.firstName ? "is-invalid" : ""}`}
                  placeholder="Jane"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="invalid-feedback">{formik.errors.firstName}</div>
                )}
              </div>
              <div className="col-6">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName" name="lastName" type="text"
                  className={`form-control ${formik.touched.lastName && formik.errors.lastName ? "is-invalid" : ""}`}
                  placeholder="Doe"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="invalid-feedback">{formik.errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
                placeholder="jane@example.com"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                id="password" name="password" type="password"
                className={`form-control ${formik.touched.password && formik.errors.password ? "is-invalid" : ""}`}
                placeholder="Create a strong password"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">{formik.errors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword" name="confirmPassword" type="password"
                className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "is-invalid" : ""}`}
                placeholder="Repeat your password"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <div className="invalid-feedback">{formik.errors.confirmPassword}</div>
              )}
            </div>

            {renderVendorFields()}

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={formik.isSubmitting}>
              {formik.isSubmitting
                ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                : "Create Account"
              }
            </button>
          </form>

          <div className="register-signin-link">
            Already have an account?{" "}
            <Link to="/login" className="register-signin-anchor">Sign in</Link>
          </div>

        </div>

        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          message={modal.message}
          type={modal.type}
          onClose={() => {
            setModal({ ...modal, isOpen: false })
            if (modal.type === "success") navigate("/login")
          }}
        />
      </div>
    )
  }

  if (!selectedRole) {
    return renderRoleSelection()
  }

  return renderForm()
}

export default Register