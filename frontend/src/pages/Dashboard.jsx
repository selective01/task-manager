import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const STATUS_FILTERS = ['all', 'todo', 'in-progress', 'done'];
const PRIORITY_FILTERS = ['all', 'low', 'medium', 'high'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      const res = await getTasks(params);
      setTasks(res.data.data);
    } catch {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    const res = await createTask(formData);
    setTasks((prev) => [res.data.data, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (id, formData) => {
    const res = await updateTask(id, formData);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header__left">
          <h1 className="dashboard-header__logo">TaskFlow</h1>
          <span className="dashboard-header__email">{user?.email}</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        {/* Stats row */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-card__number">{counts.all}</span>
            <span className="stat-card__label">Total</span>
          </div>
          <div className="stat-card stat-card--todo">
            <span className="stat-card__number">{counts.todo}</span>
            <span className="stat-card__label">To Do</span>
          </div>
          <div className="stat-card stat-card--progress">
            <span className="stat-card__number">{counts['in-progress']}</span>
            <span className="stat-card__label">In Progress</span>
          </div>
          <div className="stat-card stat-card--done">
            <span className="stat-card__number">{counts.done}</span>
            <span className="stat-card__label">Done</span>
          </div>
        </div>

        {/* Add task toggle */}
        <div className="section-header">
          <h2>My Tasks</h2>
          <button
            className={`btn ${showForm ? 'btn-ghost' : 'btn-primary'}`}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="form-panel">
            <TaskForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <span className="filter-label">Status:</span>
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                className={`filter-btn ${statusFilter === s ? 'filter-btn--active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <span className="filter-label">Priority:</span>
            {PRIORITY_FILTERS.map((p) => (
              <button
                key={p}
                className={`filter-btn filter-btn--${p} ${priorityFilter === p ? 'filter-btn--active' : ''}`}
                onClick={() => setPriorityFilter(p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <TaskList
          tasks={tasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default Dashboard;
