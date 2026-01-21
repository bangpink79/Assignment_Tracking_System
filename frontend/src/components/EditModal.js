import { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateAssignment } from "../api";
import { Save } from "lucide-react";

function EditModal({ isOpen, onClose, assignment, onUpdated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title || "");
            setDescription(assignment.description || "");
            setStatus(assignment.status || "Pending");
        }
    }, [assignment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !assignment) return;

        setLoading(true);
        setError(null);

        try {
            await updateAssignment(assignment.id, { title, description, status });
            onUpdated();
            onClose();
        } catch (err) {
            setError("Failed to update assignment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setError(null);
        onClose();
    };

    if (!assignment) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="Edit Assignment">
            <form onSubmit={handleSubmit}>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Enter assignment title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={loading}
                        autoFocus
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-textarea"
                        placeholder="Enter description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading || !title.trim()}
                    >
                        <Save size={16} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default EditModal;