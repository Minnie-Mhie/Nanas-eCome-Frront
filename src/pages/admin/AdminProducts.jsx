import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminProducts.css"

const CATEGORIES = [
  "Lip Care",
  "Resin Art",
  "Skincare",
  "Jewellery",
  "Hair Care",
  "Nail Care",
  "Body Care",
  "Other",
]

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [modal, setModal]       = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/all`, { headers })
      setProducts(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to fetch products", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const formik = useFormik({
    initialValues: {
      productName:        "",
      productPrice:       "",
      productQuantity:    "",
      productDescription: "",
      productImage:       "",
      category:           "",
      customCategory:     "",
      videoUrl:           "",
    },
    validationSchema: yup.object({
      productName:        yup.string().required("Product name is required"),
      productPrice:       yup.number().required("Price is required").min(1, "Price must be greater than 0"),
      productQuantity:    yup.number().required("Quantity is required").min(1, "Quantity must be at least 1"),
      productDescription: yup.string().required("Description is required"),
      productImage:       yup.string().required("Product image is required"),
      category:           yup.string().required("Category is required"),
      customCategory:     yup.string().when("category", {
        is: "Other",
        then: (schema) => schema.required("Please specify your category"),
        otherwise: (schema) => schema.notRequired(),
      }),
      videoUrl: yup.string().url("Please enter a valid URL").notRequired(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const finalCategory = values.category === "Other" ? values.customCategory : values.category
        await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/products/add`, {
          productName:        values.productName,
          productPrice:       values.productPrice,
          productQuantity:    values.productQuantity,
          productDescription: values.productDescription,
          productImage:       values.productImage,
          category:           finalCategory,
          videoUrl:           values.videoUrl,
        }, { headers })
        showModal("Product Added!", "Your product is now live in the marketplace.", "success")
        resetForm()
        setShowForm(false)
        fetchProducts()
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to add product", "danger")
      }
    },
  })

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await toBase64(file)
      formik.setFieldValue("productImage", base64)
    }
  }

  const handleApprove = (productId) => {
    showModal("Approve Product", "Approve this product? It will be visible in the marketplace.", "success",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/products/approve/${productId}`, {}, { headers })
          showModal("Approved", "Product approved and now live", "success")
          fetchProducts()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to approve product", "danger")
        }
      }
    )
  }

  const handleReject = (productId) => {
    showModal("Reject Product", "Are you sure you want to reject this product?", "danger",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/products/reject/${productId}`, {}, { headers })
          showModal("Rejected", "Product has been rejected", "info")
          fetchProducts()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to reject product", "danger")
        }
      }
    )
  }

  const getBadgeClass = (status) => {
    if (status === "approved") return "badge-approved"
    if (status === "rejected") return "badge-rejected"
    return "badge-pending"
  }

  const displayed = filter === "all" ? products : products.filter(p => p.status === filter)

  const renderForm = () => {
    if (!showForm) return null

    return (
      <div className="card admin-form-card fade-up">
        <div className="card-body">
          <h5 className="admin-form-title">Add New Product</h5>
          <form onSubmit={formik.handleSubmit}>
            <div className="row g-3">

              <div className="col-md-6">
                <label>Product Name</label>
                <input
                  name="productName" type="text"
                  className={`form-control ${formik.touched.productName && formik.errors.productName ? "is-invalid" : ""}`}
                  placeholder="e.g. Handmade Resin Bowl"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productName}
                />
                {formik.touched.productName && formik.errors.productName && (
                  <div className="invalid-feedback">{formik.errors.productName}</div>
                )}
              </div>

              <div className="col-md-3">
                <label>Price (₦)</label>
                <input
                  name="productPrice" type="number"
                  className={`form-control ${formik.touched.productPrice && formik.errors.productPrice ? "is-invalid" : ""}`}
                  placeholder="0.00"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productPrice}
                />
                {formik.touched.productPrice && formik.errors.productPrice && (
                  <div className="invalid-feedback">{formik.errors.productPrice}</div>
                )}
              </div>

              <div className="col-md-3">
                <label>Quantity</label>
                <input
                  name="productQuantity" type="number"
                  className={`form-control ${formik.touched.productQuantity && formik.errors.productQuantity ? "is-invalid" : ""}`}
                  placeholder="0"
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productQuantity}
                />
                {formik.touched.productQuantity && formik.errors.productQuantity && (
                  <div className="invalid-feedback">{formik.errors.productQuantity}</div>
                )}
              </div>

              <div className="col-md-6">
                <label>Category</label>
                <select
                  name="category"
                  className={`form-select ${formik.touched.category && formik.errors.category ? "is-invalid" : ""}`}
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.category}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="invalid-feedback">{formik.errors.category}</div>
                )}
              </div>

              {formik.values.category === "Other" && (
                <div className="col-md-6">
                  <label>Specify Category</label>
                  <input
                    name="customCategory" type="text"
                    className={`form-control ${formik.touched.customCategory && formik.errors.customCategory ? "is-invalid" : ""}`}
                    placeholder="e.g. Candles"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.customCategory}
                  />
                  {formik.touched.customCategory && formik.errors.customCategory && (
                    <div className="invalid-feedback">{formik.errors.customCategory}</div>
                  )}
                </div>
              )}

              <div className="col-12">
                <label>
                  Product Demo Video URL
                  <span className="admin-optional-label">(optional)</span>
                </label>
                <input
                  name="videoUrl" type="url"
                  className={`form-control ${formik.touched.videoUrl && formik.errors.videoUrl ? "is-invalid" : ""}`}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.videoUrl}
                />
                {formik.touched.videoUrl && formik.errors.videoUrl && (
                  <div className="invalid-feedback">{formik.errors.videoUrl}</div>
                )}
                <span className="admin-video-hint">
                  <i className="bi bi-youtube" />
                  Paste a YouTube link. Customers can watch the demo without leaving the app.
                </span>
              </div>

              <div className="col-12">
                <label>Description</label>
                <textarea
                  name="productDescription" rows={3}
                  className={`form-control ${formik.touched.productDescription && formik.errors.productDescription ? "is-invalid" : ""}`}
                  placeholder="Describe your product..."
                  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.productDescription}
                />
                {formik.touched.productDescription && formik.errors.productDescription && (
                  <div className="invalid-feedback">{formik.errors.productDescription}</div>
                )}
              </div>

              <div className="col-12">
                <label>Product Image</label>
                <input
                  type="file" accept="image/*"
                  className={`form-control ${formik.touched.productImage && formik.errors.productImage ? "is-invalid" : ""}`}
                  onChange={handleImageChange}
                  onBlur={() => formik.setFieldTouched("productImage", true)}
                />
                {formik.touched.productImage && formik.errors.productImage && (
                  <div className="invalid-feedback">{formik.errors.productImage}</div>
                )}
                {formik.values.productImage && (
                  <img src={formik.values.productImage} alt="preview" className="admin-product-img-preview" />
                )}
              </div>

            </div>

            <div className="admin-form-notice">
              <small>
                <i className="bi bi-info-circle-fill me-1" />
                As admin, your product goes live immediately without requiring approval.
              </small>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                {formik.isSubmitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                  : <><i className="bi bi-plus-circle-fill me-2" />Add Product</>
                }
              </button>
              <button
                type="button" className="btn btn-ghost"
                onClick={() => { setShowForm(false); formik.resetForm() }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const renderActions = (product) => {
    if (product.status === "pending") {
      return (
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => handleApprove(product._id)}>Approve</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleReject(product._id)}>Reject</button>
        </div>
      )
    }
    if (product.status === "rejected") {
      return (
        <button className="btn btn-success btn-sm" onClick={() => handleApprove(product._id)}>Approve</button>
      )
    }
    return (
      <span className="product-live-text">
        <i className="bi bi-check-circle-fill me-1" />Live
      </span>
    )
  }

  const renderTable = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (displayed.length === 0) {
      return (
        <div className="text-center py-4 text-muted">No products found</div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Vendor</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img className="product-thumb" src={product.productImage?.secure_url} alt={product.productName} />
                    <div>
                      <div className="product-name">{product.productName}</div>
                      <div className="product-desc-preview">{product.productDescription?.substring(0, 40)}...</div>
                    </div>
                  </div>
                </td>
                <td className="product-vendor-name">{product.vendor?.storeName || "—"}</td>
                <td className="product-price">₦{product.productPrice?.toLocaleString()}</td>
                <td className="product-qty">{product.productQuantity}</td>
                <td><span className={`badge ${getBadgeClass(product.status)}`}>{product.status}</span></td>
                <td className="product-date">{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>{renderActions(product)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="admin" />
      <div className="main-content w-100">

        <div className="admin-products-header">
          <div>
            <h2>Products</h2>
            <p className="admin-products-sub">Review, approve and add products</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="admin-products-total">Total: {products.length}</div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`} />
              {showForm ? "Cancel" : "Add Product"}
            </button>
          </div>
        </div>

        {renderForm()}

        <div className="card mb-4">
          <div className="card-body py-2">
            <div className="d-flex gap-2">
              {["all", "pending", "approved", "rejected"].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm text-capitalize ${filter === f ? "btn-navy" : "btn-ghost"}`}
                  onClick={() => setFilter(f)}
                >
                  {f} {f !== "all" && `(${products.filter(p => p.status === f).length})`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">{renderTable()}</div>

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default AdminProducts