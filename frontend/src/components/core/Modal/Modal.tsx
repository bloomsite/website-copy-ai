import React from "react";
import Button from "../Button/Button";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Bevestigen",
  cancelText = "Annuleren",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <Button
            text={cancelText}
            onClick={onClose}
            className="modal-button cancel"
          />
          <Button
            text={confirmText}
            onClick={onConfirm}
            className="modal-button confirm"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
