import { Link, useNavigate, useLocation } from "react-router-dom"
import Cookies from "universal-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const Navbar = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const cookies   = new Cookies()
  const token     = localStorage.getItem("token")

  let user = null
  try {
    if (token) user = jwtDecode(token)
  } catch (e) {
    console.log(e)
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } catch (e) {
      console.log(e)
    } finally {
      cookies.remove("token", { path: "/" })
      localStorage.removeItem("token")
      navigate("/login")
    }
  }

  const isActive = (path) =>
    location.pathname === path ? " active" : ""

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : null

  const roleLabel =
    user?.roles === "admin"  ? "Admin Panel"   :
    user?.roles === "vendor" ? "Vendor Portal" :
    user?.roles === "user"   ? "Member"        : null

  return (
    <>
      {/* ═══════════════ MAIN NAVBAR ═══════════════ */}
      <nav className="nana-navbar sticky-top">
        <div className="nana-navbar-inner">

          <Link className="nana-brand" to="/">
            Nana's <span>Pourfection</span> Hub
          </Link>

          {/* Desktop links */}
          <ul className="nana-desktop-links">
            {!user && (
              <>
                <li><Link to="/home"       className={"nana-nav-link" + isActive("/home")}>Home</Link></li>
                <li><Link to="/shop"       className={"nana-nav-link" + isActive("/shop")}>Shop</Link></li>
                <li><Link to="/categories" className={"nana-nav-link" + isActive("/categories")}>Categories</Link></li>
                <li><Link to="/contact"    className={"nana-nav-link" + isActive("/contact")}>Contact</Link></li>
              </>
            )}
            {user?.roles === "admin" && (
              <>
                <li><Link to="/admin/dashboard" className={"nana-nav-link" + isActive("/admin/dashboard")}>Dashboard</Link></li>
                <li><Link to="/admin/users"     className={"nana-nav-link" + isActive("/admin/users")}>Users</Link></li>
                <li><Link to="/admin/vendors"   className={"nana-nav-link" + isActive("/admin/vendors")}>Vendors</Link></li>
                <li><Link to="/admin/products"  className={"nana-nav-link" + isActive("/admin/products")}>Products</Link></li>
                <li><Link to="/admin/orders"    className={"nana-nav-link" + isActive("/admin/orders")}>Orders</Link></li>
                <li><Link to="/admin/kyc"       className={"nana-nav-link" + isActive("/admin/kyc")}>KYC</Link></li>
                <li><Link to="/shop"            className={"nana-nav-link" + isActive("/shop")}>Marketplace</Link></li>
                <li><Link to="/me"              className={"nana-nav-link" + isActive("/me")}>Profile</Link></li>
              </>
            )}
            {user?.roles === "vendor" && (
              <>
                <li><Link to="/vendor/dashboard" className={"nana-nav-link" + isActive("/vendor/dashboard")}>Dashboard</Link></li>
                <li><Link to="/vendor/products"  className={"nana-nav-link" + isActive("/vendor/products")}>Products</Link></li>
                <li><Link to="/vendor/orders"    className={"nana-nav-link" + isActive("/vendor/orders")}>Orders</Link></li>
                <li><Link to="/shop"             className={"nana-nav-link" + isActive("/shop")}>Marketplace</Link></li>
                <li><Link to="/me"               className={"nana-nav-link" + isActive("/me")}>Profile</Link></li>
              </>
            )}
            {user?.roles === "user" && (
              <>
                <li><Link to="/shop"       className={"nana-nav-link" + isActive("/shop")}>Shop</Link></li>
                <li><Link to="/cart"       className={"nana-nav-link" + isActive("/cart")}>Cart</Link></li>
                <li><Link to="/orders"     className={"nana-nav-link" + isActive("/orders")}>My Orders</Link></li>
                <li><Link to="/categories" className={"nana-nav-link" + isActive("/categories")}>Categories</Link></li>
                <li><Link to="/me"         className={"nana-nav-link" + isActive("/me")}>Profile</Link></li>
              </>
            )}
          </ul>

          {/* Right side */}
          <div className="nana-navbar-right">
            {user ? (
              <>
                <div className="nana-user-chip">
                  <div className="nana-avatar">{initials}</div>
                  <div className="nana-user-info">
                    <span className="nana-user-name">{user.firstName}</span>
                    {roleLabel && <span className="nana-user-role">{roleLabel}</span>}
                  </div>
                </div>
                <button onClick={handleLogout} className="nana-logout-btn">
                  <i className="bi bi-box-arrow-right" />
                  <span className="nana-logout-label">Logout</span>
                </button>
              </>
            ) : (
              <div className="nana-guest-btns">
                <Link to="/login"    className="nana-btn-ghost">Login</Link>
                <Link to="/register" className="nana-btn-solid">Register</Link>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="nana-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#nanaOffcanvas"
              aria-label="Open menu"
            >
              <i className="bi bi-list" />
            </button>
          </div>

        </div>
      </nav>

      {/* ═══════════════ OFFCANVAS ═══════════════ */}
      <div
        className="offcanvas offcanvas-end nana-offcanvas"
        tabIndex="-1"
        id="nanaOffcanvas"
        data-bs-scroll="true"
        data-bs-backdrop="true"
      >
        <div className="nana-oc-header">
          <Link className="nana-brand" style={{ fontSize: 15 }} to="/" data-bs-dismiss="offcanvas">
            Nana's <span>Pourfection</span> Hub
          </Link>
          <button className="nana-oc-close" data-bs-dismiss="offcanvas" aria-label="Close">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="nana-oc-body">
          {user && (
            <div className="nana-oc-user">
              <div className="nana-avatar nana-avatar-lg">{initials}</div>
              <div>
                <div className="nana-oc-name">{user.firstName} {user.lastName}</div>
                {roleLabel && <div className="nana-oc-role">{roleLabel}</div>}
              </div>
            </div>
          )}

          <ul className="nana-oc-nav">
            {!user && (
              <>
                <li><Link to="/home"       className={"nana-oc-link" + isActive("/home")}       data-bs-dismiss="offcanvas"><i className="bi bi-house-fill" />Home</Link></li>
                <li><Link to="/shop"       className={"nana-oc-link" + isActive("/shop")}       data-bs-dismiss="offcanvas"><i className="bi bi-storefront" />Shop</Link></li>
                <li><Link to="/categories" className={"nana-oc-link" + isActive("/categories")} data-bs-dismiss="offcanvas"><i className="bi bi-tags-fill" />Categories</Link></li>
                <li><Link to="/contact"    className={"nana-oc-link" + isActive("/contact")}    data-bs-dismiss="offcanvas"><i className="bi bi-chat-dots-fill" />Contact</Link></li>
              </>
            )}
            {user?.roles === "admin" && (
              <>
                <li><Link to="/admin/dashboard" className={"nana-oc-link" + isActive("/admin/dashboard")} data-bs-dismiss="offcanvas"><i className="bi bi-grid-fill" />Dashboard</Link></li>
                <li><Link to="/admin/users"     className={"nana-oc-link" + isActive("/admin/users")}     data-bs-dismiss="offcanvas"><i className="bi bi-people-fill" />Users</Link></li>
                <li><Link to="/admin/vendors"   className={"nana-oc-link" + isActive("/admin/vendors")}   data-bs-dismiss="offcanvas"><i className="bi bi-shop" />Vendors</Link></li>
                <li><Link to="/admin/products"  className={"nana-oc-link" + isActive("/admin/products")}  data-bs-dismiss="offcanvas"><i className="bi bi-box-seam" />Products</Link></li>
                <li><Link to="/admin/orders"    className={"nana-oc-link" + isActive("/admin/orders")}    data-bs-dismiss="offcanvas"><i className="bi bi-bag-check-fill" />Orders</Link></li>
                <li><Link to="/admin/kyc"       className={"nana-oc-link" + isActive("/admin/kyc")}       data-bs-dismiss="offcanvas"><i className="bi bi-shield-lock-fill" />KYC</Link></li>
                <li><Link to="/shop"            className={"nana-oc-link" + isActive("/shop")}            data-bs-dismiss="offcanvas"><i className="bi bi-storefront" />Marketplace</Link></li>
                <li><Link to="/me"              className={"nana-oc-link" + isActive("/me")}              data-bs-dismiss="offcanvas"><i className="bi bi-person-circle" />Profile</Link></li>
                <li><Link to="/categories"      className={"nana-oc-link" + isActive("/categories")}      data-bs-dismiss="offcanvas"><i className="bi bi-tags-fill" />Categories</Link></li>
              </>
            )}
            {user?.roles === "vendor" && (
              <>
                <li><Link to="/vendor/dashboard" className={"nana-oc-link" + isActive("/vendor/dashboard")} data-bs-dismiss="offcanvas"><i className="bi bi-grid-fill" />Dashboard</Link></li>
                <li><Link to="/vendor/products"  className={"nana-oc-link" + isActive("/vendor/products")}  data-bs-dismiss="offcanvas"><i className="bi bi-box-seam" />Products</Link></li>
                <li><Link to="/vendor/orders"    className={"nana-oc-link" + isActive("/vendor/orders")}    data-bs-dismiss="offcanvas"><i className="bi bi-bag-check-fill" />Orders</Link></li>
                <li><Link to="/shop"             className={"nana-oc-link" + isActive("/shop")}             data-bs-dismiss="offcanvas"><i className="bi bi-storefront" />Marketplace</Link></li>
                <li><Link to="/me"               className={"nana-oc-link" + isActive("/me")}               data-bs-dismiss="offcanvas"><i className="bi bi-person-circle" />Profile</Link></li>
                <li><Link to="/categories"       className={"nana-oc-link" + isActive("/categories")}       data-bs-dismiss="offcanvas"><i className="bi bi-tags-fill" />Categories</Link></li>
              </>
            )}
            {user?.roles === "user" && (
              <>
                <li><Link to="/shop"       className={"nana-oc-link" + isActive("/shop")}       data-bs-dismiss="offcanvas"><i className="bi bi-storefront" />Shop</Link></li>
                <li><Link to="/cart"       className={"nana-oc-link" + isActive("/cart")}       data-bs-dismiss="offcanvas"><i className="bi bi-cart-fill" />Cart</Link></li>
                <li><Link to="/orders"     className={"nana-oc-link" + isActive("/orders")}     data-bs-dismiss="offcanvas"><i className="bi bi-bag-check-fill" />My Orders</Link></li>
                <li><Link to="/categories" className={"nana-oc-link" + isActive("/categories")} data-bs-dismiss="offcanvas"><i className="bi bi-tags-fill" />Categories</Link></li>
                <li><Link to="/me"         className={"nana-oc-link" + isActive("/me")}         data-bs-dismiss="offcanvas"><i className="bi bi-person-circle" />Profile</Link></li>
              </>
            )}
          </ul>

          <div className="nana-oc-footer">
            {user ? (
              <button onClick={handleLogout} className="nana-logout-btn w-100" style={{ justifyContent: "center" }}>
                <i className="bi bi-box-arrow-right" /> Logout
              </button>
            ) : (
              <>
                <Link to="/login"    className="nana-btn-ghost w-100 text-center mb-2" data-bs-dismiss="offcanvas">Login</Link>
                <Link to="/register" className="nana-btn-solid w-100 text-center"      data-bs-dismiss="offcanvas">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar