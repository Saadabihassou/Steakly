"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Habit = {
  _id: string;
  title: string;
  description?: string;
  maxStreak: number;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");

  // Fetch habits
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/habits")
        .then((res) => res.json())
        .then((data) => setHabits(data));
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please log in</p>;

  // Add habit
  async function addHabit() {
    if (!newHabit.trim()) return;
    const res = await fetch("/api/habits", {
      method: "POST",
      body: JSON.stringify({ title: newHabit }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setHabits((prev) => [...prev, data]);
    setNewHabit("");
  }

  // Mark completed
  async function completeHabit(habitId: string) {
    const res = await fetch("/api/entries", {
      method: "POST",
      body: JSON.stringify({ habitId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (res.ok) {
      alert(`Habit marked completed! Current streak: ${data.maxStreak}🔥`);

      // Update the streak in the state
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habitId ? { ...h, streak: data.maxStreak } : h
        )
      );
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {session?.user?.name}
      </h1>

      {/* Add Habit */}
      <div className="flex gap-2">
        <Input
          placeholder="New habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
        />
        <Button onClick={addHabit}>Add</Button>
      </div>

      {/* List of Habits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card key={habit._id}>
            <CardHeader>
              <CardTitle>{habit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{habit.description}</p>
              <p className="mt-2 font-medium">Streak: {habit.maxStreak}🔥</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => completeHabit(habit._id)}>
                  Mark Today ✅
                </Button>
                <Button size="sm" variant="secondary">
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
