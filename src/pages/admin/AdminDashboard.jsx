import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminDashboard.css"
// import { useEffect, useState } from "react"
import "../../font/ballmain font/Ballmain.otf"

const AdminDashboard = () => {
  const [stats, setStats]     = useState({ users: 0, vendors: 0, orders: 0, products: 0 })
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, vendorsRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/getUsers`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vendor/all`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/all`, { headers }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/all`, { headers }),
        ])
        setStats({
          users:    usersRes.data.data.length,
          vendors:  vendorsRes.data.data.length,
          products: productsRes.data.data.length,
          orders:   ordersRes.data.data.length,
        })
      } catch (error) {
        console.log(error)
        setModal({ isOpen: true, title: "Error", message: "Failed to load dashboard data", type: "danger" })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: "Total Users",    value: stats.users,    icon: "bi-people-fill",    color: "#EDE9FE", iconColor: "var(--plum)" },
    { label: "Active Vendors", value: stats.vendors,  icon: "bi-shop",           color: "#FEF3C7", iconColor: "#92400E"     },
    { label: "Total Products", value: stats.products, icon: "bi-box-seam",       color: "#DCFCE7", iconColor: "#166534"     },
    { label: "Total Orders",   value: stats.orders,   icon: "bi-bag-check-fill", color: "#FCE7F3", iconColor: "var(--pink)" },
  ]

  const quickLinks = [
    { title: "Pending Vendors",  desc: "Review and approve vendor applications",  path: "/admin/vendors",  icon: "bi-shop",             color: "var(--pink)" },
    { title: "Pending Products", desc: "Approve or reject submitted products",     path: "/admin/products", icon: "bi-box-seam",         color: "var(--plum)" },
    { title: "KYC & Activity",   desc: "Monitor all user activity and risk flags", path: "/admin/kyc",      icon: "bi-shield-lock-fill", color: "#166534"     },
    { title: "Manage Orders",    desc: "View and update all customer orders",       path: "/admin/orders",   icon: "bi-bag-check-fill",   color: "#92400E"     },
  ]


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-brand" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="main-content w-100">

        <div className="page-header d-flex align-items-center justify-content-between">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back, . Here's what's happening today.</p>
          </div>
          <div className="dashboard-date">
            <i className="bi bi-calendar3 me-2" />
            {new Date().toDateString()}
          </div>
        </div>

        <div className="row g-4 mb-4">
          {statCards.map((stat, i) => (
            <div className="col-md-3" key={i}>
              <div className="stat-card fade-up">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="stat-label mb-2">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                  <div className="stat-icon" style={{ background: stat.color, color: stat.iconColor }}>
                    <i className={`bi ${stat.icon}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions-title">Quick Actions</div>

        <div className="row g-4">
          {quickLinks.map((item, i) => (
            <div className="col-md-6" key={i}>
              <div
                className="card quick-link-card fade-up-1"
                style={{ borderLeft: `4px solid ${item.color}` }}
                onClick={() => window.location.href = item.path}
              >
                <div className="card-body d-flex align-items-center gap-3 py-3">
                  <div className="quick-link-icon" style={{ background: item.color + "18", color: item.color }}>
                    <i className={`bi ${item.icon}`} />
                  </div>
                  <div className="flex-fill">
                    <div className="quick-link-title">{item.title}</div>
                    <div className="quick-link-desc">{item.desc}</div>
                  </div>
                  <i className="bi bi-chevron-right quick-link-chevron" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default AdminDashboard