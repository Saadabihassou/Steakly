"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Make sure to import Textarea
import toast, { Toaster } from "react-hot-toast";
import { sendEmailForNewHabit } from "@/lib/email";
import { useRouter } from "next/navigation";

type Habit = {
  _id: string;
  title: string;
  description?: string;
  streak: number;
};

type Entry = {
  _id: string;
  habitId: string;
  date: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [newHabitDescription, setNewHabitDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  // directing to edit page
  const router = useRouter();
  function editHabit(habitId: string) {
    router.push(`/dashboard/${habitId}`);
  }

  // Fetch habits and entries
  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);

      // Fetch habits and entries in parallel
      Promise.all([
        fetch("/api/habits").then((res) => res.json()),
        fetch("/api/entries").then((res) => res.json()),
      ])
        .then(([habitsData, entriesData]) => {
          setHabits(habitsData);
          setEntries(entriesData);
        })
        .catch((error) => {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to load data");
        })
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  // Check if a habit is completed today
  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return entries.some((entry) => {
      if (entry.habitId !== habitId) return false;

      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      return entryDate.getTime() === today.getTime();
    });
  };

  if (status === "loading" || isLoading)
    return <div className="p-6">Loading...</div>;
  if (status === "unauthenticated")
    return <div className="p-6">Please log in</div>;

  // Add habit
  async function addHabit() {
    if (!newHabit.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        body: JSON.stringify({
          title: newHabit,
          description: newHabitDescription,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to add habit");
      }

      const data = await res.json();
      setHabits((prev) => [...prev, data]);
      setNewHabit("");
      setNewHabitDescription("");
      setShowDescription(false);
      toast.success("Habit added successfully!");

      // sending email to user
      await sendEmailForNewHabit(
        session?.user?.email,
        session?.user?.name,
        session?.user?.image
      );
    } catch {
      toast.error("Failed to add habit");
    }
  }

  // Delete habit
  async function deleteHabit(habitId: string) {
    try {
      const res = await fetch(`/api/habits`, {
        method: "DELETE",
        body: JSON.stringify({ habitId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to delete habit");
      }

      setHabits((prev) => prev.filter((h) => h._id !== habitId));
      toast.success("Habit deleted successfully!");
    } catch {
      toast.error("Failed to delete habit");
    }
  }

  // Mark completed
  async function completeHabit(habitId: string) {
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        body: JSON.stringify({ habitId }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        // Refetch entries to get the latest data
        const entriesRes = await fetch("/api/entries");
        const newEntries = await entriesRes.json();
        setEntries(newEntries);

        // Update the streak in the state
        setHabits((prev) =>
          prev.map((h) =>
            h._id === habitId ? { ...h, streak: data.streak } : h
          )
        );

        toast.success(
          `Habit marked completed! Current streak: ${data.streak} 🔥`
        );
      } else {
        if (data.message === "Already marked today") {
          // Refetch entries to sync with server state
          const entriesRes = await fetch("/api/entries");
          const newEntries = await entriesRes.json();
          setEntries(newEntries);

          toast.error("You've already completed this habit today");
        } else {
          toast.error(data.error || "Something went wrong");
        }
      }
    } catch {
      toast.error("Failed to mark habit as completed");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <h1 className="text-2xl font-bold">
        Welcome back, {session?.user?.name}
      </h1>

      {/* Add Habit */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="New habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <Button onClick={addHabit}>Add</Button>
        </div>

        {showDescription ? (
          <div className="flex gap-2 items-start">
            <Textarea
              placeholder="Description (optional)"
              value={newHabitDescription}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewHabitDescription(e.target.value)
              }
              className="resize-none"
              rows={2}
            />
            <Button
              variant="ghost"
              onClick={() => setShowDescription(false)}
              className="mt-1"
            >
              ✕
            </Button>
          </div>
        ) : (
          <Button
            variant="link"
            onClick={() => setShowDescription(true)}
            className="p-0 h-auto text-sm text-gray-500"
          >
            + Add description
          </Button>
        )}
      </div>

      {/* List of Habits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const isCompleted = isHabitCompletedToday(habit._id);

          return (
            <Card
              key={habit._id}
              className={isCompleted ? "border-green-500" : ""}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {habit.title}
                  {isCompleted && (
                    <span className="text-green-500 text-sm">✅ Today</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {habit.description && (
                  <p className="text-sm text-gray-500 mb-2">
                    {habit.description}
                  </p>
                )}
                <p className="mt-2 font-medium">Streak: {habit.streak}🔥</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => completeHabit(habit._id)}
                    disabled={isCompleted}
                    className={
                      isCompleted
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : ""
                    }
                  >
                    {isCompleted ? "Completed ✅" : "Mark Today ✅"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => editHabit(habit._id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteHabit(habit._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No habits yet. Add your first habit to get started!</p>
        </div>
      )}
    </div>
  );
}
