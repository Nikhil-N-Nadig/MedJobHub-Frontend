import React from "react";
import "../ConfirmModel/ConfirmModel.css"
const ConfirmModal = ({ isOpen, onClose, onConfirm, message = "Are you sure ?" }) => {
  if (!isOpen) return null; 

  return (
    <div id="deleteModal" className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="model-apply-btn confirm-delete" onClick={onConfirm}>
            OK
          </button>
          <button className="model-apply-btn cancel-delete" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
