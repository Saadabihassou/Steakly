// app/dashboard/habits/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

type Habit = {
  title: string;
  description?: string;
};

export default function EditHabitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit>({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch habit
  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const res = await fetch(`/api/habits`, {
          body: JSON.stringify({ id }),
        });
        const data = await res.json();

        if (!res.ok || data.error) {
          toast.error(data.error || "Failed to load habit");
          router.push("/dashboard");
          return;
        }

        setHabit({ title: data.title, description: data.description });
      } catch {
        toast.error("Something went wrong loading habit");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHabit();
  }, [id, router]);

  if (loading) return <p className="text-center mt-6">Loading habit...</p>;

  // Update habit
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(habit),
      });

      if (res.ok) {
        toast.success("Habit updated successfully ✅");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update habit");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Habit</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          value={habit.title}
          onChange={(e) => setHabit({ ...habit, title: e.target.value })}
          placeholder="Habit title"
          required
        />
        <Input
          value={habit.description || ""}
          onChange={(e) => setHabit({ ...habit, description: e.target.value })}
          placeholder="Habit description"
        />
        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
