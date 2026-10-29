import { useTasks } from './useTasks.js';
import { TaskColumn } from './TaskColumn.jsx';

export function TaskBoard() {
  const { tasks, toggleDone } = useTasks();

  return (
    <section className="task-board" data-testid="task-board">
      <h2>Sprint board</h2>
      <TaskColumn tasks={tasks} onToggle={toggleDone} />
    </section>
  );
}
