import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"
import User from "@/models/User"

// GET: Fetch all habits for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    // Find the Mongo user
    const dbUser = await User.findOne({ email: session.user.email })
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const habits = await Habit.find({ userId: dbUser._id })
    return NextResponse.json(habits, { status: 200 })
  } catch (err) {
    console.error("GET /api/habits error:", err)
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    )
  }
}

// POST: Create a new habit for logged-in user
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const title = (body.title || "").trim()
    const description = body.description || ""

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    await connectDB()

    // Find user
    const dbUser = await User.findOne({ email: session.user.email })
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create new habit
    const habit = await Habit.create({
      userId: dbUser._id,
      title,
      description,
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (err) {
    console.error("POST /api/habits error:", err)
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    )
  }
}
