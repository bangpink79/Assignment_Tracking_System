import { useState } from "react";
import Modal from "./Modal";
import { createAssignment } from "../api";
import { Plus } from "lucide-react";

function CreateModal({ isOpen, onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await createAssignment({ title, description, status });
            setTitle("");
            setDescription("");
            setStatus("Pending");
            onCreated();
            onClose();
        } catch (err) {
            setError("Failed to create assignment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle("");
        setDescription("");
        setStatus("Pending");
        setError(null);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel} title="Create Assignment">
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
                        <Plus size={16} />
                        {loading ? "Creating..." : "Create"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateModal;