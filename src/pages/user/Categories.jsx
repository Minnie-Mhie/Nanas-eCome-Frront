import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Modal from "../../components/Modal"

const categoryIcons = {
  "Lip Care":  "bi-heart-fill",
  "Resin Art": "bi-gem",
  "Skincare":  "bi-droplet-fill",
  "Jewellery": "bi-brilliance",
  "Hair Care": "bi-stars",
  "Nail Care": "bi-brush-fill",
  "Body Care": "bi-flower1",
}

const categoryImages = {
  "Lip Care":  "https://images.unsplash.com/photo-1586495777744-4e6232bf4c3c?w=600&q=80",
  "Resin Art": "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=600&q=80",
  "Skincare":  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80",
  "Jewellery": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  "Hair Care": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
  "Nail Care": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
  "Body Care": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80",
}

const getEmbedUrl = (url) => {
  const videoId = url.split("v=")[1]?.split("&")[0]
  return `https://www.youtube.com/embed/${videoId}`
}

const Categories = () => {
  const [categories, setCategories]             = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [products, setProducts]                 = useState([])
  const [loadingCats, setLoadingCats]           = useState(true)
  const [loadingProducts, setLoadingProducts]   = useState(false)
  const [addingId, setAddingId]                 = useState(null)
  const [videoProduct, setVideoProduct]         = useState(null)
  const [modal, setModal]                       = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/categories`)
        setCategories(res.data.data)
      } catch (error) {
        console.log(error)
        showModal("Error", "Failed to load categories", "danger")
      } finally {
        setLoadingCats(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category)
    setLoadingProducts(true)
    setProducts([])
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products/category/${category}`)
      setProducts(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to load products", "danger")
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleAddToCart = async (product) => {
    if (!token) {
      showModal("Login Required", "Please log in to add products to your cart.", "info")
      return
    }
    setAddingId(product._id)
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/cart/add`, { productId: product._id, quantity: 1 }, { headers })
      showModal("Added to Cart!", "Product has been added to your cart successfully.", "success")
    } catch (error) {
      console.log(error)
      showModal("Error", error.response?.data?.message || "Failed to add to cart", "danger")
    } finally {
      setAddingId(null)
    }
  }

  const handleClearCategory = () => {
    setSelectedCategory(null)
    setProducts([])
  }

  const renderCategorySection = () => {
    if (loadingCats) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (categories.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-grid" style={{ fontSize: 56, color: "var(--lavender)", display: "block", marginBottom: 12 }} />
          <h5 style={{ color: "var(--navy)" }}>No categories yet</h5>
          <p style={{ color: "#888" }}>Products will appear here once vendors start listing</p>
        </div>
      )
    }

    return (
      <div className="row g-3 mb-5">
        {categories.map((cat, i) => (
          <div className="col-6 col-md-4 col-lg-3" key={i}>
            <div
              className="fade-up"
              style={{
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                border: selectedCategory === cat ? "3px solid var(--pink)" : "3px solid transparent",
                boxShadow: selectedCategory === cat ? "0 8px 24px rgba(255,45,139,0.2)" : "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.2s",
                animationDelay: `${i * 0.05}s`,
              }}
              onClick={() => handleSelectCategory(cat)}
            >
              <div style={{ position: "relative", height: 120, overflow: "hidden" }}>
                <img
                  src={categoryImages[cat] || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80"}
                  alt={cat}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: selectedCategory === cat
                    ? "linear-gradient(135deg, rgba(255,45,139,0.7), rgba(27,27,110,0.6))"
                    : "linear-gradient(135deg, rgba(27,27,110,0.55), rgba(45,10,107,0.45))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i
                    className={`bi ${categoryIcons[cat] || "bi-grid"}`}
                    style={{ fontSize: 32, color: "#fff" }}
                  />
                </div>
              </div>
              <div style={{
                padding: "12px 14px",
                background: selectedCategory === cat ? "var(--navy)" : "#fff",
                transition: "background 0.2s",
              }}>
                <div style={{
                  fontWeight: 800, fontSize: 14,
                  color: selectedCategory === cat ? "#fff" : "var(--navy)",
                }}>
                  {cat}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderProductsSection = () => {
    if (!selectedCategory) {
      return null
    }

    if (loadingProducts) {
      return (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-brand" />
        </div>
      )
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-4" style={{ color: "#aaa" }}>
          <i className="bi bi-box-seam" style={{ fontSize: 40, display: "block", marginBottom: 8 }} />
          No products in this category yet
        </div>
      )
    }

    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h4 style={{ fontFamily: "var(--font-display)", color: "var(--navy)", margin: 0 }}>
              {selectedCategory}
            </h4>
            <p style={{ color: "#888", fontSize: 13, margin: 0 }}>
              {products.length} product(s) found
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleClearCategory}>
            <i className="bi bi-x-lg me-1" />Clear
          </button>
        </div>

        <div className="row g-4">
          {products.map((product, i) => (
            <div className="col-md-4 col-lg-3" key={product._id}>
              <div className="product-card fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={product.productImage?.secure_url}
                    alt={product.productName}
                    className="product-card-img"
                  />
                  {product.videoUrl && (
                    <button
                      onClick={() => setVideoProduct(product)}
                      style={{
                        position: "absolute", top: 10, left: 10,
                        background: "rgba(255,0,0,0.88)", color: "#fff",
                        border: "none", borderRadius: 20, cursor: "pointer",
                        fontSize: 11, fontWeight: 700, padding: "3px 10px",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      <i className="bi bi-play-circle-fill" /> Watch Demo
                    </button>
                  )}
                  <div style={{
                    position: "absolute", bottom: 10, left: 10,
                    background: "rgba(27,27,110,0.85)", backdropFilter: "blur(4px)",
                    color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "3px 10px", borderRadius: 20,
                  }}>
                    <i className="bi bi-shop me-1" />{product.vendor?.storeName || "Store"}
                  </div>
                </div>

                <div className="product-card-body">
                  <div style={{ fontWeight: 800, fontSize: 14, color: "var(--navy)", marginBottom: 4 }}>
                    {product.productName}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray)", marginBottom: 10, lineHeight: 1.5 }}>
                    {product.productDescription?.substring(0, 65)}...
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: product.productQuantity > 5 ? "#166534" : "#92400E" }}>
                    <i className={`bi ${product.productQuantity > 5 ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} me-1`} />
                    {product.productQuantity > 5 ? `${product.productQuantity} in stock` : `Only ${product.productQuantity} left!`}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="product-price">₦{product.productPrice?.toLocaleString()}</div>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                    >
                      <i className="bi bi-cart-plus me-1" />Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderVideoModal = () => {
    if (!videoProduct) {
      return null
    }

    return (
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
        onClick={() => setVideoProduct(null)}
      >
        <div
          style={{ width: "100%", maxWidth: 780, background: "#000", borderRadius: 16, overflow: "hidden" }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{
            background: "var(--navy)", padding: "14px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              <i className="bi bi-play-circle-fill me-2" style={{ color: "red" }} />
              {videoProduct.productName}
            </div>
            <button
              onClick={() => setVideoProduct(null)}
              style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", lineHeight: 1 }}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src={getEmbedUrl(videoProduct.videoUrl)}
              title={videoProduct.productName}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--pink)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
            Browse by Category
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "var(--navy)", fontSize: 32, margin: 0 }}>
            Shop by Category
          </h2>
          <p style={{ color: "#888", marginTop: 8, fontSize: 15 }}>
            Explore our handpicked collection of handmade beauty and art products
          </p>
        </div>

        {renderCategorySection()}
        {renderProductsSection()}

      </div>

      {renderVideoModal()}

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default Categories