import cron from "node-cron";
import { User } from "../models/user.model.js";
import { checkAndCreateReminders } from "../utils/checkReminder.js";

// Run daily after every minute
cron.schedule("* * * * *", async () => {
  console.log("📅 Running daily reminder check...");

  try {
    const users = await User.find({ "preferences.reminderNotifications": true });

    for (const user of users) {
      await checkAndCreateReminders(user._id);
    }

    console.log("✅ Reminders processed.");
  } catch (error) {
    console.error("❌ Cron job failed:", error.message);
  }
});
