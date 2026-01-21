import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

function DeleteModal({ isOpen, onClose, onConfirm, assignment, loading }) {
    if (!assignment) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Assignment">
            <div className="delete-modal-content">
                <div className="delete-warning">
                    <AlertTriangle size={48} className="warning-icon" />
                    <p className="warning-text">
                        Are you sure you want to delete <strong>"{assignment.title}"</strong>?
                    </p>
                    <p className="warning-subtext">
                        This will move the assignment to the Recycle Bin. You can restore it later or permanently delete it.
                    </p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default DeleteModal;