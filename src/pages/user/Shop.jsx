import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"

const getEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("/embed/")) {
    return url.split("?")[0]
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  if (url.includes("v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return ""
}

const demoProducts = [
  {
    _id: "demo-1",
    productName: "Ocean Wave Resin Tray",
    productDescription: "Handcrafted resin tray with ocean wave design in deep blue and gold flakes. Perfect for jewellery, keys or as a statement piece.",
    productPrice: 18500,
    productQuantity: 12,
    productImage: { secure_url: "https://images.unsplash.com/photo-1615796153287-98eacf0abb13?w=400&h=400&fit=crop" },
    vendor: { storeName: "Nana's Crafts" },
    isDemo: true,
  },
  {
    _id: "demo-2",
    productName: "Floral Resin Coaster Set",
    productDescription: "Set of 4 resin coasters with dried flowers preserved inside. Each piece is unique and comes in a gift-ready box.",
    productPrice: 12000,
    productQuantity: 8,
    productImage: { secure_url: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400&h=400&fit=crop" },
    vendor: { storeName: "Nana's Crafts" },
    isDemo: true,
  },
  {
    _id: "demo-3",
    productName: "Geode Resin Wall Art",
    productDescription: "Large statement wall art inspired by natural geodes. Hand-poured with metallic pigments in purple, teal and rose gold.",
    productPrice: 45000,
    productQuantity: 3,
    productImage: { secure_url: "https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=400&h=400&fit=crop" },
    vendor: { storeName: "Nana's Crafts" },
    isDemo: true,
  },
  {
    _id: "demo-4",
    productName: "Resin Jewellery Dish",
    productDescription: "Dainty round jewellery dish in blush pink and white marble effect resin. Ideal for rings, earrings and small trinkets.",
    productPrice: 7500,
    productQuantity: 20,
    productImage: { secure_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop" },
    vendor: { storeName: "Nana's Crafts" },
    isDemo: true,
  },
  {
    _id: "demo-5",
    productName: "Shea Butter Lip Balm",
    productDescription: "Ultra-moisturising lip balm made with pure shea butter, coconut oil and vitamin E. Available in vanilla and berry scent.",
    productPrice: 3500,
    productQuantity: 50,
    productImage: { secure_url: "https://images.unsplash.com/photo-1586495777744-4e6232bf4c3c?w=400&h=400&fit=crop" },
    vendor: { storeName: "Pourfection Beauty" },
    isDemo: true,
  },
  {
    _id: "demo-6",
    productName: "Tinted Lip Oil",
    productDescription: "Non-sticky tinted lip oil that gives a glossy finish while deeply nourishing your lips. Comes in 6 beautiful shades.",
    productPrice: 5500,
    productQuantity: 35,
    productImage: { secure_url: "https://images.unsplash.com/photo-1631214500004-80d7b7edf2b1?w=400&h=400&fit=crop" },
    vendor: { storeName: "Pourfection Beauty" },
    isDemo: true,
  },
  {
    _id: "demo-7",
    productName: "Lip Scrub & Mask Duo",
    productDescription: "Brown sugar lip scrub paired with an overnight lip mask. Exfoliates dead skin and restores softness while you sleep.",
    productPrice: 8000,
    productQuantity: 25,
    productImage: { secure_url: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=400&h=400&fit=crop" },
    vendor: { storeName: "Pourfection Beauty" },
    isDemo: true,
  },
  {
    _id: "demo-8",
    productName: "Resin Keyholder Set",
    productDescription: "Set of 3 handmade resin keyholders in pastel holographic colours. Lightweight, durable and uniquely designed.",
    productPrice: 6500,
    productQuantity: 15,
    productImage: { secure_url: "https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=400&fit=crop" },
    vendor: { storeName: "Nana's Crafts" },
    isDemo: true,
  },
]

const Shop = () => {
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [addingId, setAddingId]         = useState(null)
  const [videoProduct, setVideoProduct] = useState(null)
  const [modal, setModal]               = useState({ isOpen: false, title: "", message: "", type: "info" })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }
  const navigate = useNavigate()

  const showModal = (title, message, type = "info") => {
    setModal({ isOpen: true, title, message, type })
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/products`, { headers })
        const realProducts = res.data.data || []
        setProducts([...realProducts, ...demoProducts])
      } catch (error) {
        console.log(error)
        setProducts(demoProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    if (product.isDemo) {
      showModal("Demo Product", "This is a display product. Vendors will add real products for purchase.", "info")
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

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor?.storeName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="d-flex">
      <Sidebar role="user" />
      <div className="main-content w-100">

        <div className="page-header d-flex align-items-center justify-content-between">
          <div>
            <h2>Marketplace</h2>
            <p>Discover handmade resin artworks & lip care products</p>
          </div>
          <button className="btn btn-navy" onClick={() => navigate("/cart")}>
            <i className="bi bi-cart-fill me-2" />My Cart
          </button>
        </div>

        <div className="filter-bar mb-4">
          <i className="bi bi-search" style={{ color: "#bbb", fontSize: 16 }} />
          <input
            type="text" className="form-control border-0 shadow-none p-0"
            placeholder="Search products or stores..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ fontSize: 14, background: "transparent" }}
          />
          {search && (
            <span style={{ fontSize: 13, color: "var(--gray)" }}>
              {filtered.length} result(s)
            </span>
          )}
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner-brand" /><p>Loading products...</p></div>
        ) : (
          <div className="row g-4">
            {filtered.map((product, i) => (
              <div className="col-md-4 col-lg-3" key={product._id}>
                <div className="product-card fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={product.productImage?.secure_url}
                      alt={product.productName}
                      className="product-card-img"
                    />

                    {product.isDemo && (
                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        background: "var(--lavender)", color: "var(--plum)",
                        fontSize: 10, fontWeight: 800, padding: "2px 8px",
                        borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.4px"
                      }}>
                        Featured
                      </div>
                    )}

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
                        <i className="bi bi-play-circle-fill" allow="autoplay"/> Watch Demo
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

                    <div style={{
                      fontSize: 12, fontWeight: 700, marginBottom: 12,
                      color: product.productQuantity > 5 ? "#166534" : "#92400E"
                    }}>
                      <i className={`bi ${product.productQuantity > 5 ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} me-1`} />
                      {product.productQuantity > 5
                        ? `${product.productQuantity} in stock`
                        : `Only ${product.productQuantity} left!`}
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      <div className="product-price">₦{product.productPrice?.toLocaleString()}</div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={addingId === product._id}
                      >
                        {addingId === product._id
                          ? <span className="spinner-border spinner-border-sm" />
                          : <><i className="bi bi-cart-plus me-1" />Add</>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YouTube Video Modal */}
      {videoProduct && (
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
            style={{
              width: "100%", maxWidth: 780,
              background: "#000", borderRadius: 16,
              overflow: "hidden", position: "relative",
            }}
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
      )}

      <Modal
        isOpen={modal.isOpen} title={modal.title} message={modal.message}
        type={modal.type} onClose={() => setModal({ ...modal, isOpen: false })}
      />
    </div>
  )
}

export default Shop