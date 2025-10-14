import express from "express";
const router = express.Router();
import PSQI from "../models/PSQI.js";

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      bedtime,
      sleepLatencyMin,
      wakeTime,
      sleepHours,
      components,
      global,
      efficiencyPercent,
      timeInBedMin,
    } = req.body;

    const newResult = new PSQI({
      user_id: user_id || null,
      bedtime,
      sleepLatencyMin,
      wakeTime,
      sleepHours,
      components,
      global,
      efficiencyPercent,
      timeInBedMin,
    });

    await newResult.save();
    res.status(200).json({ ok: true, id: newResult._id });
  } catch (err) {
    console.error("❌ POST /api/psqi", err);
    res.status(500).json({ ok: false, error: "Server Error" });
  }
});

export default router;
