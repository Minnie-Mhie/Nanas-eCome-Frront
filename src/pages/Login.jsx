import { useState } from "react"
import { useFormik } from "formik"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Cookies from "universal-cookie"
import Modal from "../components/Modal"

const Login = () => {
  const navigate = useNavigate()
  const cookies  = new Cookies()
  const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "info" })

  const formik = useFormik({
    initialValues: {
      email:      "",
      password:   "",
      rememberMe: false,
    },
    validate: values => {
      const errors = {}

      if (!values.email) {
        errors.email = "Email is required"
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
        errors.email = "Invalid email address"
      }

      if (!values.password) {
        errors.password = "Password is required"
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters"
      }

      return errors
    },
    onSubmit: async (values) => {
      try {
        // console.log(values)
        console.log("successful")
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
          email:    values.email,
          password: values.password,
        })

        console.log(response.data)

        const decoded = jwtDecode(response.data.token)
        localStorage.setItem("token", response.data.token)
        cookies.set("token", response.data.token, {
          expires: new Date(decoded.exp * 1000),
          path: "/",
        })

        // const mailSender = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/send-login-email`, {
        //   email: values.email,
        // }, {
        //   headers: { Authorization: `Bearer ${response.data.token}` }
        // })
        // console.log(mailSender)

        console.log(decoded)

        // Redirect based on role
        if (decoded.roles === "admin")       navigate("/admin/dashboard")
        else if (decoded.roles === "vendor") navigate("/vendor/dashboard")
        else                                 navigate("/shop")

      } catch (error) {
        console.log(error)
        setModal({
          isOpen:  true,
          title:   "Login Failed",
          message: error.response?.data?.message || "Invalid email or password",
          type:    "danger",
        })
      }
    },
  })

  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">
          <Link to="/" className="home-navbar-branded">
    Nana's <span>Pourfection</span> Hub
  </Link>
        </div>
        <div className="auth-subtitle">Welcome back! Sign in to your account</div>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>
          <div className="mb-3 form-check">
            <input
              id="rememberMe" name="rememberMe" type="checkbox"
              className="form-check-input"
              onChange={formik.handleChange} checked={formik.values.rememberMe}
            />
            <label htmlFor="rememberMe" className="form-check-label"
              style={{ fontSize: 14, color: "#888", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              Remember me
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2" disabled={formik.isSubmitting}>
            {formik.isSubmitting
              ? <><span className="spinner-border spinner-border-sm me-2" />Logging in...</>
              : "Login"
            }
          </button>
        </form>

        <div className="text-center mt-4" style={{ fontSize: "14px", color: "#888" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>
            Create one
          </Link>
        </div>

        <div className="text-center mt-4" style={{ fontSize: "14px", color: "#888" }}>
          Forgot your password?{" "}
          <Link to="/forgotpassword" style={{ color: "var(--pink)", fontWeight: 700, textDecoration: "none" }}>
            Forgot Password
          </Link>
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

export default Login