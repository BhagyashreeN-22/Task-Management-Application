import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./admin.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch_user();
  }, []);

  const fetch_user = async () => {
    const res = await API.get("/users/allusers");
    setUsers(res.data);
  };

const fetch_tasks = async (id) => {
  const res = await API.get(`/users/${id}/tasks`);
  setTasks(res.data.tasks);
};


  const deleteUser = async (id) => {
    await API.delete(`/users/${id}`);
    setUsers(users.filter((user) => user.id !== id));
    setTasks([]);
  };

    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      <h2>Users</h2>
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <p>
            {user.name} ({user.email})
          </p>
          <div>
            <button onClick={() => fetch_tasks(user.id)}>
              View Tasks
            </button>
            <button onClick={() => deleteUser(user.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <h2>User Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-card-admin">
          <p>
            {task.title} - {task.status}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
