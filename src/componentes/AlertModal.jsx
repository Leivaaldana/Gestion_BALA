export default function AlertModal({ id, variant = "warning", title, message }) {
  return (
    <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content alert-modal alert-modal--${variant}`}>
          <div className="modal-header border-0">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <span className="alert-modal-icon" aria-hidden="true">
                {variant === "danger" ? "⚠" : "•"}
              </span>
              {title}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" />
          </div>
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-dusty" data-bs-dismiss="modal">
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
