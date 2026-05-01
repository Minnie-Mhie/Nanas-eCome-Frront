import { useState } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import Modal from "../components/Modal"
import "../style/Register.css"

const Register = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole]           = useState(null)
  const [passportPreview, setPassportPreview]     = useState("")
  const [certPreview, setCertPreview]             = useState("")
  const [modal, setModal]                         = useState({ isOpen: false, title: "", message: "", type: "info" })

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload  = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

  const isVendor = selectedRole === "vendor"

  const buyerSchema = yup.object({
    firstName:       yup.string().required("First name is required"),
    lastName:        yup.string().required("Last name is required"),
    email:           yup.string().email("Invalid email").required("Email is required"),
    password:        yup.string()
      .min(8, "Minimum 8 characters")
      .matches(/[A-Z]/, "Must have an uppercase letter")
      .matches(/[a-z]/, "Must have a lowercase letter")
      .matches(/\d/,    "Must have a number")
      .matches(/[@$!%*?&]/, "Must have a special character")
      .required("Password is required"),
    confirmPassword: yup.string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Please confirm your password"),
  })

  const vendorSchema = buyerSchema.shape({
    storeName:           yup.string().required("Store name is required"),
    storeDescription:    yup.string().required("Store description is required"),
    bvn:                 yup.string().length(11, "BVN must be 11 digits").matches(/^\d+$/, "BVN must be numbers only").required("BVN is required"),
    nin:                 yup.string().length(11, "NIN must be 11 digits").matches(/^\d+$/, "NIN must be numbers only").required("NIN is required"),
    houseAddress:        yup.string().required("House address is required"),
    bankName:            yup.string().required("Bank name is required"),
    accountNumber:       yup.string().length(10, "Account number must be 10 digits").matches(/^\d+$/, "Must be numbers only").required("Account number is required"),
    accountName:         yup.string().required("Account name is required"),
    passportPhoto:       yup.string().required("Passport photo is required"),
    businessCertificate: yup.string().required("Business certificate is required"),
  })

  const formik = useFormik({
    initialValues: {
      firstName:           "",
      lastName:            "",
      email:               "",
      password:            "",
      confirmPassword:     "",
      roles:               selectedRole || "user",
      storeName:           "",
      storeDescription:    "",
      bvn:                 "",
      nin:                 "",
      houseAddress:        "",
      bankName:            "",
      accountNumber:       "",
      accountName:         "",
      passportPhoto:       "",
      businessCertificate: "",
    },
    enableReinitialize: true,
    validationSchema: isVendor ? vendorSchema : buyerSchema,
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
              storeName:           values.storeName,
              storeDescription:    values.storeDescription,
              bvn:                 values.bvn,
              nin:                 values.nin,
              houseAddress:        values.houseAddress,
              bankName:            values.bankName,
              accountNumber:       values.accountNumber,
              accountName:         values.accountName,
              passportPhoto:       values.passportPhoto,
              businessCertificate: values.businessCertificate,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          showModal(
            "Application Submitted!",
            "Your vendor account has been created and is awaiting admin approval. You will be notified via email once approved.",
            "success"
          )
        } else {
          showModal("Account Created!", "Your account has been created successfully. You can now log in.", "success")
        }

      } catch (error) {
        console.log(error)
        showModal("Registration Failed", error.response?.data?.message || "Registration failed. Please try again.", "danger")
      }
    },
  })

  const handleFileChange = async (e, fieldName, setPreview) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await toBase64(file)
      formik.setFieldValue(fieldName, base64)
      setPreview(base64)
    }
  }

  const getFieldClass = (field) => {
    if (formik.touched[field] && formik.errors[field]) return "form-control is-invalid"
    return "form-control"
  }

  const renderError = (field) => {
    if (formik.touched[field] && formik.errors[field]) {
      return <div className="invalid-feedback">{formik.errors[field]}</div>
    }
    return null
  }

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
                <li><i className="bi bi-check-circle-fill" /> Browse and shop all products</li>
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
                <li><i className="bi bi-check-circle-fill" /> Manage products and orders</li>
                <li><i className="bi bi-check-circle-fill" /> Earn from every sale</li>
              </ul>
              <button className="role-card-btn">Get Started as Seller</button>
            </div>
          </div>

          <div className="role-login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>

        <Modal
          isOpen={modal.isOpen} title={modal.title} message={modal.message}
          type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
        />
      </div>
    )
  }

  const renderBaseFields = () => {
    return (
      <>
        <div className="register-section-label">Personal Information</div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label>First Name</label>
            <input
              name="firstName" type="text"
              className={getFieldClass("firstName")}
              placeholder="Jane"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.firstName}
            />
            {renderError("firstName")}
          </div>
          <div className="col-6">
            <label>Last Name</label>
            <input
              name="lastName" type="text"
              className={getFieldClass("lastName")}
              placeholder="Doe"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.lastName}
            />
            {renderError("lastName")}
          </div>
        </div>

        <div className="mb-3">
          <label>Email Address</label>
          <input
            name="email" type="email"
            className={getFieldClass("email")}
            placeholder="jane@example.com"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
          />
          {renderError("email")}
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            name="password" type="password"
            className={getFieldClass("password")}
            placeholder="Create a strong password"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
          />
          {renderError("password")}
        </div>

        <div className="mb-3">
          <label>Confirm Password</label>
          <input
            name="confirmPassword" type="password"
            className={getFieldClass("confirmPassword")}
            placeholder="Repeat your password"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}
          />
          {renderError("confirmPassword")}
        </div>
      </>
    )
  }

  const renderVendorFields = () => {
    if (!isVendor) return null

    return (
      <>
        <div className="register-section-label mt-4">Store Information</div>

        <div className="mb-3">
          <label>Store Name</label>
          <input
            name="storeName" type="text"
            className={getFieldClass("storeName")}
            placeholder="e.g. Nana's Crafts"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.storeName}
          />
          {renderError("storeName")}
        </div>

        <div className="mb-3">
          <label>Store Description</label>
          <textarea
            name="storeDescription" rows={3}
            className={getFieldClass("storeDescription")}
            placeholder="Tell us about your store and what you sell..."
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.storeDescription}
          />
          {renderError("storeDescription")}
        </div>

        <div className="register-section-label mt-4">Identity Verification</div>
        <div className="register-kyc-notice">
          <i className="bi bi-shield-lock-fill me-2" />
          Your details are securely stored and only accessible to platform admins for verification purposes.
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label>BVN</label>
            <input
              name="bvn" type="text" maxLength={11}
              className={getFieldClass("bvn")}
              placeholder="11-digit BVN"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.bvn}
            />
            {renderError("bvn")}
          </div>
          <div className="col-6">
            <label>NIN</label>
            <input
              name="nin" type="text" maxLength={11}
              className={getFieldClass("nin")}
              placeholder="11-digit NIN"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.nin}
            />
            {renderError("nin")}
          </div>
        </div>

        <div className="mb-3">
          <label>House Address</label>
          <textarea
            name="houseAddress" rows={2}
            className={getFieldClass("houseAddress")}
            placeholder="Full residential address"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.houseAddress}
          />
          {renderError("houseAddress")}
        </div>

        <div className="mb-3">
          <label>Passport Photo</label>
          <input
            type="file" accept="image/*"
            className={getFieldClass("passportPhoto")}
            onChange={e => handleFileChange(e, "passportPhoto", setPassportPreview)}
            onBlur={() => formik.setFieldTouched("passportPhoto", true)}
          />
          {renderError("passportPhoto")}
          {passportPreview && (
            <img src={passportPreview} alt="Passport preview" className="register-doc-preview" />
          )}
        </div>

        <div className="mb-3">
          <label>Business/Corporate Certificate</label>
          <input
            type="file" accept="image/*,application/pdf"
            className={getFieldClass("businessCertificate")}
            onChange={e => handleFileChange(e, "businessCertificate", setCertPreview)}
            onBlur={() => formik.setFieldTouched("businessCertificate", true)}
          />
          {renderError("businessCertificate")}
          {certPreview && certPreview.startsWith("data:image") && (
            <img src={certPreview} alt="Certificate preview" className="register-doc-preview" />
          )}
          {certPreview && certPreview.startsWith("data:application/pdf") && (
            <div className="register-pdf-badge">
              <i className="bi bi-file-earmark-pdf-fill me-2" />PDF uploaded successfully
            </div>
          )}
        </div>

        <div className="register-section-label mt-4">Bank Details for Payout</div>
        <div className="register-kyc-notice register-bank-notice">
          <i className="bi bi-bank me-2" />
          Your earnings from each sale will be sent directly to this account. A 10% platform fee applies on each transaction.
        </div>

        <div className="mb-3">
          <label>Bank Name</label>
          <input
            name="bankName" type="text"
            className={getFieldClass("bankName")}
            placeholder="e.g. Access Bank"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.bankName}
          />
          {renderError("bankName")}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label>Account Number</label>
            <input
              name="accountNumber" type="text" maxLength={10}
              className={getFieldClass("accountNumber")}
              placeholder="10-digit account number"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.accountNumber}
            />
            {renderError("accountNumber")}
          </div>
          <div className="col-6">
            <label>Account Name</label>
            <input
              name="accountName" type="text"
              className={getFieldClass("accountName")}
              placeholder="Name on account"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.accountName}
            />
            {renderError("accountName")}
          </div>
        </div>
      </>
    )
  }

  const renderForm = () => {
    return (
      <div className="auth-page register-scroll-page">
        <div className={`auth-card fade-up register-form-card ${isVendor ? "register-form-card-wide" : ""}`}>

          <button className="register-back-btn" onClick={() => setSelectedRole(null)}>
            <i className="bi bi-arrow-left" /> Change account type
          </button>

          <div className="auth-logo">Nana's <span>Pourfection</span> Hub</div>

          <div className="register-role-badge-wrap">
            <span className={getRoleBadgeClass()}>
              <i className={`bi ${isVendor ? "bi-shop" : "bi-bag-heart-fill"}`} />
              {isVendor ? "Seller Account" : "Buyer Account"}
            </span>
          </div>

          <div className="auth-subtitle">Create your account to get started</div>

          <form onSubmit={formik.handleSubmit}>
            {renderBaseFields()}
            {renderVendorFields()}

            {isVendor && (
              <div className="register-final-notice">
                <i className="bi bi-info-circle-fill me-2" />
                Your account will require admin review before you can list products. You will be notified by email once approved.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 register-submit-btn"
              disabled={formik.isSubmitting}
            >
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
          isOpen={modal.isOpen} title={modal.title} message={modal.message}
          type={modal.type}
          onClose={() => {
            setModal({ ...modal, isOpen: false })
            if (modal.type === "success") navigate("/login")
          }}
        />
      </div>
    )
  }

  if (!selectedRole) return renderRoleSelection()

  return renderForm()
}

export default Register