const mongoose = require("mongoose");

const psqiSchema = new mongoose.Schema({
  user_id: { type: String, default: null }, // ถ้า login แล้วจะส่ง user id มา
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

module.exports = mongoose.model("PSQI", psqiSchema);
