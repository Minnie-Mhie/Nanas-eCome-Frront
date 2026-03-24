import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminUsers.css"

const AdminUsers = () => {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/getUsers`, { headers })
      setUsers(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to fetch users", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSuspend = (userId) => {
    showModal("Suspend User", "Are you sure you want to suspend this user? They will not be able to log in.", "danger",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/kyc/suspend/${userId}`, {}, { headers })
          showModal("Success", "User suspended successfully", "success")
          fetchUsers()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to suspend user", "danger")
        }
      }
    )
  }

  const handleRestore = (userId) => {
    showModal("Restore User", "Are you sure you want to restore this user?", "warning",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/kyc/restore/${userId}`, {}, { headers })
          showModal("Success", "User restored successfully", "success")
          fetchUsers()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to restore user", "danger")
        }
      }
    )
  }

  const handleDelete = (userId) => {
    showModal("Delete User", "Are you sure you want to permanently delete this user? This cannot be undone.", "danger",
      async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/deleteUser/${userId}`, { headers })
          showModal("Deleted", "User deleted successfully", "success")
          fetchUsers()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to delete user", "danger")
        }
      }
    )
  }

  const getBadgeClass = (status) => {
    if (status === "active")    return "badge-active"
    if (status === "suspended") return "badge-suspended"
    return "badge-pending"
  }

  const getRoleBadge = (role) => {
    if (role === "admin")  return { bg: "#FCE7F3", color: "var(--pink)",  label: "Admin"  }
    if (role === "vendor") return { bg: "#EDE9FE", color: "var(--plum)", label: "Vendor" }
    return { bg: "#F3F4F6", color: "#555", label: "User" }
  }

  const filtered = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const renderUserActions = (user) => {
    if (user.status === "suspended") {
      return (
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => handleRestore(user._id)}>Restore</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)} disabled={user.roles === "admin"}>Delete</button>
        </div>
      )
    }
    return (
      <div className="d-flex gap-2">
        <button className="btn btn-warning btn-sm" onClick={() => handleSuspend(user._id)} disabled={user.roles === "admin"}>Suspend</button>
        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)} disabled={user.roles === "admin"}>Delete</button>
      </div>
    )
  }

  const renderTable = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-4 text-muted">No users found</div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, index) => {
              const roleBadge = getRoleBadge(user.roles)
              return (
                <tr key={user._id}>
                  <td className="user-index">{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="user-avatar">{user.firstName[0]}{user.lastName[0]}</div>
                      <div className="user-name">{user.firstName} {user.lastName}</div>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td>
                    <span className="badge" style={{ background: roleBadge.bg, color: roleBadge.color }}>
                      {roleBadge.label}
                    </span>
                  </td>
                  <td><span className={`badge ${getBadgeClass(user.status)}`}>{user.status}</span></td>
                  <td className="user-date">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{renderUserActions(user)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="main-content w-100">

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1">Users</h2>
            <p className="text-muted mb-0 users-sub">Manage all registered users</p>
          </div>
          <div className="users-total">Total: {users.length}</div>
        </div>

        <div className="card mb-4">
          <div className="card-body py-3">
            <div className="input-group users-search-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card">{renderTable()}</div>

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default AdminUsers