import { Link, useNavigate, useLocation } from "react-router-dom"
import Cookies from "universal-cookie"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const cookies  = new Cookies()
  const token    = localStorage.getItem("token")

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
    location.pathname === path ? "nana-nav-link active" : "nana-nav-link"

  const adminLinks = [
    { to: "/admin/dashboard", icon: "bi-grid-fill",        label: "Dashboard"   },
    { to: "/admin/users",     icon: "bi-people-fill",      label: "Users"       },
    { to: "/admin/vendors",   icon: "bi-shop",             label: "Vendors"     },
    { to: "/admin/products",  icon: "bi-box-seam",         label: "Products"    },
    { to: "/admin/orders",    icon: "bi-bag-check-fill",   label: "Orders"      },
    { to: "/admin/kyc",       icon: "bi-shield-lock-fill", label: "KYC"         },
    { to: "/shop",            icon: "bi-storefront",       label: "Marketplace" },
    { to: "/me",              icon: "bi-person-circle",    label: "Profile"     },
  ]

  const vendorLinks = [
    { to: "/vendor/dashboard", icon: "bi-grid-fill",      label: "Dashboard"   },
    { to: "/vendor/products",  icon: "bi-box-seam",       label: "Products"    },
    { to: "/vendor/orders",    icon: "bi-bag-check-fill", label: "Orders"      },
    { to: "/shop",             icon: "bi-storefront",     label: "Marketplace" },
    { to: "/me",               icon: "bi-person-circle",  label: "Profile"     },
  ]

  const userLinks = [
    { to: "/shop",       icon: "bi-storefront",      label: "Shop"       },
    { to: "/cart",       icon: "bi-cart-fill",       label: "Cart"       },
    { to: "/orders",     icon: "bi-bag-check-fill",  label: "My Orders"  },
    { to: "/categories", icon: "bi-tags-fill",       label: "Categories" },
    { to: "/me",         icon: "bi-person-circle",   label: "Profile"    },
  ]

  const guestLinks = [
    { to: "/home",       icon: "bi-house-fill",      label: "Home"       },
    { to: "/shop",       icon: "bi-storefront",      label: "Shop"       },
    { to: "/categories", icon: "bi-tags-fill",       label: "Categories" },
    { to: "/contact",    icon: "bi-chat-dots-fill",  label: "Contact"    },
  ]

  const links =
    user?.roles === "admin"  ? adminLinks  :
    user?.roles === "vendor" ? vendorLinks :
    user?.roles === "user"   ? userLinks   :
    guestLinks

  const roleLabel =
    user?.roles === "admin"  ? "Admin Panel"   :
    user?.roles === "vendor" ? "Vendor Portal" :
    user?.roles === "user"   ? "Member"        : null

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : null

  return (
    <>
      <nav className="nana-navbar sticky-top">
        <div className="nana-navbar-inner">

          <Link className="nana-brand" to="/">
            Nana's <span>Pourfection</span> Hub
          </Link>

          <ul className="nana-nav-links">
            {links.map(l => (
              <li key={l.to}>
                <Link to={l.to} className={isActive(l.to)}>{l.label}</Link>
              </li>
            ))}
          </ul>

          <div className="nana-navbar-right">
            {user && (
              <div className="nana-user-chip">
                <div className="nana-avatar">{initials}</div>
                <div className="nana-user-info">
                  <span className="nana-user-name">{user.firstName}</span>
                  {roleLabel && <span className="nana-user-role">{roleLabel}</span>}
                </div>
              </div>
            )}

            {user ? (
              <button onClick={handleLogout} className="nana-logout-btn">
                <i className="bi bi-box-arrow-right" />
                <span className="d-none d-lg-inline">Logout</span>
              </button>
            ) : (
              <div className="nana-auth-btns d-none d-lg-flex">
                <Link to="/login"    className="nana-btn-outline">Login</Link>
                <Link to="/register" className="nana-btn-solid">Register</Link>
              </div>
            )}

            <button
              className="nana-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#nanaMobileMenu"
              aria-label="Open menu"
            >
              <i className="bi bi-list" />
            </button>
          </div>

        </div>
      </nav>

      {/* ── OFFCANVAS MOBILE MENU ─────────────────────────────── */}
      <div
        className="offcanvas offcanvas-end nana-offcanvas"
        tabIndex="-1"
        id="nanaMobileMenu"
        data-bs-scroll="true"
        data-bs-backdrop="true"
      >
        <div className="nana-offcanvas-header">
          <div className="nana-brand" style={{ fontSize: 15 }}>
            Nana's <span>Pourfection</span> Hub
          </div>
          <button
            type="button"
            className="nana-offcanvas-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="nana-offcanvas-body">
          {user && (
            <div className="nana-offcanvas-user">
              <div className="nana-avatar nana-avatar-lg">{initials}</div>
              <div>
                <div className="nana-offcanvas-user-name">
                  {user.firstName} {user.lastName}
                </div>
                {roleLabel && (
                  <div className="nana-offcanvas-user-role">{roleLabel}</div>
                )}
              </div>
            </div>
          )}

          <ul className="nana-offcanvas-nav">
            {links.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`nana-offcanvas-link${location.pathname === l.to ? " active" : ""}`}
                  data-bs-dismiss="offcanvas"
                >
                  <i className={`bi ${l.icon}`} />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nana-offcanvas-footer">
            {user ? (
              <button
                onClick={handleLogout}
                className="nana-logout-btn w-100"
                style={{ justifyContent: "center" }}
              >
                <i className="bi bi-box-arrow-right" />
                Logout
              </button>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Link to="/login"    className="nana-btn-outline text-center" data-bs-dismiss="offcanvas">Login</Link>
                <Link to="/register" className="nana-btn-solid text-center"   data-bs-dismiss="offcanvas">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar