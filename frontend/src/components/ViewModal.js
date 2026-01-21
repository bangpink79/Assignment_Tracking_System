import Modal from "./Modal";
import { FileText, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

function ViewModal({ isOpen, onClose, assignment }) {
    if (!assignment) return null;

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(" ", "");
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMMM d, yyyy');
    };

    const formatDateTime = (dateString) => {
        return format(new Date(dateString), 'MMMM d, yyyy \'at\' h:mm a');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="view-modal-content">
                <div className="view-header">
                    <h2 className="view-title">{assignment.title}</h2>
                    <span className={`status-badge ${getStatusClass(assignment.status)}`}>
                        {assignment.status}
                    </span>
                </div>

                {assignment.description && (
                    <div className="view-section">
                        <div className="view-section-header">
                            <FileText size={18} />
                            <h3>Description</h3>
                        </div>
                        <p className="view-description">{assignment.description}</p>
                    </div>
                )}

                <div className="view-section">
                    <div className="view-section-header">
                        <Calendar size={18} />
                        <h3>Created</h3>
                    </div>
                    <p className="view-meta">{formatDate(assignment.created_time)}</p>
                </div>

                <div className="view-section">
                    <div className="view-section-header">
                        <Clock size={18} />
                        <h3>Last Updated</h3>
                    </div>
                    <p className="view-meta">{formatDateTime(assignment.updated_time)}</p>
                </div>
            </div>
        </Modal>
    );
}

export default ViewModal;