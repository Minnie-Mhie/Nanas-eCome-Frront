import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as yup from "yup"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/VendorProduct.css"

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

const VendorProducts = () => {
  const [products, setProducts]       = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [modal, setModal]             = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/mine`, { headers })
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

  const handleEditClick = (product) => {
    setShowForm(false)
    setEditProduct(product)
    editFormik.setValues({
      productName:        product.productName,
      productPrice:       product.productPrice,
      productQuantity:    product.productQuantity,
      productDescription: product.productDescription,
      category:           CATEGORIES.includes(product.category) ? product.category : "Other",
      customCategory:     CATEGORIES.includes(product.category) ? "" : product.category,
      videoUrl:           product.videoUrl || "",
      productImage:       product.productImage?.secure_url || "",
    })
  }

  const handleCancelEdit = () => {
    setEditProduct(null)
    editFormik.resetForm()
  }

  const handleImageChange = async (e, formikInstance) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await toBase64(file)
      formikInstance.setFieldValue("productImage", base64)
    }
  }

  const getBadgeClass = (status) => {
    if (status === "approved") return "badge-approved"
    if (status === "rejected") return "badge-rejected"
    return "badge-pending"
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
        showModal("Product Submitted!", "Your product has been submitted and is awaiting admin approval.", "success")
        resetForm()
        setShowForm(false)
        fetchProducts()
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to add product", "danger")
      }
    },
  })

  const editFormik = useFormik({
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
        await axios.patch(`http://localhost:5000/api/v1/products/edit/${editProduct._id}`, {
          productName:        values.productName,
          productPrice:       values.productPrice,
          productQuantity:    values.productQuantity,
          productDescription: values.productDescription,
          productImage:       values.productImage,
          category:           finalCategory,
          videoUrl:           values.videoUrl,
        }, { headers })
        showModal("Product Updated!", "Your product has been updated and is awaiting admin re-approval.", "success")
        resetForm()
        setEditProduct(null)
        fetchProducts()
      } catch (error) {
        console.log(error)
        showModal("Error", error.response?.data?.message || "Failed to update product", "danger")
      }
    },
  })

  const renderProductForm = (formikInstance, isEdit) => {
    const noticeText = isEdit
      ? "After editing, your product will be sent back for admin review before going live again."
      : "Your product will be reviewed by an admin before it goes live in the marketplace."

    const submitLabel = isEdit ? "Save Changes" : "Submit for Review"
    const submitIcon  = isEdit ? "bi-pencil-fill" : "bi-send-fill"
    const loadingLabel = isEdit ? "Saving..." : "Submitting..."

    const handleCancel = () => {
      if (isEdit) {
        handleCancelEdit()
      } else {
        setShowForm(false)
        formik.resetForm()
      }
    }

    return (
      <form onSubmit={formikInstance.handleSubmit}>
        <div className="row g-3">

          <div className="col-md-6">
            <label>Product Name</label>
            <input
              name="productName" type="text"
              className={`form-control ${formikInstance.touched.productName && formikInstance.errors.productName ? "is-invalid" : ""}`}
              placeholder="e.g. Handmade Resin Bowl"
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.productName}
            />
            {formikInstance.touched.productName && formikInstance.errors.productName && (
              <div className="invalid-feedback">{formikInstance.errors.productName}</div>
            )}
          </div>

          <div className="col-md-3">
            <label>Price (₦)</label>
            <input
              name="productPrice" type="number"
              className={`form-control ${formikInstance.touched.productPrice && formikInstance.errors.productPrice ? "is-invalid" : ""}`}
              placeholder="0.00"
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.productPrice}
            />
            {formikInstance.touched.productPrice && formikInstance.errors.productPrice && (
              <div className="invalid-feedback">{formikInstance.errors.productPrice}</div>
            )}
          </div>

          <div className="col-md-3">
            <label>Quantity</label>
            <input
              name="productQuantity" type="number"
              className={`form-control ${formikInstance.touched.productQuantity && formikInstance.errors.productQuantity ? "is-invalid" : ""}`}
              placeholder="0"
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.productQuantity}
            />
            {formikInstance.touched.productQuantity && formikInstance.errors.productQuantity && (
              <div className="invalid-feedback">{formikInstance.errors.productQuantity}</div>
            )}
          </div>

          <div className="col-md-6">
            <label>Category</label>
            <select
              name="category"
              className={`form-select ${formikInstance.touched.category && formikInstance.errors.category ? "is-invalid" : ""}`}
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.category}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {formikInstance.touched.category && formikInstance.errors.category && (
              <div className="invalid-feedback">{formikInstance.errors.category}</div>
            )}
          </div>

          {formikInstance.values.category === "Other" && (
            <div className="col-md-6">
              <label>Specify Category</label>
              <input
                name="customCategory" type="text"
                className={`form-control ${formikInstance.touched.customCategory && formikInstance.errors.customCategory ? "is-invalid" : ""}`}
                placeholder="e.g. Candles"
                onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.customCategory}
              />
              {formikInstance.touched.customCategory && formikInstance.errors.customCategory && (
                <div className="invalid-feedback">{formikInstance.errors.customCategory}</div>
              )}
            </div>
          )}

          <div className="col-12">
            <label>
              Product Demo Video URL
              <span className="vendor-optional-label">(optional)</span>
            </label>
            <input
              name="videoUrl" type="url"
              className={`form-control ${formikInstance.touched.videoUrl && formikInstance.errors.videoUrl ? "is-invalid" : ""}`}
              placeholder="e.g. https://www.youtube.com/watch?v=..."
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.videoUrl}
            />
            {formikInstance.touched.videoUrl && formikInstance.errors.videoUrl && (
              <div className="invalid-feedback">{formikInstance.errors.videoUrl}</div>
            )}
            <span className="vendor-video-hint">
              <i className="bi bi-youtube" />
              Paste a YouTube link. Customers will be able to watch the demo without leaving the app.
            </span>
          </div>

          <div className="col-12">
            <label>Description</label>
            <textarea
              name="productDescription" rows={3}
              className={`form-control ${formikInstance.touched.productDescription && formikInstance.errors.productDescription ? "is-invalid" : ""}`}
              placeholder="Describe your product..."
              onChange={formikInstance.handleChange} onBlur={formikInstance.handleBlur} value={formikInstance.values.productDescription}
            />
            {formikInstance.touched.productDescription && formikInstance.errors.productDescription && (
              <div className="invalid-feedback">{formikInstance.errors.productDescription}</div>
            )}
          </div>

          <div className="col-12">
            <label>
              Product Image
              {isEdit && <span className="vendor-image-label-note">(upload new to replace current)</span>}
            </label>
            <input
              type="file" accept="image/*"
              className={`form-control ${formikInstance.touched.productImage && formikInstance.errors.productImage ? "is-invalid" : ""}`}
              onChange={(e) => handleImageChange(e, formikInstance)}
              onBlur={() => formikInstance.setFieldTouched("productImage", true)}
            />
            {formikInstance.touched.productImage && formikInstance.errors.productImage && (
              <div className="invalid-feedback">{formikInstance.errors.productImage}</div>
            )}
            {formikInstance.values.productImage && (
              <img src={formikInstance.values.productImage} alt="preview" className="vendor-img-preview" />
            )}
          </div>

        </div>

        <div className="vendor-form-notice">
          <small>
            <i className="bi bi-info-circle-fill me-1" />
            {noticeText}
          </small>
        </div>

        <div className="vendor-form-actions">
          <button type="submit" className="btn btn-primary" disabled={formikInstance.isSubmitting}>
            {formikInstance.isSubmitting
              ? <><span className="spinner-border spinner-border-sm me-2" />{loadingLabel}</>
              : <><i className={`bi ${submitIcon} me-2`} />{submitLabel}</>
            }
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    )
  }

  const renderTable = () => {
    if (loading) {
      return (
        <div className="vendor-table-loading">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="vendor-table-empty">
          <i className="bi bi-box-seam" />
          No products yet. Click "Add Product" to get started.
        </div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <img src={product.productImage?.secure_url} alt={product.productName} className="vendor-product-img" />
                    <div>
                      <div className="vendor-product-name">{product.productName}</div>
                      <div className="vendor-product-desc">{product.productDescription?.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="vendor-product-category">{product.category || "—"}</td>
                <td className="vendor-product-price">₦{product.productPrice?.toLocaleString()}</td>
                <td className="vendor-product-qty">{product.productQuantity}</td>
                <td><span className={`badge ${getBadgeClass(product.status)}`}>{product.status}</span></td>
                <td className="vendor-product-date">{new Date(product.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(product)}>
                    <i className="bi bi-pencil-fill me-1" />Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="d-flex">
      <Sidebar role="vendor" />
      <div className="main-content w-100">

        <div className="vendor-products-header">
          <div>
            <h2>My Products</h2>
            <p className="vendor-products-sub">Manage and submit your products for approval</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => { setShowForm(!showForm); setEditProduct(null) }}
          >
            <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`} />
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && (
          <div className="card vendor-form-card fade-up">
            <div className="card-body">
              <h5 className="vendor-form-title">New Product</h5>
              {renderProductForm(formik, false)}
            </div>
          </div>
        )}

        {editProduct && (
          <div className="card vendor-edit-card fade-up">
            <div className="card-body">
              <div className="vendor-edit-header">
                <h5>
                  <i className="bi bi-pencil-fill vendor-edit-icon" />
                  Editing: {editProduct.productName}
                </h5>
                <button className="btn btn-ghost btn-sm" onClick={handleCancelEdit}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              {renderProductForm(editFormik, true)}
            </div>
          </div>
        )}

        <div className="card">
          {renderTable()}
        </div>

      </div>

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onConfirm={modal.onConfirm}
        onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default VendorProducts