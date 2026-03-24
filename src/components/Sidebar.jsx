import { Link, useLocation, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import axios from "axios"
import { useEffect, useState } from "react"

const Sidebar = ({ role }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const cookies  = new Cookies()

  const token = localStorage.getItem("token")

  const [user, setUser] = useState(null)

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

  const isActive = (path) => {
    if (location.pathname === path) return "active"
    return ""
  }

  const getRoleLabel = () => {
    if (role === "admin")  return "Admin Panel"
    if (role === "vendor") return "Vendor Portal"
    return "My Account"
  }

  const renderAdminLinks = () => {
    if (role !== "admin") return null
    return (
      <>
        <li><Link to="/admin/dashboard" className={`sidebar-link ${isActive("/admin/dashboard")}`}><i className="bi bi-grid-fill" /> Dashboard</Link></li>
        <li><Link to="/admin/users"     className={`sidebar-link ${isActive("/admin/users")}`}><i className="bi bi-people-fill" /> Users</Link></li>
        <li><Link to="/admin/vendors"   className={`sidebar-link ${isActive("/admin/vendors")}`}><i className="bi bi-shop" /> Vendors</Link></li>
        <li><Link to="/admin/products"  className={`sidebar-link ${isActive("/admin/products")}`}><i className="bi bi-box-seam" /> Products</Link></li>
        <li><Link to="/admin/orders"    className={`sidebar-link ${isActive("/admin/orders")}`}><i className="bi bi-bag-check-fill" /> Orders</Link></li>
        <li><Link to="/admin/kyc"       className={`sidebar-link ${isActive("/admin/kyc")}`}><i className="bi bi-shield-lock-fill" /> KYC</Link></li>
        <li><Link to="/shop"            className={`sidebar-link ${isActive("/shop")}`}><i className="bi bi-storefront" /> Marketplace</Link></li>
      </>
    )
  }

  const renderVendorLinks = () => {
    if (role !== "vendor") return null
    return (
      <>
        <li><Link to="/vendor/dashboard" className={`sidebar-link ${isActive("/vendor/dashboard")}`}><i className="bi bi-grid-fill" /> Dashboard</Link></li>
        <li><Link to="/vendor/products"  className={`sidebar-link ${isActive("/vendor/products")}`}><i className="bi bi-box-seam" /> My Products</Link></li>
        <li><Link to="/vendor/orders"    className={`sidebar-link ${isActive("/vendor/orders")}`}><i className="bi bi-bag-check-fill" /> Orders</Link></li>
        <li><Link to="/shop"             className={`sidebar-link ${isActive("/shop")}`}><i className="bi bi-storefront" /> Marketplace</Link></li>
      </>
    )
  }

  const renderUserLinks = () => {
    if (role !== "user") return null
    return (
      <>
        <li><Link to="/shop"   className={`sidebar-link ${isActive("/shop")}`}><i className="bi bi-storefront" /> Shop</Link></li>
        <li><Link to="/cart"   className={`sidebar-link ${isActive("/cart")}`}><i className="bi bi-cart-fill" /> My Cart</Link></li>
        <li><Link to="/orders" className={`sidebar-link ${isActive("/orders")}`}><i className="bi bi-bag-check-fill" /> My Orders</Link></li>
      </>
    )
  }

  const renderUserInfo = () => {
    if (!user) return null
    return (
      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {/* {user.firstName?.[0]}{user.lastName?.[0]} */}
        </div>
        <div>
          <div className="sidebar-user-name">Hello, {user.firstName}</div>
          {/* <div className="sidebar-user-role">{user.roles}</div> */}
        </div>
      </div>
    )
  }

  return (
    <div className="sidebar">

      <div className="sidebar-brand">
        <div className="sidebar-brand-name">
          <Link className="navbar-brand" to="/">
          Nana's <span style={{ color: "var(--pink)" }}>Pourfection</span> Hub
        </Link>
        </div>
        <span className="sidebar-role-badge">{getRoleLabel()}</span>
      </div>

      <ul className="sidebar-nav">
        {renderAdminLinks()}
        {renderVendorLinks()}
        {renderUserLinks()}
        <li><Link to="/me"         className={`sidebar-link ${isActive("/me")}`}><i className="bi bi-person-circle" /> Profile</Link></li>
        <li><Link to="/categories" className={`sidebar-link ${isActive("/categories")}`}><i className="bi bi-tags-fill" /> Categories</Link></li>
      </ul>

      <div className="sidebar-footer">
        {renderUserInfo()}
        <button onClick={handleLogout} className="sidebar-logout">
          <i className="bi bi-box-arrow-right me-1" />
          Logout
        </button>
      </div>

    </div>
  )
}

export default Sidebar