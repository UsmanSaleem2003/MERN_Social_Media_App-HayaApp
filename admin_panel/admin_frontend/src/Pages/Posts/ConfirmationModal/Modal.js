import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h4>Confirmation</h4>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>Cancel</button>
                    <button className="modal-button modal-confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
