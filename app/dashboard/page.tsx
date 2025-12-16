"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type Todo = {
  _id: string
  title: string
  completed: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  // 🔒 Protect route
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status])

  // 📥 Fetch todos
  const fetchTodos = async () => {
    const res = await fetch("/api/todos")
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => {
    if (status === "authenticated") fetchTodos()
  }, [status])

  // ➕ Create todo
  const addTodo = async () => {
    if (!title.trim()) return
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    })
    setTitle("")
    fetchTodos()
  }

  // ✅ Toggle complete
  const toggleTodo = async (todo: Todo) => {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({
        id: todo._id,
        completed: !todo.completed,
      }),
    })
    fetchTodos()
  }

  // ✏️ Edit todo
  const saveEdit = async (id: string) => {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({
        id,
        title: editingTitle,
      }),
    })
    setEditingId(null)
    setEditingTitle("")
    fetchTodos()
  }

  // ❌ Delete todo
  const deleteTodo = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    fetchTodos()
  }

  if (status === "loading") {
    return <div className="text-center text-neutral-400 mt-20">Loading…</div>
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-purple-600/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -right-40 h-[500px] w-[500px] bg-blue-600/20 blur-3xl rounded-full" />

      {/* 🔝 Navbar */}
      <header className="relative border-b border-neutral-800 bg-neutral-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TodoDash
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">
              {session?.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-3 py-1.5 rounded-md bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* 🧾 Content */}
      <main className="relative max-w-6xl mx-auto p-6 space-y-8">

        {/* 📊 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Total Todos" value={todos.length} />
          <Stat label="Completed" value={completedCount} />
          <Stat label="Pending" value={todos.length - completedCount} />
        </div>

        {/* ➕ Add Todo */}
        <div className="flex gap-3 bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 backdrop-blur">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-neutral-800/70 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={addTodo}
            className="px-5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 font-medium hover:opacity-90 transition"
          >
            Add
          </button>
        </div>

        {/* 📋 Todo List */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex items-center justify-between bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 backdrop-blur hover:border-neutral-700 transition"
            >
              {/* Left */}
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="h-4 w-4 accent-purple-500"
                />

                {editingId === todo._id ? (
                  <input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 flex-1"
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-neutral-500"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 text-sm">
                {editingId === todo._id ? (
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="text-green-400 hover:underline"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(todo._id)
                      setEditingTitle(todo.title)
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

/* ---------- Stat Card ---------- */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )
}
