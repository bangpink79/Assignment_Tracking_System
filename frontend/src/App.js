import { useState, useEffect, useRef } from "react";
import AssignmentList from "./components/AssignmentList";
import StatsBar from "./components/StatsBar";
import CreateModal from "./components/CreateModal";
import EditModal from "./components/EditModal";
import ViewModal from "./components/ViewModal";
import DeleteModal from "./components/DeleteModal";
import RecycleBin from "./components/RecycleBin";
import { fetchAssignments, deleteAssignment, fetchTrash } from "./api";
import { ClipboardList, Plus, Trash2, ChevronDown, Clock } from "lucide-react";
import { format } from "date-fns";
import "./App.css";

function App() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trashCount, setTrashCount] = useState(0);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRecycleBinOpen, setIsRecycleBinOpen] = useState(false);

  // Dropdown state moved to AssignmentList

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadAssignments = async () => {
    try {
      const data = await fetchAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load assignments. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const loadTrashCount = async () => {
    try {
      const trash = await fetchTrash();
      setTrashCount(trash.length);
    } catch (err) {
      console.error("Failed to load trash count:", err);
    }
  };

  useEffect(() => {
    loadAssignments();
    loadTrashCount();
  }, []);

  const handleRefresh = () => {
    loadAssignments();
    loadTrashCount();
  };

  const handleView = (assignment) => {
    setSelectedAssignment(assignment);
    setIsViewModalOpen(true);
  };

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAssignment) return;
    setDeleteLoading(true);
    try {
      await deleteAssignment(selectedAssignment.id);
      setIsDeleteModalOpen(false);
      setSelectedAssignment(null);
      handleRefresh();
    } catch (error) {
      alert("Failed to delete assignment");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="header-title">Assignment Tracker</h1>
              <p className="header-subtitle">
                Organize, track, and manage your assignments efficiently
              </p>
            </div>
          </div>
          <div className="header-right">
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={18} />
              Create Assignment
            </button>
            <button
              className="btn btn-icon-badge"
              onClick={() => setIsRecycleBinOpen(true)}
              title="Recycle Bin"
            >
              <Trash2 size={20} />
              {trashCount > 0 && <span className="badge">{trashCount}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          {loading ? (
            <p className="message-state">Loading assignments...</p>
          ) : error ? (
            <p className="message-state error-text">{error}</p>
          ) : (
            <>
              <StatsBar assignments={assignments} />
              <AssignmentList
                assignments={assignments}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleRefresh}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onUpdated={handleRefresh}
      />

      <ViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAssignment(null);
        }}
        onConfirm={handleDeleteConfirm}
        assignment={selectedAssignment}
        loading={deleteLoading}
      />

      <RecycleBin
        isOpen={isRecycleBinOpen}
        onClose={() => setIsRecycleBinOpen(false)}
        onUpdated={handleRefresh}
      />
    </div>
  );
}

export default App;