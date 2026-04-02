import { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo'
};

const TaskForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split('T')[0]
          : '',
        priority: initialData.priority || 'medium',
        status: initialData.status || 'todo'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
      if (!initialData) setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3 className="form-title">{initialData ? 'Edit Task' : 'New Task'}</h3>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label>Title <span className="required">*</span></label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add more details..."
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
