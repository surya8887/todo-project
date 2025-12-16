import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { connectDB } from "@/app/lib/db"
import Todo from "@/app/models/Todo"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await connectDB()

  const userId = session.user.id

  const total = await Todo.countDocuments({ userId })
  const completed = await Todo.countDocuments({ userId, completed: true })
  const pending = total - completed

  const todos = await Todo.find({ userId }).sort({ createdAt: -1 })

  return NextResponse.json({
    total,
    completed,
    pending,
    todos,
  })
}
