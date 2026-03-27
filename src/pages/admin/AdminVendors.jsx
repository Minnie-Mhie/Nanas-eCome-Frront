import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Modal from "../../components/Modal"
import "../../style/AdminVendors.css"

const AdminVendors = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null })

  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const showModal = (title, message, type = "info", onConfirm = null) => {
    setModal({ isOpen: true, title, message, type, onConfirm })
  }

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/vendor/all`, { headers })
      setVendors(res.data.data)
    } catch (error) {
      console.log(error)
      showModal("Error", "Failed to fetch vendors", "danger")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchVendors() }, [])

//   const handleApprove = (vendorId) => {
//     showModal("Approve Vendor", "Are you sure you want to approve this vendor?", "success",
//       async () => {
//         try {
//           await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/approve/${vendorId}`, {}, { headers })
//           // showModal("Approved", "Vendor approved successfully", "success")
// showModal("Approved", "Vendor approved successfully", "success", null);

//           fetchVendors()
//         } catch (error) {
//           console.log(error)
//           showModal("Error", "Failed to approve vendor", "danger")
//         }
//       }
//     )
//   }

 const handleApprove = (vendorId) => {
  showModal(
    "Approve Vendor", 
    "Are you sure?", 
    "success",
    async () => {
      try {
        setModal(prev => ({ ...prev, isOpen: false })); 
        
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/approve/${vendorId}`, {}, { headers });
        
        await fetchVendors();
        
        showModal("Approved", "Vendor approved successfully", "success", null);
      } catch (error) {
        showModal("Error", "Failed to approve vendor", "danger", null);
      }
    }
  );
}

  const handleReject = (vendorId) => {
    showModal("Reject Vendor", "Are you sure you want to reject this vendor application?", "danger",
      async () => {
        try {
          await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/vendor/reject/${vendorId}`, {}, { headers })
          showModal("Rejected", "Vendor application rejected", "info")
          fetchVendors()
        } catch (error) {
          console.log(error)
          showModal("Error", "Failed to reject vendor", "danger")
        }
      }
    )
  }

  const getBadgeClass = (status) => {
    if (status === "approved") return "badge-approved"
    if (status === "rejected") return "badge-rejected"
    return "badge-pending"
  }

  const pending  = vendors.filter(v => v.status === "pending")
  const approved = vendors.filter(v => v.status === "approved")
  const rejected = vendors.filter(v => v.status === "rejected")

  const renderVendorActions = (vendor) => {
    if (vendor.status === "pending") {
      return (
        <div className="d-flex gap-2">
          <button className="btn btn-success btn-sm" onClick={() => handleApprove(vendor._id)}>Approve</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleReject(vendor._id)}>Reject</button>
        </div>
      )
    }
    if (vendor.status === "rejected") {
      return (
        <button className="btn btn-success btn-sm" onClick={() => handleApprove(vendor._id)}>Approve</button>
      )
    }
    return (
      <span className="vendor-active-text">
        <i className="bi bi-check-circle-fill me-1" />Active
      </span>
    )
  }

  const renderPendingSection = () => {
    if (pending.length === 0) {
      return null
    }

    return (
      <div className="mb-4">
        <div className="pending-section-title">
          <i className="bi bi-clock-fill me-2" style={{ color: "#F59E0B" }} />
          Pending Approval ({pending.length})
        </div>
        {pending.map(vendor => (
          <div className="card mb-3 vendor-pending-card" key={vendor._id}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="vendor-store-name">{vendor.storeName}</div>
                  <div className="vendor-store-desc">{vendor.storeDescription}</div>
                  <div className="vendor-owner-info">
                    <i className="bi bi-person-fill me-1" />
                    {vendor.owner?.firstName} {vendor.owner?.lastName}
                    <span className="ms-3">
                      <i className="bi bi-envelope-fill me-1" />
                      {vendor.owner?.email}
                    </span>
                  </div>
                  <div className="vendor-applied-date">
                    Applied: {new Date(vendor.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(vendor._id)}>
                    <i className="bi bi-x-lg me-1" />Reject
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(vendor._id)}>
                    <i className="bi bi-check-lg me-1" />Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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

    if (vendors.length === 0) {
      return (
        <div className="text-center py-4 text-muted">No vendors yet</div>
      )
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Store</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor._id}>
                <td>
                  <div className="vendor-name-cell">{vendor.storeName}</div>
                  <div className="vendor-desc-preview">{vendor.storeDescription?.substring(0, 50)}...</div>
                </td>
                <td className="vendor-owner-name">{vendor.owner?.firstName} {vendor.owner?.lastName}</td>
                <td className="vendor-owner-email">{vendor.owner?.email}</td>
                <td><span className={`badge ${getBadgeClass(vendor.status)}`}>{vendor.status}</span></td>
                <td className="vendor-date">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                <td>{renderVendorActions(vendor)}</td>
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

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h2 className="mb-1">Vendors</h2>
            <p className="text-muted mb-0 vendors-sub">Review and manage vendor applications</p>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {[
            { label: "Total",    value: vendors.length,  colorClass: "text-plum"   },
            { label: "Pending",  value: pending.length,  colorClass: "text-orange"  },
            { label: "Approved", value: approved.length, colorClass: "text-green"   },
            { label: "Rejected", value: rejected.length, colorClass: "text-red"     },
          ].map((s, i) => (
            <div className="col-md-3" key={i}>
              <div className="stat-card">
                <div className="stat-label">{s.label} Vendors</div>
                <div className={`stat-value mt-1 ${s.colorClass}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {renderPendingSection()}

        <div className="card">
          <div className="card-body pb-0">
            <div className="pending-section-title">All Vendors</div>
          </div>
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

export default AdminVendors