import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminKyc.css"

const AdminKyc = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState("all")
  const [modal, setModal]           = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchActivities = async () => {
    try {
      let url = `${import.meta.env.VITE_API_URL}/api/v1/Kyc`
      if (filter !== "all") {
        url = `${import.meta.env.VITE_API_URL}/api/v1/Kyc?riskLevel=${filter}`
      }
      const res = await axios.get(url, { headers })
      setActivities(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to fetch activity logs", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchActivities() }, [filter])

  const handleSuspend = (userId) => {
    showModal("Suspend User", "Suspend this user based on suspicious activity?", "danger",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/Kyc/suspend/${userId}`, {}, { headers })
          showModal("Suspended", "User has been suspended", "success")
          fetchActivities()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to suspend user", "danger")
        }
      }
    )
  }

  const getRiskBadge = (risk) => {
    if (risk === "high")   return { bg: "#FEE2E2", color: "#991B1B", label: "High"   }
    if (risk === "medium") return { bg: "#FEF3C7", color: "#92400E", label: "Medium" }
    return { bg: "#DCFCE7", color: "#166534", label: "Low" }
  }

  const getStatusStyle = (status) => {
    if (status === "success") return { bg: "#DCFCE7", color: "#166534" }
    return { bg: "#FEE2E2", color: "#991B1B" }
  }

  const renderAction = (activity) => {
    if (activity.user?.status === "suspended") {
      return <span className="Kyc-suspended-text">Suspended</span>
    }
    return (
      <button className="btn btn-danger btn-sm" onClick={() => handleSuspend(activity.user?._id)}>
        Suspend
      </button>
    )
  }

  const renderTable = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-5">
            <div className="spinner-brand" />
          </td>
        </tr>
      )
    }

    if (activities.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center py-4 text-muted">No activity found</td>
        </tr>
      )
    }

    return activities.map((activity, index) => {
      const risk        = getRiskBadge(activity.riskLevel)
      const statusStyle = getStatusStyle(activity.status)

      return (
        <tr key={activity._id || index}>
          <td>
            <div className="Kyc-user-name">
              {activity.user?.firstName} {activity.user?.lastName}
            </div>
            <div className="Kyc-user-email">{activity.user?.email}</div>
          </td>
          <td className="Kyc-action-text">{activity.action}</td>
          <td>
            <span className="Kyc-endpoint">
              {activity.method} {activity.endpoint}
            </span>
          </td>
          <td className="Kyc-ip">{activity.ipAddress}</td>
          <td>
            <span className="badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
              {activity.status}
            </span>
          </td>
          <td>
            <span className="badge" style={{ background: risk.bg, color: risk.color }}>
              {risk.label}
            </span>
          </td>
          <td className="Kyc-time-text">
            {new Date(activity.createdAt).toLocaleString()}
          </td>
          <td>{renderAction(activity)}</td>
        </tr>
      )
    })
  }

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="main-content w-100">

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1">Kyc & Activity Monitor</h2>
            <p className="text-muted mb-0 Kyc-sub">Track all user actions and flag suspicious activity</p>
          </div>
          <div className="Kyc-total">Total: {activities.length}</div>
        </div>

        <div className="card mb-4">
          <div className="card-body py-2">
            <div className="d-flex gap-2">
              {["all", "high", "medium", "low"].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm text-capitalize ${filter === f ? "btn-navy" : "btn-ghost"}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All Activity" : `${f} Risk`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Endpoint</th>
                  <th>IP Address</th>
                  <th>Result</th>
                  <th>Risk</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{renderTable()}</tbody>
            </table>
          </div>
        </div>

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default AdminKyc