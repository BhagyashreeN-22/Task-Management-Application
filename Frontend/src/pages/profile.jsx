import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import TaskCard from "../components/taskbar";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [error, setError] = useState("");
  const [searchTitle,setSearchTitle] =useState("");
  const [searchStatus,setSearchStatus] = useState("");
  const [searchDueDate,setSearchDueDate] =useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await API.get("/users/profile");
        setUser(profile.data.user);
        setTasks(profile.data.tasks || []);
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to load profile.");
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(()=>{
    fetchFilter();
  },[searchDueDate,searchStatus,searchTitle]);
 
const fetchFilter = async () => {
  try {
    const res = await API.get("/tasks", {
      params: {
        status: searchStatus || undefined,
        search: searchTitle || undefined,
        due_date: searchDueDate || undefined,
      },
    });

    setTasks(res.data);
  } catch (err) {
    setError("Failed to filter tasks");
  }
};


  const handleAddTask = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/tasks", {
        title: newTitle,
        description: newDescription,
        status: "pending",
        due_date: newDueDate || null,
      });

      console.log(res)

      setTasks([...tasks, res.data.task]);
      console.log(tasks)

      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to add task");
      }
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setError("");
    try {
      await API.put(`/tasks/${id}`, { status: newStatus });

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      setError("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      {/* Header */}
      <div className="profile-header">
        <h1>Welcome, {user.name}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="search-filter">
        <input type="text" placeholder="search by title" value={searchTitle} onChange={(e)=>{setSearchTitle(e.target.value)}}></input>
        <select value={searchStatus} onChange={(e)=>setSearchStatus(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
        </select>

          <input
          type="date"
          value={searchDueDate}
          onChange={(e) => setSearchDueDate(e.target.value)}
          className="date-filter"
        />

      </div>

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task Title"
          required
        />

        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task Description"
        />

        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Add one above 👆</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => handleDelete(task.id)}
              onUpdateStatus={(newStatus) =>
              handleUpdateStatus(task.id, newStatus)
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
