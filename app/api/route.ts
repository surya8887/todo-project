import { connectDB } from "@/app/lib/db"
import mongoose from "mongoose"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()

    return NextResponse.json({
      status: "ok",
      dbState: mongoose.connection.readyState, // 1 = connected
      message: "MongoDB connected"
    })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "DB connection failed" },
      { status: 500 }
    )
  }
}
