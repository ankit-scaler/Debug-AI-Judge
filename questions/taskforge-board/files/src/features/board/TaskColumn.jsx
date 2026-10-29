import { TaskRow } from './TaskRow.jsx';
import { sortTasks } from './taskSort.js';

export function TaskColumn({ tasks, onToggle }) {
  const sorted = sortTasks(tasks);
  return (
    <ul className="task-column">
      {sorted.map((task, index) => (
        <TaskRow key={index} task={task} onToggle={onToggle} />
      ))}
    </ul>
  );
}
