import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import Modal from "../components/Modal"
import { jwtDecode } from "jwt-decode"
import "../style/Profile.css"

const Profile = () => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token   = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  let role = "user"
  try {
    const decoded = jwtDecode(token)
    role = decoded.roles || "user"
  } catch (e) { console.log(e) }

  useEffect(() => {
    const getMe = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/me`, { headers })
        setUser(response.data.data)
      } catch (error) {
        console.log(error)
        try {
          const decoded = jwtDecode(token)
          setUser(decoded)
        } catch (e) { console.log(e) }
      } finally {
        setLoading(false)
      }
    }
    getMe()
  }, [])

  const getRoleBadge = () => {
    if (role === "admin")  return { bg: "#FCE7F3", color: "var(--pink)",  label: "Administrator" }
    if (role === "vendor") return { bg: "#EDE9FE", color: "var(--plum)", label: "Vendor" }
    return { bg: "#DCFCE7", color: "#166534", label: "Customer" }
  }

  const badge = getRoleBadge()

  const details = [
    { label: "First Name",     value: user?.firstName,          icon: "bi-person-fill"   },
    { label: "Last Name",      value: user?.lastName,           icon: "bi-person-fill"   },
    { label: "Email Address",  value: user?.email,              icon: "bi-envelope-fill" },
    { label: "Role",           value: badge.label,              icon: "bi-shield-fill"   },
    { label: "Account Status", value: user?.status || "active", icon: "bi-circle-fill"   },
  ]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="spinner-brand" />
          <p>Loading profile...</p>
        </div>
      )
    }

    return (
      <div className="row g-4">

        <div className="col-md-4">
          <div className="card text-center fade-up">
            <div className="card-body py-4">
              <div className="profile-avatar">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="profile-name">{user?.firstName} {user?.lastName}</div>
              <div className="profile-email">{user?.email}</div>
              <span className="badge" style={{ background: badge.bg, color: badge.color, fontSize: 12, padding: "6px 16px" }}>
                {badge.label}
              </span>
              <div className="mt-3">
                <span className={`badge ${user?.status === "suspended" ? "badge-suspended" : "badge-active"}`}>
                  {user?.status || "active"}
                </span>
              </div>
              <div className="profile-since">
                <i className="bi bi-calendar3 me-1" />
                Member since {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                  : "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card fade-up-1">
            <div className="card-body">
              <div className="profile-detail-title">Account Details</div>
              {details.map((item, i) => (
                <div
                  key={i}
                  className="profile-detail-row"
                  style={{ borderBottom: i < details.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <div className="profile-detail-icon-wrap">
                    <i className={`bi ${item.icon} profile-detail-icon`} />
                  </div>
                  <div>
                    <div className="profile-detail-label">{item.label}</div>
                    <div className="profile-detail-value">{item.value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role={role} />
      <div className="main-content w-100">

        <div className="page-header">
          <h2>My Profile</h2>
          <p>View your account information</p>
        </div>

        {renderContent()}

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default Profile