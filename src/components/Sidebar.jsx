import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import axios from "axios"
import { useEffect, useState } from "react"

const Sidebar = ({ role }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const cookies  = new Cookies()
  const token    = localStorage.getItem("token")

  const [user, setUser]         = useState(null)
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
    } catch (err) {
      console.log(err)
    } finally {
      cookies.remove("token", { path: "/" })
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  const isActive = (path) =>
    location.pathname === path ? "sidebar-link active" : "sidebar-link"

  const getRoleLabel = () => {
    if (role === "admin")  return "Admin Panel"
    if (role === "vendor") return "Vendor Portal"
    return "My Account"
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?"

  const NavLinks = () => (
    <ul className="sidebar-nav">
      {role === "admin" && (
        <>
          <li><Link to="/admin/dashboard" className={isActive("/admin/dashboard")}><i className="bi bi-grid-fill" /><span className="sb-label">Dashboard</span></Link></li>
          <li><Link to="/admin/users"     className={isActive("/admin/users")}    ><i className="bi bi-people-fill" /><span className="sb-label">Users</span></Link></li>
          <li><Link to="/admin/vendors"   className={isActive("/admin/vendors")}  ><i className="bi bi-shop" /><span className="sb-label">Vendors</span></Link></li>
          <li><Link to="/admin/products"  className={isActive("/admin/products")} ><i className="bi bi-box-seam" /><span className="sb-label">Products</span></Link></li>
          <li><Link to="/admin/orders"    className={isActive("/admin/orders")}   ><i className="bi bi-bag-check-fill" /><span className="sb-label">Orders</span></Link></li>
          <li><Link to="/admin/kyc"       className={isActive("/admin/kyc")}      ><i className="bi bi-shield-lock-fill" /><span className="sb-label">KYC</span></Link></li>
          <li><Link to="/shop"            className={isActive("/shop")}           ><i className="bi bi-storefront" /><span className="sb-label">Marketplace</span></Link></li>
        </>
      )}
      {role === "vendor" && (
        <>
          <li><Link to="/vendor/dashboard" className={isActive("/vendor/dashboard")}><i className="bi bi-grid-fill" /><span className="sb-label">Dashboard</span></Link></li>
          <li><Link to="/vendor/products"  className={isActive("/vendor/products")} ><i className="bi bi-box-seam" /><span className="sb-label">Products</span></Link></li>
          <li><Link to="/vendor/orders"    className={isActive("/vendor/orders")}   ><i className="bi bi-bag-check-fill" /><span className="sb-label">Orders</span></Link></li>
          <li><Link to="/shop"             className={isActive("/shop")}            ><i className="bi bi-storefront" /><span className="sb-label">Marketplace</span></Link></li>
        </>
      )}
      {role === "user" && (
        <>
          <li><Link to="/shop"   className={isActive("/shop")}  ><i className="bi bi-storefront" /><span className="sb-label">Shop</span></Link></li>
          <li><Link to="/cart"   className={isActive("/cart")}  ><i className="bi bi-cart-fill" /><span className="sb-label">My Cart</span></Link></li>
          <li><Link to="/orders" className={isActive("/orders")}><i className="bi bi-bag-check-fill" /><span className="sb-label">My Orders</span></Link></li>
        </>
      )}
      <li><Link to="/me"         className={isActive("/me")}        ><i className="bi bi-person-circle" /><span className="sb-label">Profile</span></Link></li>
      <li><Link to="/categories" className={isActive("/categories")}><i className="bi bi-tags-fill" /><span className="sb-label">Categories</span></Link></li>
    </ul>
  )

  const Footer = ({ forceExpanded = false }) => (
    <div className="sidebar-footer">
      {user && (!collapsed || forceExpanded) && (
        <div className="sidebar-user">
          <div className="sidebar-avatar-sm">{initials}</div>
          <div className="sidebar-user-name">Hello, {user.firstName}</div>
        </div>
      )}
      <button onClick={handleLogout} className="sidebar-logout">
        <i className="bi bi-box-arrow-right" />
        {(!collapsed || forceExpanded) && <span>Logout</span>}
      </button>
    </div>
  )

  return (
    <>
      {/* ── MOBILE OPEN BUTTON ── */}
      <button
        className="sb-mobile-btn d-lg-none"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <i className="bi bi-layout-sidebar" />
      </button>

      {/* ── DESKTOP COLLAPSE TOGGLE ── */}
      <button
        className="sb-collapse-btn d-none d-lg-flex"
        style={{ left: collapsed ? "calc(var(--sb-collapsed) - 13px)" : "calc(var(--sb-w) - 13px)" }}
        onClick={() => setCollapsed(p => !p)}
        title={collapsed ? "Expand" : "Collapse"}
      >
        <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`} />
      </button>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className={`sidebar d-none d-lg-flex${collapsed ? " sidebar-collapsed" : ""}`}>
        <div className="sidebar-brand">
          <Link className="sidebar-brand-name" to="/">
            Nana's <span>Pourfection</span> Hub
          </Link>
          {!collapsed && <span className="sidebar-role-badge">{getRoleLabel()}</span>}
        </div>
        <NavLinks />
        <Footer />
      </aside>

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`sb-overlay${mobileOpen ? " open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ── */}
      <aside className={`sidebar sidebar-drawer d-flex d-lg-none${mobileOpen ? " open" : ""}`}>
        <button
          className="sb-drawer-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close"
        >
          <i className="bi bi-x-lg" />
        </button>
        <div className="sidebar-brand">
          <Link className="sidebar-brand-name" to="/" onClick={() => setMobileOpen(false)}>
            Nana's <span>Pourfection</span> Hub
          </Link>
          <span className="sidebar-role-badge">{getRoleLabel()}</span>
        </div>
        <NavLinks />
        <Footer forceExpanded={true} />
      </aside>
    </>
  )
}

export default Sidebar