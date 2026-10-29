import './App.css';
import { TaskBoard } from './features/board/TaskBoard.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>TaskForge</h1>
        <span className="app-header__subtitle">Sprint board</span>
      </header>
      <main>
        <TaskBoard />
      </main>
    </div>
  );
}
