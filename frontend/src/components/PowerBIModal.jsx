import powerbiImg from "../assets/powerbi.png";
import "./PowerBIModal.css";

export default function PowerBIModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="pbi-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="pbi-modal">
        <div className="pbi-modal-header">
          <div className="pbi-modal-title">
            <span className="pbi-modal-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="10" width="4" height="13" rx="1" fill="#F2C811" />
                <rect x="7" y="6" width="4" height="17" rx="1" fill="#F2C811" opacity="0.85" />
                <rect x="13" y="2" width="4" height="21" rx="1" fill="#F2C811" opacity="0.7" />
                <rect x="19" y="6" width="4" height="17" rx="1" fill="#F2C811" opacity="0.55" />
              </svg>
            </span>
            Retail Return Behaviour Dashboard Made Using Power BI
          </div>
          <button
            className="pbi-close-btn"
            onClick={onClose}
            aria-label="Close Power BI preview"
          >
            ✕
          </button>
        </div>

        <div className="pbi-modal-body">
          <img
            src={powerbiImg}
            alt="Power BI — Retail Return Behaviour Dashboard"
            className="pbi-screenshot"
          />
        </div>
      </div>
    </div>
  );
}