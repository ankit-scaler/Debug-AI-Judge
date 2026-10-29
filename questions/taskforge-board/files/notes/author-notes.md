# Author notes (hidden from learners)

Bug: `TaskColumn` renders each `TaskRow` with `key={index}` over the
*sorted* list, while `TaskRow` seeds its own local `done` state from
`task.done` with `useState(task.done)` (only read once, on mount).

`sortTasks` moves a task to a different index the moment it is marked
done. Because the key is the index, not the task, React treats the row at
that index as "the same component" across the resort and does not reset
its local state — so a different task inherits the previous occupant's
leftover `done` state at that slot, while the task that was actually
toggled loses track of its own new value once it moves to a slot whose
old occupant was never toggled.

Concretely, with the seeded tasks (ids 1 and 3 share priority 1, so 1
sorts before 3): marking task 1 ("Fix login bug") done moves task 3
("Review PR #482") into slot 0, and that slot's row keeps rendering a
checked box — task 3 now visually appears done, and task 1 (now at the
last slot) visually appears NOT done, even though the data says the
opposite for both.

Fix: `key={task.id}` instead of `key={index}` in `TaskColumn.jsx`. With a
stable identity per task, React matches each row to its own task across
re-sorts, so `TaskRow`'s local state always stays attached to the correct
task.
