import { Schema, model, models } from "mongoose"

const HabitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    title: { type: String, required: true },
    description: { type: String },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const Habit = models.Habit || model("Habit", HabitSchema)

export default Habit
