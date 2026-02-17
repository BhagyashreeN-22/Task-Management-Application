import "./taskbar.css";

const TaskCard = ({ task, onDelete, onUpdateStatus }) => {
  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {task.due_date && (
        <p className="task-date">
          Due: {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="task-actions">
        <label>Status:</label>

        <select
          value={task.status}
          onChange={(e) => onUpdateStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={onDelete} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
