import { NextResponse } from "next/server"
import { connectDB } from "@/app/lib/db"
import Todo from "@/app/models/Todo"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

// GET todos
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json([], { status: 401 })

  await connectDB()
  const todos = await Todo.find({ userId: session.user.id })
  return NextResponse.json(todos)
}

// CREATE todo
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({}, { status: 401 })

  const { title } = await req.json()
  await connectDB()

  const todo = await Todo.create({
    title,
    userId: session.user.id,
  })

  return NextResponse.json(todo)
}

// UPDATE todo
export async function PUT(req: Request) {
  const { id, completed } = await req.json()
  await connectDB()

  await Todo.findByIdAndUpdate(id, { completed })
  return NextResponse.json({ success: true })
}

// DELETE todo
export async function DELETE(req: Request) {
  const { id } = await req.json()
  await connectDB()

  await Todo.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
