import mongoose, { Schema, models } from "mongoose";

const EntrySchema = new Schema({
  habitId: {
    type: Schema.Types.ObjectId,
    ref: "Habit",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users", // 🔥 keep in sync with NextAuth users
    required: true,
  },
  date: { type: String, required: true }, // store as YYYY-MM-DD
  completed: { type: Boolean, default: true },
});

const Entry = models.Entry || mongoose.model("Entry", EntrySchema);
export default Entry;
