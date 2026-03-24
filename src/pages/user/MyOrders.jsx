import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/MyOrder.css"

const steps = ["pending", "processing", "shipped", "delivered"]

const MyOrders = () => {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }
  const navigate = useNavigate()

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/mine`, { headers })
      setOrders(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to load orders", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleCancel = (orderId) => {
    showModal("Cancel Order", "Are you sure you want to cancel this order? This action cannot be undone.", "danger",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/orders/cancel/${orderId}`, {}, { headers })
          showModal("Cancelled", "Your order has been cancelled successfully.", "success")
          fetchOrders()
          setSelected(null)
        } catch (error) {
          console.log(error)
          showModal("Error", error.response?.data?.message || "Failed to cancel order", "danger")
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

  const getStepStatus = (orderStatus, step) => {
    const orderIndex = steps.indexOf(orderStatus)
    const stepIndex  = steps.indexOf(step)
    if (stepIndex < orderIndex)  return "done"
    if (stepIndex === orderIndex) return "active"
    return "upcoming"
  }

  const getSegmentBg = (s) => {
    if (s === "upcoming") return "#f0f0f0"
    if (s === "active")   return "var(--pink)"
    return "var(--navy)"
  }

  const getCircleBg = (s) => {
    if (s === "upcoming") return "#e0e0e0"
    if (s === "active")   return "var(--pink)"
    return "var(--navy)"
  }

  const getCircleColor = (s) => {
    if (s === "upcoming") return "#aaa"
    return "#fff"
  }

  const getLabelColor = (s) => {
    if (s === "upcoming") return "#aaa"
    if (s === "active")   return "var(--pink)"
    return "var(--navy)"
  }

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="orders-loading">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (orders.length === 0) {
      return (
        <div className="orders-empty">
          <i className="bi bi-bag-x orders-empty-icon" />
          <h4>No orders yet</h4>
          <p>You have not placed any orders yet</p>
          <button className="btn btn-primary" onClick={() => navigate("/shop")}>
            <i className="bi bi-shop me-2" />Start Shopping
          </button>
        </div>
      )
    }

    return (
      <div className="row g-4">
        <div className={selected ? "col-md-5" : "col-12"}>
          <div className="d-flex flex-column">
            {orders.map(order => (
              <div
                key={order._id}
                className={`card order-card ${selected?._id === order._id ? "order-card-active" : ""}`}
                onClick={() => setSelected(order)}
              >
                <div className="card-body">
                  <div className="order-card-top">
                    <div className="order-card-id">#{order._id.slice(-8).toUpperCase()}</div>
                    <span className={`badge ${getOrderBadge(order.status)}`}>{order.status}</span>
                  </div>
                  <div className="order-card-bottom">
                    <div className="order-card-meta">
                      <i className="bi bi-box-seam me-1" />
                      {order.items?.length} item(s)
                      <span className="mx-2">·</span>
                      <i className="bi bi-calendar3 me-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="order-card-amount">₦{order.totalAmount?.toLocaleString()}</div>
                  </div>
                  {order.status !== "cancelled" && (
                    <div className="order-progress-bar">
                      {steps.map(step => (
                        <div
                          key={step}
                          className="order-progress-segment"
                          style={{ background: getSegmentBg(getStepStatus(order.status, step)) }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {renderDetail()}
      </div>
    )
  }

  const renderDetail = () => {
    if (!selected) return null

    return (
      <div className="col-md-7 fade-up">
        <div className="card">
          <div className="card-body">
            <div className="order-detail-header">
              <h5 className="mb-0">Order Details</h5>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="order-detail-id-row">
              <div className="order-detail-id">#{selected._id.slice(-8).toUpperCase()}</div>
              <span className={`badge ${getOrderBadge(selected.status)}`}>{selected.status}</span>
            </div>

            {selected.status !== "cancelled" && (
              <div className="order-tracking-wrap">
                {steps.map((step, i) => {
                  const s = getStepStatus(selected.status, step)
                  return (
                    <div key={step} className="order-tracking-step">
                      {i < steps.length - 1 && (
                        <div
                          className="order-tracking-connector"
                          style={{ background: s === "done" ? "var(--navy)" : "#e0e0e0" }}
                        />
                      )}
                      <div
                        className="order-tracking-circle"
                        style={{ background: getCircleBg(s), color: getCircleColor(s) }}
                      >
                        {s === "done" ? <i className="bi bi-check-lg" /> : i + 1}
                      </div>
                      <div
                        className="order-tracking-label"
                        style={{ color: getLabelColor(s) }}
                      >
                        {step}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="order-address-box">
              <div className="order-address-label">
                <i className="bi bi-geo-alt-fill me-1" />Shipping Address
              </div>
              <div className="order-address-text">
                {selected.shippingAddress?.street}, {selected.shippingAddress?.city}<br />
                {selected.shippingAddress?.state}, {selected.shippingAddress?.country}
              </div>
            </div>

            <div className="order-items-label">Items</div>
            {selected.items?.map((item, i) => (
              <div key={i} className="order-item-row">
                <img
                  src={item.product?.productImage?.secure_url}
                  alt={item.product?.productName}
                  className="order-item-img"
                />
                <div>
                  <div className="order-item-name">{item.product?.productName}</div>
                  <div className="order-item-qty">
                    Qty: {item.quantity} × ₦{item.priceAtOrder?.toLocaleString()}
                  </div>
                </div>
                <div className="order-item-subtotal">
                  ₦{(item.quantity * item.priceAtOrder)?.toLocaleString()}
                </div>
              </div>
            ))}

            <div className="order-total-row">
              <div className="order-total-label">Total</div>
              <div className="order-total-value">₦{selected.totalAmount?.toLocaleString()}</div>
            </div>

            {selected.status === "pending" && (
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={() => handleCancel(selected._id)}
              >
                <i className="bi bi-x-circle me-2" />Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="user" />
      <div className="main-content w-100">

        <div className="orders-header">
          <div>
            <h2>My Orders</h2>
            <p className="orders-header-sub">Track and manage your orders</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/shop")}>
            <i className="bi bi-shop me-2" />Continue Shopping
          </button>
        </div>

        {renderOrders()}

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default MyOrders