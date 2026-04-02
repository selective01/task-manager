import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdate, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="task-list__empty">
        <div className="spinner" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-icon">📋</p>
        <p>No tasks found. Create one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
