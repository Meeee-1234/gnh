
import mongoose from "mongoose";

const diarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String, required: true },
  sleepTime: { type: String, required: true },
  wakeTime: { type: String, required: true },
  totalHours: { type: Number, required: true },
  mood: { type: String, required: true },
  note: { type: String }
});

export default mongoose.model("Diary", diarySchema);
