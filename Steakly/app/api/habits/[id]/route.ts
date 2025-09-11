// app/api/habits/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";
import User from "@/models/User";

// GET /api/habits/:id -> fetch a single habit
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = User.findOne({ email: session.user.email });
    const habit = await Habit.findOne({
      _id: params.id,
      userId,
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("GET single habit error:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await req.json();

    await connectDB();
    const userId = User.findOne({ email: session.user.email });
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: params.id, userId },
      { title, description },
      { new: true }
    );

    if (!updatedHabit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error("PUT /api/habits/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}
