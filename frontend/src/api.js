const API_URL = "http://localhost:8000/api/assignments";

export const fetchAssignments = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Failed to fetch assignments");
    }
    return response.json();
};

export const createAssignment = async (assignment) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(assignment),
    });
    if (!response.ok) {
        throw new Error("Failed to create assignment");
    }
    return response.json();
};

export const updateAssignment = async (id, updates) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
    });
    if (!response.ok) {
        throw new Error("Failed to update assignment");
    }
    return response.json();
};

export const deleteAssignment = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete assignment");
    }
    return true;
};

// Trash/Recycle Bin APIs
export const fetchTrash = async () => {
    const response = await fetch(`${API_URL}/trash/list`);
    if (!response.ok) {
        throw new Error("Failed to fetch trash");
    }
    return response.json();
};

export const restoreAssignment = async (id) => {
    const response = await fetch(`${API_URL}/${id}/restore`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error("Failed to restore assignment");
    }
    return response.json();
};

export const permanentDelete = async (id) => {
    const response = await fetch(`${API_URL}/${id}/permanent`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to permanently delete assignment");
    }
    return true;
};

export const emptyTrash = async () => {
    const response = await fetch(`${API_URL}/trash/empty`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to empty trash");
    }
    return true;
};