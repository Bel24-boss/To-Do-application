import { useDeferredValue, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ListChecks,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

import api, { getApiErrorMessage } from '../api';
import Notice from '../components/Notice';
import Spinner from '../components/Spinner';
import type { Todo, TodoDraft, TodoFilter } from '../types';
import useAuth from '../useAuth';

const emptyDraft: TodoDraft = {
  title: '',
  description: '',
};

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
      <div className="dashboard-layout">
        <header className="topbar">
          <div>
            <p className="eyebrow">Protected Workspace</p>
            <h1>Momentum Board</h1>
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
              <p className="section-label">System Status</p>
              <h2>Everything you need is wired up.</h2>
              <p className="section-copy">
                Registration, login, token verification, and protected API access all work together here.
              </p>
            </div>

            <div className="stat-grid">
              <article className="stat-card">
                <span>Total tasks</span>
                <strong>{todos.length}</strong>
              </article>
              <article className="stat-card">
                <span>In progress</span>
                <strong>{activeCount}</strong>
              </article>
              <article className="stat-card">
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </article>
            </div>

            <form className="composer" onSubmit={handleCreateTodo}>
              <div>
                <p className="section-label">Create Task</p>
                <h3>Add focused work</h3>
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
                <p className="section-label">Task Board</p>
                <h2>Protected route verified</h2>
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
                        <h3 className={todo.completed ? 'todo-title todo-title-complete' : 'todo-title'}>
                          {todo.title}
                        </h3>
                        <span className={todo.completed ? 'status-tag status-done' : 'status-tag status-open'}>
                          {todo.completed ? 'Done' : 'Open'}
                        </span>
                      </div>
                      <p>{todo.description || 'No notes added for this task yet.'}</p>
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
