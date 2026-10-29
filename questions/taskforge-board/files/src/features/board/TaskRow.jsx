import { useState } from 'react';
import { Checkbox } from '../../components/ui/Checkbox.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';

export function TaskRow({ task, onToggle }) {
  const [done, setDone] = useState(task.done);

  function handleToggle() {
    const next = !done;
    setDone(next);
    onToggle(task.id, next);
  }

  return (
    <li
      className={done ? 'task-row task-row--done' : 'task-row'}
      data-testid={`task-row-${task.id}`}
    >
      <Checkbox checked={done} onChange={handleToggle} />
      <span className="task-row__title">{task.title}</span>
      <Avatar initials={task.assignee} />
    </li>
  );
}
