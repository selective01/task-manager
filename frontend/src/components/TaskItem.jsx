import { useState } from 'react';
import TaskForm from './TaskForm';

const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };
const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async (formData) => {
    await onUpdate(task._id, formData);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    setDeleting(true);
    try {
      await onDelete(task._id);
    } catch {
      setDeleting(false);
    }
  };

  const cycleStatus = () => {
    const cycle = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
    onUpdate(task._id, { status: cycle[task.status] });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isOverdue = d < today && task.status !== 'done';
    return { label: d.toLocaleDateString(), overdue: isOverdue };
  };

  const dueInfo = formatDate(task.dueDate);

  if (editing) {
    return (
      <div className="task-item task-item--editing">
        <TaskForm
          initialData={task}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className={`task-item task-item--${task.status} ${deleting ? 'task-item--deleting' : ''}`}>
      <div className="task-item__header">
        <button
          className={`status-badge status-badge--${task.status}`}
          onClick={cycleStatus}
          title="Click to advance status"
        >
          {STATUS_LABELS[task.status]}
        </button>
        <span className={`priority-badge priority-badge--${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        {dueInfo && (
          <span className={`due-date ${dueInfo.overdue ? 'due-date--overdue' : ''}`}>
            {dueInfo.overdue ? '⚠ ' : ''}Due {dueInfo.label}
          </span>
        )}
      </div>

      <h4 className={`task-item__title ${task.status === 'done' ? 'task-item__title--done' : ''}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="task-item__desc">{task.description}</p>
      )}

      <div className="task-item__actions">
        <button className="btn btn-sm btn-ghost" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={handleDelete} disabled={deleting}>
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
