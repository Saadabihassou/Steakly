// app/api/entries/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectDB } from "@/lib/mongodb"
import Habit from "@/models/Habit"
import Entry from "@/models/Entry"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { habitId } = body
    if (!habitId) return NextResponse.json({ error: "habitId required" }, { status: 400 })

    await connectDB()

    const dbUser = await User.findOne({ email: session.user.email })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const habit = await Habit.findOne({ _id: habitId, userId: dbUser._id })
    if (!habit) return NextResponse.json({ error: "Habit not found" }, { status: 404 })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if entry already exists for today
    const existing = await Entry.findOne({
      habitId: habit._id,
      userId: dbUser._id,
      date: today,
    })

    if (existing) return NextResponse.json({ message: "Already marked today" }, { status: 200 })

    // Create entry
    await Entry.create({
      userId: dbUser._id,
      habitId: habit._id,
      date: today,
    })

    // Update streak
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const hadYesterday = await Entry.findOne({
      habitId: habit._id,
      userId: dbUser._id,
      date: yesterday,
    })

    habit.streak = hadYesterday ? habit.streak + 1 : 1
    await habit.save()

    return NextResponse.json({ message: "Marked complete", streak: habit.streak }, { status: 201 })
  } catch (err) {
    console.error("POST /api/entries error:", err)
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 })
  }
}

import {ObjectId} from 'mongoose'

// Alternative approach for the query building
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const dbUser = await User.findOne({ email: session.user.email })
    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Get URL parameters for filtering
    const { searchParams } = new URL(req.url)
    const habitId = searchParams.get('habitId')
    
    // Build query using Record<string, any>
    const query: Record<string, string | ObjectId> = { userId: dbUser._id }
    if (habitId) query.habitId = habitId
    
    // Get entries
    const entries = await Entry.find(query).sort({ date: -1 })
    
    // Return consistent format - always an array of entries
    return NextResponse.json(entries, { status: 200 })
  } catch (err) {
    console.error("GET /api/entries error:", err)
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 })
  }
}