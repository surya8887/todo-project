import { connectDB } from "@/app/lib/db"
import User from "@/app/models/User"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  await connectDB()

  const exists = await User.findOne({ email })
  if (exists) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "credentials"
  })

  return NextResponse.json({ message: "User registered successfully" })
}
