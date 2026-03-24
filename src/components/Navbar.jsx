import { Link, useNavigate } from "react-router-dom"
import Cookies from "universal-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
// import Categories from "../pages/user/Categories"

const Navbar = () => {
  const navigate = useNavigate()
  const cookies = new Cookies()

  const token = localStorage.getItem("token")

  let user = null
  try {
    if (token) {
      user = jwtDecode(token)
    }
  } catch (error) {
    console.log(error)
  }

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log(response)
    } catch (error) {
      console.log(error)
    } finally {
      cookies.remove("token", { path: "/" })
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  return (
    <nav className="nana-navbar navbar navbar-expand-lg sticky-top">
      <div className="container-fluid px-4">

        {/* Brand */}
        <Link className="navbar-brand" to="/">
          Nana's <span style={{ color: "var(--pink)" }}>Pourfection</span> Hub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          style={{ borderColor: "rgba(255,255,255,0.3)" }}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">

          {/* Admin links */}
          {user?.roles === "admin" && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard" style={{ color: "pink" }}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/users" style={{ color: "pink" }}>Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/vendors" style={{ color: "pink" }}>Vendors</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/products" style={{ color: "pink" }}>Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/orders" style={{ color: "pink" }}>Orders</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/kyc" style={{ color: "pink" }}>KYC</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shop" style={{ color: "pink" }}>Marketplace</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/me" style={{ color: "pink" }}>Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories" style={{ color: "pink" }}>Categories</Link>
              </li>
            </ul>
          )}

          {/* Vendor links */}
          {user?.roles === "vendor" && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/vendor/dashboard" style={{ color: "pink" }}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vendor/products" style={{ color: "pink" }}>My Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/vendor/orders" style={{ color: "pink" }}>Orders</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/shop" style={{ color: "pink" }}>Marketplace</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/me" style={{ color: "pink" }}>Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories" style={{ color: "pink" }}>Categories</Link>
              </li>
            </ul>
          )}

          {/* User links */}
          {user?.roles === "user" && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/shop" style={{ color: "pink" }}> Shop</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart" style={{ color: "pink" }}>My Cart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/orders" style={{ color: "pink" }}>My Orders</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/me" style={{ color: "pink" }}>Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/categories" style={{ color: "pink" }}>Categories</Link>
              </li>
            </ul>
          )}

          <div className="d-flex align-items-center gap-3">

            {user && (
              <div className="d-flex align-items-center gap-2">
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--lavender), var(--pink))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 12, color: "#fff",
                }}>
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
                    {user.firstName} {user.lastName}
                  </div>
                  <div style={{ color: "var(--lavender)", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                    {user.roles}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="btn btn-sm"
              style={{
                background: "rgba(255,45,139,0.15)",
                color: "var(--pink)",
                border: "1px solid rgba(255,45,139,0.3)",
                fontWeight: 700, fontSize: 13,
                borderRadius: 8, padding: "6px 16px",
              }}
            >
              <i className="bi bi-box-arrow-right me-1" />
              Logout
            </button>

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar