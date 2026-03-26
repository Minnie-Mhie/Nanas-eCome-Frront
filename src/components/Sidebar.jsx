import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import axios from "axios"
import { useEffect, useState } from "react"

const Sidebar = ({ role }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const cookies  = new Cookies()
  const token    = localStorage.getItem("token")

  const [user, setUser]           = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setUser(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }
    if (token) fetchUser()
  }, [token])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (error) {
      console.log(error)
    } finally {
      cookies.remove("token", { path: "/" })
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  const isActive = (path) => location.pathname === path ? "active" : ""

  const getRoleLabel = () => {
    if (role === "admin")  return "Admin Panel"
    if (role === "vendor") return "Vendor Portal"
    return "My Account"
  }

  const adminLinks = [
    { to: "/admin/dashboard", icon: "bi-grid-fill",        label: "Dashboard"   },
    { to: "/admin/users",     icon: "bi-people-fill",      label: "Users"       },
    { to: "/admin/vendors",   icon: "bi-shop",             label: "Vendors"     },
    { to: "/admin/products",  icon: "bi-box-seam",         label: "Products"    },
    { to: "/admin/orders",    icon: "bi-bag-check-fill",   label: "Orders"      },
    { to: "/admin/kyc",       icon: "bi-shield-lock-fill", label: "KYC"         },
    { to: "/shop",            icon: "bi-storefront",       label: "Marketplace" },
  ]

  const vendorLinks = [
    { to: "/vendor/dashboard", icon: "bi-grid-fill",      label: "Dashboard"   },
    { to: "/vendor/products",  icon: "bi-box-seam",       label: "Products"    },
    { to: "/vendor/orders",    icon: "bi-bag-check-fill", label: "Orders"      },
    { to: "/shop",             icon: "bi-storefront",     label: "Marketplace" },
  ]

  const userLinks = [
    { to: "/shop",   icon: "bi-storefront",     label: "Shop"      },
    { to: "/cart",   icon: "bi-cart-fill",      label: "My Cart"   },
    { to: "/orders", icon: "bi-bag-check-fill", label: "My Orders" },
  ]

  const roleLinks =
    role === "admin"  ? adminLinks  :
    role === "vendor" ? vendorLinks :
    userLinks

  const commonLinks = [
    { to: "/me",         icon: "bi-person-circle", label: "Profile"    },
    { to: "/categories", icon: "bi-tags-fill",     label: "Categories" },
  ]

  const allLinks = [...roleLinks, ...commonLinks]

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?"

  const SidebarContent = () => (
    <>
      <div className="sidebar-brand">
        <Link className="sidebar-brand-name" to="/">
          Nana's <span>Pourfection</span> Hub
        </Link>
        <span className="sidebar-role-badge">{getRoleLabel()}</span>
      </div>

      <ul className="sidebar-nav">
        {allLinks.map(l => (
          <li key={l.to}>
            <Link to={l.to} className={`sidebar-link ${isActive(l.to)}`}>
              <i className={`bi ${l.icon}`} />
              {!collapsed && <span>{l.label}</span>}
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        {user && !collapsed && (
          <div className="sidebar-user">
            <div className="sidebar-avatar-sm">{initials}</div>
            <div className="sidebar-user-name">Hello, {user.firstName}</div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-logout">
          <i className="bi bi-box-arrow-right" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── DESKTOP TOGGLE BUTTON ── */}
      <button
        className="sidebar-desktop-toggle d-none d-lg-flex"
        onClick={() => setCollapsed(prev => !prev)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`} />
      </button>

      {/* ── MOBILE TOGGLE BUTTON ── */}
      <button
        className="sidebar-mobile-toggle d-flex d-lg-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <i className="bi bi-layout-sidebar" />
      </button>

      {/* ── DESKTOP SIDEBAR ── */}
      <div className={`sidebar d-none d-lg-flex ${collapsed ? "sidebar-collapsed" : ""}`}>
        <SidebarContent />
      </div>

      {/* ── MOBILE OFFCANVAS SIDEBAR ── */}
      <div className={`sidebar-mobile-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`sidebar sidebar-mobile d-flex d-lg-none ${mobileOpen ? "open" : ""}`}>
        <button
          className="sidebar-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <i className="bi bi-x-lg" />
        </button>
        <SidebarContent />
      </div>
    </>
  )
}

export default Sidebar