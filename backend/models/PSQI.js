import mongoose from "mongoose";

const psqiSchema = new mongoose.Schema({
  user_id: { type: String, default: null },
  bedtime: String,
  sleepLatencyMin: Number,
  wakeTime: String,
  sleepHours: Number,
  components: {
    c1: Number,
    c2: Number,
    c3: Number,
    c4: Number,
    c5: Number,
    c6: Number,
    c7: Number,
  },
  global: Number,
  efficiencyPercent: Number,
  timeInBedMin: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PSQI", psqiSchema);
