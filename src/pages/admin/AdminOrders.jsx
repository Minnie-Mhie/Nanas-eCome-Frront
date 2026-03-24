import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminOrders.css"

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState("all")
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, { headers })
      setOrders(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to fetch orders", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusUpdate = (orderId, newStatus) => {
    showModal(
      "Update Order Status",
      `Change this order status to "${newStatus}"?`,
      "info",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/orders/status/${orderId}`, { status: newStatus }, { headers })
          showModal("Updated", `Order status updated to ${newStatus}`, "success")
          fetchOrders()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to update order status", "danger")
        }
      }
    )
  }

  const getBadgeClass = (status) => {
    if (status === "delivered") return "badge-approved"
    if (status === "cancelled") return "badge-rejected"
    if (status === "shipped")   return "badge-active"
    return "badge-pending"
  }

  const statuses  = ["pending", "processing", "shipped", "delivered", "cancelled"]
  const displayed = filter === "all" ? orders : orders.filter(o => o.status === filter)

  const renderStatusControl = (order) => {
    if (order.status === "delivered" || order.status === "cancelled") {
      return <span className="order-no-action">No further actions</span>
    }
    return (
      <select
        className="form-select form-select-sm order-status-select"
        value={order.status}
        onChange={e => handleStatusUpdate(order._id, e.target.value)}
      >
        {statuses.map(s => (
          <option key={s} value={s} className="text-capitalize">{s}</option>
        ))}
      </select>
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

    if (displayed.length === 0) {
      return (
        <div className="text-center py-4 text-muted">No orders found</div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(order => (
              <tr key={order._id}>
                <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  <div className="order-customer-name">{order.user?.firstName} {order.user?.lastName}</div>
                  <div className="order-customer-email">{order.user?.email}</div>
                </td>
                <td className="order-items-count">{order.items?.length} item(s)</td>
                <td className="text-pink fw-bold">₦{order.totalAmount?.toLocaleString()}</td>
                <td><span className={`badge ${getBadgeClass(order.status)}`}>{order.status}</span></td>
                <td className="order-date">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{renderStatusControl(order)}</td>
              </tr>
            ))}
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
            <h2 className="mb-1">Orders</h2>
            <p className="text-muted mb-0 orders-sub">View and manage all customer orders</p>
          </div>
          <div className="orders-total">Total: {orders.length}</div>
        </div>

        <div className="card mb-4">
          <div className="card-body py-2">
            <div className="d-flex gap-2 flex-wrap">
              {["all", ...statuses].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${filter === f ? "btn-navy" : "btn-ghost"} text-capitalize`}
                  onClick={() => setFilter(f)}
                  
                >
                  {f} {f !== "all" && `(${orders.filter(o => o.status === f).length})`}
                </button>
              ))}
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

export default AdminOrders