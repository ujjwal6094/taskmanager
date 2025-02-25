import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper, TextField, Grid2, Box } from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { fetchTasks, addTask, deleteTask, updateTaskStatus } from "../api";

interface Task {
  id: string | number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({ title: "", description: "", status: "Pending" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      loadTasks();
    }
  }, [navigate]);

  const loadTasks = async () => {
    try {
      const data: Task[] = await fetchTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim()) {
      alert("Title and description are required!");
      return;
    }
    try {
      const createdTask: Task = await addTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({ title: "", description: "", status: "Pending" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string | number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCompleteTask = async (taskId: string | number) => {
    try {
      await updateTaskStatus(taskId, "Completed");
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "Completed" } : task)));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const movedTask = tasks.find((task) => task.id.toString() === result.draggableId);
    if (!movedTask) return;

    const newStatus = result.destination.droppableId as Task["status"];
    movedTask.status = newStatus;

    const updatedTasks = tasks.filter((task) => task.id !== movedTask.id);
    updatedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(updatedTasks);

    try {
      await updateTaskStatus(movedTask.id, newStatus);
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mb: 2, float: "right" }}>
        Logout
      </Button>
      <Typography variant="h4" align="center" gutterBottom>
        Task Board
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid2 container spacing={3}>
          {["Pending", "In Progress", "Completed"].map((status) => (
           <Grid2 sx={{ width: { xs: "100%", sm: "33.33%" } }} key={status}>

              <Droppable droppableId={status}>
                {(provided) => (
                  <Paper ref={provided.innerRef} {...provided.droppableProps} sx={{ p: 2, minHeight: 300 }}>
                    <Typography variant="h6" align="center" gutterBottom>
                      {status}
                    </Typography>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                          {(provided) => (
                            <Paper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ p: 2, mt: 1 }}>
                              <Typography variant="subtitle1">{task.title}</Typography>
                              <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                              {task.status !== "Completed" && (
                                <Button color="primary" onClick={() => handleCompleteTask(task.id)} sx={{ mt: 1 }}>
                                  Complete
                                </Button>
                              )}
                              <Button color="error" onClick={() => handleDeleteTask(task.id)} sx={{ mt: 1, ml: 1 }}>
                                Delete
                              </Button>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Paper>
                )}
              </Droppable>
            </Grid2>
          ))}
        </Grid2>
      </DragDropContext>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Add Task</Typography>
        <TextField
          label="Title"
          fullWidth
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{ mt: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          sx={{ mt: 2 }}
        />
        <Button onClick={handleAddTask} variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Task
        </Button>
      </Paper>
    </Container>
  );
};

export default Dashboard;
