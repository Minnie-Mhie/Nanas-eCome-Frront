import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/VendorDashboard.css"
import "../../font/ballmain font/Ballmain.otf"

const VendorDashboard = () => {
  const [products, setProducts] = useState([])
  const [orders, setOrders]     = useState([])
  const [store, setStore]       = useState(null)
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [productsRes, ordersRes, storeRes] = await Promise.all([
          
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/mine`, { headers }),
          
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/vendor`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vendor/mystore`, { headers }),
        ])
        setProducts(productsRes.data.data)
        setOrders(ordersRes.data.data)
        setStore(storeRes.data.data)
      } catch (error) {
        console.log(error)
        showModal("Error", "Failed to load dashboard data", "danger")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const approved = products.filter(p => p.status === "approved")
  const pending  = products.filter(p => p.status === "pending")
  const rejected = products.filter(p => p.status === "rejected")

  const totalRevenue = orders.reduce((sum, order) => {
    return sum + order.items.reduce((s, item) => s + (item.priceAtOrder * item.quantity), 0)
  }, 0)

  const statCards = [
    { label: "Total Products", value: products.length, icon: "bi-box-seam",       color: "#EDE9FE", iconColor: "var(--plum)" },
    { label: "Live Products",  value: approved.length, icon: "bi-check-circle",   color: "#DCFCE7", iconColor: "#166534"     },
    { label: "Pending Review", value: pending.length,  icon: "bi-clock",          color: "#FEF3C7", iconColor: "#92400E"     },
    { label: "Total Orders",   value: orders.length,   icon: "bi-bag-check-fill", color: "#FCE7F3", iconColor: "var(--pink)" },
  ]

  const getBadgeClass = (status) => {
    if (status === "approved") return "badge-approved"
    if (status === "rejected") return "badge-rejected"
    return "badge-pending"
  }

  const getOrderBadge = (status) => {
    if (status === "delivered") return "badge-approved"
    if (status === "cancelled") return "badge-rejected"
    if (status === "shipped")   return "badge-active"
    return "badge-pending"
  }

  const renderRejectedWarning = () => {
    if (rejected.length === 0) return null
    return (
      <div className="vendor-rejected-warning fade-up-2">
        <div className="vendor-rejected-title">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          {rejected.length} product(s) were rejected by admin
        </div>
        <div className="vendor-rejected-desc">
          Go to <a href="/vendor/products" className="vendor-rejected-link">My Products</a> to review and resubmit them.
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-brand" />
        </div>
      )
    }

    return (
      <div>
        <div className="row g-4 mb-4">
          {statCards.map((stat, i) => (
            <div className="col-md-3" key={i}>
              <div className="stat-card fade-up">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value mt-1">{stat.value}</div>
                  </div>
                  <div className="stat-icon" style={{ background: stat.color, color: stat.iconColor }}>
                    <i className={`bi ${stat.icon}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card vendor-revenue-card fade-up-1">
          <div className="vendor-revenue-body">
            <div>
              <div className="vendor-revenue-label">Total Revenue Earned</div>
              <div className="vendor-revenue-amount">₦{totalRevenue.toLocaleString()}</div>
            </div>
            <i className="bi bi-graph-up-arrow vendor-revenue-icon" />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <div className="vendor-section-header">
                  <div className="vendor-section-title">My Products</div>
                  <a href="/vendor/products" className="vendor-section-link">
                    View all <i className="bi bi-chevron-right" />
                  </a>
                </div>
                {products.length === 0 ? (
                  <div className="vendor-empty-text">
                    No products yet. <a href="/vendor/products" className="vendor-section-link">Add your first product</a>
                  </div>
                ) : (
                  products.slice(0, 5).map(product => (
                    <div key={product._id} className="vendor-product-row">
                      <img
                        src={product.productImage?.secure_url}
                        alt={product.productName}
                        className="vendor-product-row-img"
                      />
                      <div className="flex-fill">
                        <div className="vendor-product-row-name">{product.productName}</div>
                        <div className="vendor-product-row-price">₦{product.productPrice?.toLocaleString()}</div>
                      </div>
                      <span className={`badge ${getBadgeClass(product.status)}`}>{product.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-body">
                <div className="vendor-section-header">
                  <div className="vendor-section-title">Recent Orders</div>
                  <a href="/vendor/orders" className="vendor-section-link">
                    View all <i className="bi bi-chevron-right" />
                  </a>
                </div>
                {orders.length === 0 ? (
                  <div className="vendor-empty-text">No orders yet</div>
                ) : (
                  orders.slice(0, 5).map(order => (
                    <div key={order._id} className="vendor-order-row">
                      <div>
                        <div className="vendor-order-row-name">
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="vendor-order-row-meta">
                          {order.items?.length} item(s) · {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`badge ${getOrderBadge(order.status)}`}>{order.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {renderRejectedWarning()}
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="main-content w-100">

        <div className="vendor-dashboard-header">
          <div>
            <h2>{store ? store.storeName : "Vendor Dashboard"}</h2>
            <p className="vendor-dashboard-sub">{store ? store.storeDescription : "Welcome back!"}</p>
          </div>
          <div className="vendor-dashboard-date">
            <i className="bi bi-calendar3 me-2" />
            {new Date().toDateString()}
          </div>
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

export default VendorDashboard