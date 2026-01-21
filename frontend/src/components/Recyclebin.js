import { useState } from "react";
import { X, Trash2, RotateCcw } from "lucide-react";
import { fetchTrash, restoreAssignment, permanentDelete, emptyTrash } from "../api";
import { format } from "date-fns";
import { useEffect } from "react";

function RecycleBin({ isOpen, onClose, onUpdated }) {
    const [trashedItems, setTrashedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (isOpen) {
            loadTrash();
        }
    }, [isOpen]);

    const loadTrash = async () => {
        setLoading(true);
        try {
            const data = await fetchTrash();
            setTrashedItems(data);
        } catch (error) {
            console.error("Failed to load trash:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        setProcessingId(id);
        try {
            await restoreAssignment(id);
            await loadTrash();
            onUpdated();
        } catch (error) {
            alert("Failed to restore assignment");
        } finally {
            setProcessingId(null);
        }
    };

    const handlePermanentDelete = async (id) => {
        if (!window.confirm("Permanently delete this assignment? This action cannot be undone.")) {
            return;
        }
        setProcessingId(id);
        try {
            await permanentDelete(id);
            await loadTrash();
            onUpdated();
        } catch (error) {
            alert("Failed to delete assignment");
        } finally {
            setProcessingId(null);
        }
    };

    const handleEmptyTrash = async () => {
        if (!window.confirm("Permanently delete all items in trash? This action cannot be undone.")) {
            return;
        }
        setLoading(true);
        try {
            await emptyTrash();
            setTrashedItems([]);
            onUpdated();
        } catch (error) {
            alert("Failed to empty trash");
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        return status.toLowerCase().replace(" ", "");
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="recycle-bin-overlay" onClick={onClose} />
            <div className={`recycle-bin-panel ${isOpen ? "open" : ""}`}>
                <div className="recycle-bin-header">
                    <div>
                        <h2 className="recycle-bin-title">Recycle Bin</h2>
                        <p className="recycle-bin-subtitle">
                            Deleted assignments are stored here. Restore or permanently delete them.
                        </p>
                    </div>
                    <button className="recycle-bin-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="recycle-bin-content">
                    {loading && trashedItems.length === 0 ? (
                        <p className="empty-message">Loading...</p>
                    ) : trashedItems.length === 0 ? (
                        <p className="empty-message">Trash is empty</p>
                    ) : (
                        <>
                            <div className="trash-actions">
                                <button
                                    className="btn btn-danger-outline"
                                    onClick={handleEmptyTrash}
                                    disabled={loading}
                                >
                                    <Trash2 size={16} />
                                    Empty Trash ({trashedItems.length})
                                </button>
                            </div>

                            <div className="trash-list">
                                {trashedItems.map((item) => (
                                    <div key={item.id} className="trash-item">
                                        <div className="trash-item-content">
                                            <h4 className="trash-item-title">{item.title}</h4>
                                            <div className="trash-item-meta">
                                                <span className={`status-badge ${getStatusClass(item.status)}`}>
                                                    {item.status}
                                                </span>
                                                {item.deleted_time && (
                                                    <span className="trash-date">
                                                        Deleted {format(new Date(item.deleted_time), 'MMM d, yyyy')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="trash-item-actions">
                                            <button
                                                className="btn-icon-action"
                                                onClick={() => handleRestore(item.id)}
                                                disabled={processingId === item.id}
                                                title="Restore"
                                            >
                                                <RotateCcw size={18} />
                                            </button>
                                            <button
                                                className="btn-icon-action danger"
                                                onClick={() => handlePermanentDelete(item.id)}
                                                disabled={processingId === item.id}
                                                title="Delete permanently"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default RecycleBin;