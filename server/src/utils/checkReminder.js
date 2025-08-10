import dayjs from "dayjs";
import { Syllabus } from "../models/syllabus.model.js";
import { Notification } from "../models/notification.model.js";

export const checkAndCreateReminders = async (userId) => {
  const todayStart = dayjs().startOf('day').toDate();
  const todayEnd = dayjs().endOf('day').toDate();
  const now = dayjs();
const currentMinuteStart = now.startOf('minute').toDate();
const currentMinuteEnd = now.endOf('minute').toDate();

  const syllabus = await Syllabus.findOne({ userId });

  if (!syllabus) return;

  for (const subject of syllabus.subjects) {
    for (const chapter of subject.chapters) {
      for (const topic of chapter.topics) {
        if (
          topic.reminder &&
  new Date(topic.reminder) >= currentMinuteStart &&
  new Date(topic.reminder) <= currentMinuteEnd
        ) {
          const alreadyExists = await Notification.exists({
            userId,
            message: new RegExp(topic.name, "i"), // more specific than generic "topic.*due.*today"
            createdAt: { $gte: todayStart, $lt: todayEnd }
          });

          if (!alreadyExists) {
            console.log("📌 Creating notification for:", topic.name);

            await Notification.create({
              userId,
              message: `You are reminded for "${topic.name}" from chapter "${chapter.title}" of subject "${subject.name}" today.`,
              type: "reminder",
            });
          }
        }
      }
    }
  }
};

