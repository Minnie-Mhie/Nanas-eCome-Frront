const Modal = ({ isOpen, onClose, title, message, onConfirm, type = "info" }) => {
  if (!isOpen) return null

  const btnColor = {
    info:    "btn-navy",
    success: "btn-success",
    danger:  "btn-danger",
    warning: "btn-warning",
  }

  const iconMap = {
    info:    { icon: "bi-info-circle-fill",            color: "var(--navy)" },
    success: { icon: "bi-check-circle-fill",           color: "#22C55E"     },
    danger:  { icon: "bi-x-circle-fill",               color: "#EF4444"     },
    warning: { icon: "bi-exclamation-triangle-fill",   color: "#F59E0B"     },
  }

  const { icon, color } = iconMap[type]

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose} />
      <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header border-0 pb-0">
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${icon}`} style={{ fontSize: "22px", color }} />
                <h5 className="modal-title mb-0">{title}</h5>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body pt-2">
              <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.6" }}>{message}</p>
            </div>

            <div className="modal-footer border-0 pt-0">
              <button className="btn btn-ghost" onClick={onClose}>
                {onConfirm ? "Cancel" : "Close"}
              </button>
              {onConfirm && (
                <button className={`btn ${btnColor[type]}`} onClick={() => { onConfirm(); onClose() }}>
                  Confirm
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
