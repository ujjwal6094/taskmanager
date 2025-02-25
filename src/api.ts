const API_URL = "http://localhost:5000";

// GET: Tasks Fetch
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: { Authorization: `Bearer fake-jwt-token` },
  });
  return response.json();
};

// POST: Task Add
export const addTask = async (task: { title: string; description: string; status: string }) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer fake-jwt-token`,
    },
    body: JSON.stringify(task),
  });

  return response.json();
};

// PUT: Task Update (for title, description, and status)
export const updateTask = async (taskId: string | number, updatedTask: { title: string; description: string; status: string }) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer fake-jwt-token`,
    },
    body: JSON.stringify(updatedTask),
  });

  return response.json();
};

// ✅ NEW FUNCTION: Only updates task status
export const updateTaskStatus = async (taskId: string | number, status: string) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",  // PATCH is better for partial updates
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer fake-jwt-token`,
    },
    body: JSON.stringify({ status }), // Only sending status
  });

  return response.json();
};

// DELETE: Task Delete
export const deleteTask = async (taskId:  string | number ) => {
  await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer fake-jwt-token` },
  });
};

// Login API Call
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users`);
  const users = await response.json();
  return users.find((user: any) => user.email === email && user.password === password);
};
