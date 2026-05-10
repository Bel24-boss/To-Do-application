import { useDeferredValue, useEffect, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Command,
  ListChecks,
  LogOut,
  Plus,
  Rocket,
  Search,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import api, { getApiErrorMessage } from '../api';
import CosmicBackdrop from '../components/CosmicBackdrop';
import Notice from '../components/Notice';
import Spinner from '../components/Spinner';
import type { Todo, TodoDraft, TodoFilter } from '../types';
import useAuth from '../useAuth';

const emptyDraft: TodoDraft = {
  title: '',
  description: '',
};

const taskTimestampFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatTaskTimestamp(value: string) {
  return taskTimestampFormatter.format(new Date(value));
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [draft, setDraft] = useState<TodoDraft>(emptyDraft);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let isActive = true;

    const fetchTodos = async () => {
      try {
        const response = await api.get<Todo[]>('/todos');
        if (isActive) {
          setTodos(response.data);
        }
      } catch (error: unknown) {
        if (isActive) {
          setError(getApiErrorMessage(error, 'We could not load your tasks.'));
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchTodos();

    return () => {
      isActive = false;
    };
  }, []);

  const visibleTodos = todos
    .filter((todo) => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    })
    .filter((todo) => {
      const haystack = `${todo.title} ${todo.description ?? ''}`.toLowerCase();
      return haystack.includes(deferredQuery.trim().toLowerCase());
    });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  const handleCreateTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = draft.title.trim();
    const description = draft.description.trim();

    if (!title) {
      setError('A task title is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await api.post<Todo>('/todos', {
        title,
        description: description || null,
      });
      setTodos((currentTodos) => [response.data, ...currentTodos]);
      setDraft(emptyDraft);
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'We could not create that task.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    setError('');

    try {
      const response = await api.put<Todo>(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) =>
          currentTodo.id === todo.id ? response.data : currentTodo,
        ),
      );
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'We could not update that task.'));
    }
  };

  const deleteTodo = async (todoId: number) => {
    setError('');

    try {
      await api.delete(`/todos/${todoId}`);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch (error: unknown) {
      setError(getApiErrorMessage(error, 'We could not delete that task.'));
    }
  };

  return (
    <div className="app-shell">
      <CosmicBackdrop variant="dashboard" />
      <div className="dashboard-layout">
        <section className="panel command-hero">
          <div className="command-hero-copy">
            <p className="eyebrow">Orbital Command Center</p>
            <h1>Momentum Mission Control</h1>
            <p className="section-copy command-copy">
              A luxury deep-space cockpit for organizing priorities, verifying secure sessions, and
              tracking every task in motion.
            </p>

            <div className="command-chip-row">
              <span className="signal-chip">
                <ShieldCheck size={14} />
                Auth shield online
              </span>
              <span className="signal-chip signal-chip-secondary">
                <Rocket size={14} />
                Task stream active
              </span>
            </div>

            <div className="command-metrics">
              <article className="command-stat">
                <span className="command-stat-label">Total objectives</span>
                <strong>{todos.length}</strong>
                <p>Every secure task in your orbit.</p>
              </article>
              <article className="command-stat">
                <span className="command-stat-label">Live progress</span>
                <strong>{activeCount}</strong>
                <p>Open items still moving through the system.</p>
              </article>
              <article className="command-stat">
                <span className="command-stat-label">Mission complete</span>
                <strong>{completedCount}</strong>
                <p>Finished work captured without leaving the route.</p>
              </article>
            </div>
          </div>

          <div className="mission-radar">
            <div className="mission-radar-core" />
            <span className="mission-radar-ring mission-radar-ring-one" />
            <span className="mission-radar-ring mission-radar-ring-two" />
            <span className="mission-radar-ring mission-radar-ring-three" />
            <span className="mission-radar-sweep" />
            <span className="mission-radar-node mission-radar-node-a" />
            <span className="mission-radar-node mission-radar-node-b" />
            <span className="mission-radar-node mission-radar-node-c" />
            <span className="mission-radar-caption mission-radar-caption-a">Secure lane</span>
            <span className="mission-radar-caption mission-radar-caption-b">Task orbit</span>
            <span className="mission-radar-caption mission-radar-caption-c">Session shield</span>
          </div>
        </section>

        <header className="topbar">
          <div>
            <p className="eyebrow">Protected Workspace</p>
            <h2 className="dashboard-title">Telemetry overview</h2>
          </div>

          <div className="topbar-actions">
            <div className="verification-pill">
              <ShieldCheck size={16} />
              Token verified
            </div>
            <div className="user-chip">{user?.email}</div>
            <button className="button button-secondary" onClick={logout} type="button">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        <section className="dashboard-grid">
          <aside className="panel side-panel">
            <div>
              <p className="section-label">Systems</p>
              <h2>Elegant interface, original workflow.</h2>
              <p className="section-copy">
                The auth flow, token checks, protected calls, and task behavior remain exactly the same.
                Only the presentation has been elevated into a premium satellite-style control room.
              </p>
            </div>

            <div className="system-pulse-grid">
              <article className="pulse-chip">
                <ShieldCheck size={18} />
                <div>
                  <strong>Protected API channel</strong>
                  <p>Bearer headers stay attached to every secure request.</p>
                </div>
              </article>
              <article className="pulse-chip">
                <Sparkles size={18} />
                <div>
                  <strong>Readable by design</strong>
                  <p>The UI stays cinematic without becoming difficult to use.</p>
                </div>
              </article>
              <article className="pulse-chip">
                <Command size={18} />
                <div>
                  <strong>Core behavior preserved</strong>
                  <p>Register, login, logout, protected route, and CRUD remain unchanged.</p>
                </div>
              </article>
            </div>

            <div className="stat-grid">
              <article className="stat-card">
                <span className="stat-icon">
                  <Command size={16} />
                </span>
                <span>Total tasks</span>
                <strong>{todos.length}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-icon">
                  <Activity size={16} />
                </span>
                <span>In progress</span>
                <strong>{activeCount}</strong>
              </article>
              <article className="stat-card">
                <span className="stat-icon">
                  <Sparkles size={16} />
                </span>
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </article>
            </div>

            <form className="composer" onSubmit={handleCreateTodo}>
              <div>
                <p className="section-label">Launch Sequence</p>
                <h3>Transmit a new objective</h3>
              </div>

              <label className="field">
                <span>Task title</span>
                <input
                  className="text-input"
                  disabled={saving}
                  maxLength={120}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({ ...currentDraft, title: event.target.value }))
                  }
                  placeholder="Prepare weekly status update"
                  required
                  value={draft.title}
                />
              </label>

              <label className="field">
                <span>Notes</span>
                <textarea
                  className="text-area"
                  disabled={saving}
                  maxLength={400}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Context, constraints, or next actions"
                  rows={4}
                  value={draft.description}
                />
              </label>

              <button className="button button-primary" disabled={saving} type="submit">
                {saving ? <Spinner label="Saving task" /> : <Plus size={18} />}
                {!saving ? 'Add task' : null}
              </button>
            </form>
          </aside>

          <main className="panel board-panel">
            <div className="board-header">
              <div>
                <p className="section-label">Task Constellation</p>
                <h2>Protected route verified</h2>
                <p className="board-subtitle">
                  Search, filter, and manage your live objective stream with satellite-grade clarity.
                </p>
              </div>

              <div className="board-controls">
                <label className="search-field">
                  <Search size={16} />
                  <input
                    aria-label="Search tasks"
                    className="search-input"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search title or notes"
                    type="search"
                    value={query}
                  />
                </label>

                <div className="filter-row" aria-label="Task filters">
                  {(['all', 'active', 'completed'] as TodoFilter[]).map((filterOption) => (
                    <button
                      key={filterOption}
                      className={
                        filter === filterOption ? 'filter-button filter-button-active' : 'filter-button'
                      }
                      onClick={() => setFilter(filterOption)}
                      type="button"
                    >
                      {filterOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error ? <Notice tone="error">{error}</Notice> : null}

            <div className="board-metrics">
              <div className="board-metric-card">
                <span className="board-metric-label">Visible in orbit</span>
                <strong>{visibleTodos.length}</strong>
              </div>
              <div className="board-metric-card">
                <span className="board-metric-label">Secure operator</span>
                <p>{user?.email}</p>
              </div>
              <div className="board-metric-card board-metric-card-inline">
                <ArrowUpRight size={18} />
                <div>
                  <span className="board-metric-label">Live filter</span>
                  <p>{deferredQuery ? `Searching "${deferredQuery}"` : 'No search filter applied.'}</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <Spinner label="Loading your protected task list" />
              </div>
            ) : visibleTodos.length === 0 ? (
              <div className="empty-state">
                <ListChecks size={28} />
                <h3>No tasks match this view yet.</h3>
                <p>Create a task on the left or change the filters to see more.</p>
              </div>
            ) : (
              <div className="todo-list">
                {visibleTodos.map((todo) => (
                  <article className="todo-card" key={todo.id}>
                    <button
                      aria-label={todo.completed ? 'Mark task as active' : 'Mark task as completed'}
                      className="icon-button"
                      onClick={() => toggleTodo(todo)}
                      type="button"
                    >
                      {todo.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>

                    <div className="todo-copy">
                      <div className="todo-title-row">
                        <div className="todo-title-stack">
                          <h3 className={todo.completed ? 'todo-title todo-title-complete' : 'todo-title'}>
                            {todo.title}
                          </h3>
                          <div className="todo-meta">
                            <span className={todo.completed ? 'status-tag status-done' : 'status-tag status-open'}>
                              {todo.completed ? 'Done' : 'Open'}
                            </span>
                            <span className="todo-timestamp">Logged {formatTaskTimestamp(todo.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <p>{todo.description || 'No notes added for this task yet.'}</p>
                      <div className="todo-card-footer">
                        <span className="todo-footnote">
                          {todo.completed
                            ? 'Objective archived inside your protected orbit.'
                            : 'Awaiting completion from mission control.'}
                        </span>
                      </div>
                    </div>

                    <button
                      aria-label="Delete task"
                      className="icon-button icon-button-danger"
                      onClick={() => deleteTodo(todo.id)}
                      type="button"
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </main>
        </section>
      </div>
    </div>
  );
}
