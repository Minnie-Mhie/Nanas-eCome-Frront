import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/Cart.css"

const Cart = () => {
  const [cart, setCart]               = useState(null)
  const [total, setTotal]             = useState(0)
  const [loading, setLoading]         = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [modal, setModal]             = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }
  const navigate = useNavigate()

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/cart`, { headers })
      setCart(res.data.data)
      setTotal(res.data.total || 0)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to load cart", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCart() }, [])

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/cart/update`, { productId, quantity }, { headers })
      fetchCart()
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to update quantity", "danger")
    }
  }

  const handleRemove = (productId) => {
    showModal("Remove Item", "Remove this item from your cart?", "warning",
      async () => {
        try {
          await axios.delete(`http://localhost:5000/api/v1/cart/remove/${productId}`, { headers })
          fetchCart()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to remove item", "danger")
        }
      }
    )
  }

  const handleClearCart = () => {
    showModal("Clear Cart", "Are you sure you want to remove all items from your cart?", "danger",
      async () => {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/cart/clear`, { headers })
          fetchCart()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to clear cart", "danger")
        }
      }
    )
  }

  const formik = useFormik({
    initialValues: {
      street:  "",
      city:    "",
      state:   "",
      country: "",
    },
    validationSchema: yup.object({
      street:  yup.string().required("Street address is required"),
      city:    yup.string().required("City is required"),
      state:   yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
    }),
    onSubmit: async (values) => {
      setPlacingOrder(true)
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/orders/place`, values, { headers })
        showModal("Order Placed!", "Your order has been placed successfully. You can track it in My Orders.", "success")
        setShowCheckout(false)
        fetchCart()
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to place order", "danger")
      } finally {
        setPlacingOrder(false)
      }
    },
  })

  const isEmpty = !cart || cart.items?.length === 0

  const renderContent = () => {
    if (loading) {
      return (
        <div className="cart-loading">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (isEmpty) {
      return (
        <div className="cart-empty">
          <i className="bi bi-cart-x cart-empty-icon" />
          <h4>Your cart is empty</h4>
          <p>Browse the marketplace and add products you love</p>
          <button className="btn btn-primary" onClick={() => navigate("/shop")}>
            <i className="bi bi-shop me-2" />Browse Products
          </button>
        </div>
      )
    }

    return (
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card">
            {cart.items.map((item, index) => (
              <div
                key={item.product?._id}
                className={index < cart.items.length - 1 ? "cart-item cart-item-border" : "cart-item"}
              >
                <img
                  src={item.product?.productImage?.secure_url}
                  alt={item.product?.productName}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product?.productName}</div>
                  <div className="cart-item-store">
                    <i className="bi bi-shop me-1" />
                    {item.product?.vendor?.storeName || "Store"}
                  </div>
                  <div className="cart-item-price">₦{item.product?.productPrice?.toLocaleString()}</div>
                </div>

                <div className="cart-qty-controls">
                  <button
                    className="btn btn-ghost btn-sm cart-qty-btn"
                    onClick={() => handleUpdateQuantity(item.product?._id, item.quantity - 1)}
                  >
                    <i className="bi bi-dash" />
                  </button>
                  <span className="cart-qty-value">{item.quantity}</span>
                  <button
                    className="btn btn-ghost btn-sm cart-qty-btn"
                    onClick={() => handleUpdateQuantity(item.product?._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product?.productQuantity}
                  >
                    <i className="bi bi-plus" />
                  </button>
                </div>

                <div className="cart-item-total">
                  ₦{(item.product?.productPrice * item.quantity)?.toLocaleString()}
                </div>

                <button
                  className="btn btn-danger btn-sm cart-remove-btn"
                  onClick={() => handleRemove(item.product?._id)}
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <div className="cart-summary-title">Order Summary</div>
              {cart.items.map(item => (
                <div key={item.product?._id} className="cart-summary-row">
                  <div className="cart-summary-label">
                    {item.product?.productName} × {item.quantity}
                  </div>
                  <div className="cart-summary-value">
                    ₦{(item.product?.productPrice * item.quantity)?.toLocaleString()}
                  </div>
                </div>
              ))}
              <div className="cart-summary-total-row">
                <div className="cart-summary-total-label">Total</div>
                <div className="cart-summary-total-value">₦{total?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary w-100 py-2"
            onClick={() => setShowCheckout(!showCheckout)}
          >
            <i className="bi bi-bag-check-fill me-2" />
            {showCheckout ? "Hide Checkout" : "Proceed to Checkout"}
          </button>

          {renderCheckoutForm()}
        </div>
      </div>
    )
  }

  const renderCheckoutForm = () => {
    if (!showCheckout) {
      return null
    }

    return (
      <div className="card cart-checkout-card mt-3 fade-up">
        <div className="card-body">
          <div className="cart-checkout-title">
            <i className="bi bi-truck me-2" />Shipping Address
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label>Street Address</label>
              <input
                name="street" type="text"
                className={`form-control ${formik.touched.street && formik.errors.street ? "is-invalid" : ""}`}
                placeholder="123 Main St"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.street}
              />
              {formik.touched.street && formik.errors.street && (
                <div className="invalid-feedback">{formik.errors.street}</div>
              )}
            </div>
            <div className="mb-3">
              <label>City</label>
              <input
                name="city" type="text"
                className={`form-control ${formik.touched.city && formik.errors.city ? "is-invalid" : ""}`}
                placeholder="Lagos"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.city}
              />
              {formik.touched.city && formik.errors.city && (
                <div className="invalid-feedback">{formik.errors.city}</div>
              )}
            </div>
            <div className="mb-3">
              <label>State</label>
              <input
                name="state" type="text"
                className={`form-control ${formik.touched.state && formik.errors.state ? "is-invalid" : ""}`}
                placeholder="Lagos State"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.state}
              />
              {formik.touched.state && formik.errors.state && (
                <div className="invalid-feedback">{formik.errors.state}</div>
              )}
            </div>
            <div className="mb-3">
              <label>Country</label>
              <input
                name="country" type="text"
                className={`form-control ${formik.touched.country && formik.errors.country ? "is-invalid" : ""}`}
                placeholder="Nigeria"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.country}
              />
              {formik.touched.country && formik.errors.country && (
                <div className="invalid-feedback">{formik.errors.country}</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={placingOrder}>
              {placingOrder
                ? <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                : <><i className="bi bi-check-circle-fill me-2" />Place Order</>
              }
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="user" />
      <div className="main-content w-100">

        <div className="cart-header">
          <div className="cart-header-left">
            <h2>My Cart</h2>
            <p className="cart-header-sub">
              {isEmpty ? "Your cart is empty" : `${cart?.items?.length} item(s) in your cart`}
            </p>
          </div>
          <div className="cart-header-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/shop")}>
              <i className="bi bi-arrow-left me-2" />Continue Shopping
            </button>
            {!isEmpty && (
              <button className="btn btn-danger" onClick={handleClearCart}>
                <i className="bi bi-trash me-2" />Clear Cart
              </button>
            )}
          </div>
        </div>

        {renderContent()}

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => {
          setModal({ ...modal, isOpen: false })
          if (modal.title === "Order Placed!") navigate("/orders")
        }}
      />
    </div>
  )
}

export default Cart