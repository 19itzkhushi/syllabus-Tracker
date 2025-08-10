import cron from "node-cron";
import { Notification } from "../models/notification.model.js";

// Every day at midnight
cron.schedule("0 0 * * *", async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  await Notification.deleteMany({ createdAt: { $lt: cutoff } });
  console.log("🧹 Old notifications cleaned up");
});
