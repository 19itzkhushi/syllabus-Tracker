import cron from "node-cron";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

cron.schedule("0 0 * * *", async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    // Step 1: Delete read notifications older than 7 days
    const oldRead = await Notification.deleteMany({
      createdAt: { $lt: sevenDaysAgo },
      read: true,
    });

    // Step 2: For each user, keep only latest 100 notifications
    const users = await User.find({}, "_id");
    for (const user of users) {
      const extra = await Notification.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(100)
        .select("_id");

      if (extra.length > 0) {
        const idsToDelete = extra.map(n => n._id);
        await Notification.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`🧹 Trimmed notifications for user ${user._id}`);
      }
    }

    console.log(`🧹 Deleted ${oldRead.deletedCount} old read notifications`);
  } catch (err) {
    console.error("❌ Error during notification cleanup:", err);
  }
});

