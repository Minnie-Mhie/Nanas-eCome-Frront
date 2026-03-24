import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/VendorOrders.css"

const VendorOrders = () => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/vendor`, { headers })
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
          setSelected(null)
        } catch (error) {
          console.log(error)
          showModal("Error", error.response?.data?.message || "Failed to update order status", "danger")
        }
      }
    )
  }

  const getOrderBadge = (status) => {
    if (status === "delivered") return "badge-approved"
    if (status === "cancelled") return "badge-rejected"
    if (status === "shipped")   return "badge-active"
    return "badge-pending"
  }

  const renderStatusControl = (order) => {
    if (order.status === "shipped" || order.status === "delivered" || order.status === "cancelled") {
      return null
    }
    return (
      <select
        className="form-select form-select-sm mt-2"
        value={order.status}
        onChange={e => handleStatusUpdate(order._id, e.target.value)}
      >
        <option value="pending">pending</option>
        <option value="processing">processing</option>
        <option value="shipped">shipped</option>
      </select>
    )
  }

  const renderTable = () => {
    if (loading) {
      return (
        <div className="vendor-orders-loading">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className="vendor-orders-empty">
          <i className="bi bi-bag-x" />
          No orders yet
        </div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Your Items</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} style={{ cursor: "pointer" }} onClick={() => setSelected(order)}>
                <td className="vendor-order-id">#{order._id.slice(-8).toUpperCase()}</td>
                <td>
                  <div className="vendor-order-customer-name">
                    {order.user?.firstName} {order.user?.lastName}
                  </div>
                  <div className="vendor-order-customer-email">{order.user?.email}</div>
                </td>
                <td className="vendor-order-items">{order.items?.length} item(s)</td>
                <td><span className={`badge ${getOrderBadge(order.status)}`}>{order.status}</span></td>
                <td className="vendor-order-date">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td><i className="bi bi-chevron-right text-muted" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderDetail = () => {
    if (!selected) return null

    return (
      <div className="col-md-5 fade-up">
        <div className="card h-100">
          <div className="card-body">
            <div className="vendor-detail-header">
              <div className="vendor-section-title">Order Details</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="vendor-detail-id-row">
              <div className="vendor-detail-id">#{selected._id.slice(-8).toUpperCase()}</div>
              <span className={`badge ${getOrderBadge(selected.status)}`}>{selected.status}</span>
            </div>

            <div className="vendor-detail-info-box">
              <div className="vendor-detail-info-label">Customer</div>
              <div className="vendor-detail-info-name">{selected.user?.firstName} {selected.user?.lastName}</div>
              <div className="vendor-detail-info-email">{selected.user?.email}</div>
            </div>

            <div className="vendor-detail-info-box">
              <div className="vendor-detail-info-label">Shipping Address</div>
              <div className="vendor-detail-info-addr">
                {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
                {selected.shippingAddress?.state}, {selected.shippingAddress?.country}
              </div>
            </div>

            <div className="vendor-detail-items-label">Your Items in This Order</div>
            {selected.items?.map((item, i) => (
              <div key={i} className="vendor-detail-item-row">
                <img
                  src={item.product?.productImage?.secure_url}
                  alt={item.product?.productName}
                  className="vendor-detail-item-img"
                />
                <div>
                  <div className="vendor-detail-item-name">{item.product?.productName}</div>
                  <div className="vendor-detail-item-qty">
                    Qty: {item.quantity} × ₦{item.priceAtOrder?.toLocaleString()}
                  </div>
                </div>
                <div className="vendor-detail-item-total">
                  ₦{(item.quantity * item.priceAtOrder)?.toLocaleString()}
                </div>
              </div>
            ))}

            <div className="vendor-detail-date-row">
              <div className="vendor-detail-date-label">Order Date</div>
              <div className="vendor-detail-date-value">{new Date(selected.createdAt).toLocaleString()}</div>
            </div>

            {renderStatusControl(selected)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="main-content w-100">

        <div className="vendor-orders-header">
          <div>
            <h2>Orders</h2>
            <p className="vendor-orders-sub">Orders containing your products</p>
          </div>
          <div className="vendor-orders-total">Total: {orders.length}</div>
        </div>

        <div className="row g-4">
          <div className={selected ? "col-md-7" : "col-12"}>
            <div className="card">
              {renderTable()}
            </div>
          </div>
          {renderDetail()}
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

export default VendorOrders