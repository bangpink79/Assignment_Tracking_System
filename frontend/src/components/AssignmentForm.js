import { useState } from "react";
import { createAssignment } from "../api";
import { Plus } from "lucide-react";

function AssignmentForm({ onAssignmentCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await createAssignment({ title, description, status: "Pending" });
      setTitle("");
      setDescription("");
      setIsExpanded(false);
      if (onAssignmentCreated) {
        onAssignmentCreated();
      }
    } catch (err) {
      setError("Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">New Assignment</h2>
      </div>
      <div className="form-content">
        {error && <p style={{ color: "var(--destructive)", marginBottom: "1rem" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Assignment title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              required
              disabled={loading}
            />
          </div>

          {isExpanded && (
            <div className="animate-fade-in">
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
                  <Plus size={16} />
                  {loading ? "Creating..." : "Create Assignment"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setIsExpanded(false);
                    setTitle("");
                    setDescription("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AssignmentForm;