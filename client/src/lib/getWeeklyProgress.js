import { startOfWeek, format, subWeeks } from "date-fns";

export function getWeeklyProgress(user) {
  const allCompletedUnits = [];

  user?.syllabi?.forEach((syllabus) => {
    syllabus.subjects?.forEach((subject) => {
      subject.chapters?.forEach((chapter) => {
        if (chapter.topics && chapter.topics.length > 0) {
          // Chapter has topics → include completed topics
          chapter.topics.forEach((topic) => {
            if (topic.isCompleted && topic.completedAt) {
              allCompletedUnits.push(new Date(topic.completedAt));
            }
          });
        } else {
          // No topics → include chapter itself if completed
          if (chapter.completed && chapter.completedOn) {
            allCompletedUnits.push(new Date(chapter.completedOn));
          }
        }
      });
    });
  });

  const weekMap = {};

  allCompletedUnits.forEach((date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekLabel = format(weekStart, "yyyy-MM-dd");
    weekMap[weekLabel] = (weekMap[weekLabel] || 0) + 1;
  });

  // Get last 5 week labels (including current week)
  const recentWeeks = [];
  for (let i = 4; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const weekKey = format(date, "yyyy-MM-dd");
    recentWeeks.push(weekKey);
  }

  return recentWeeks.map((week) => ({
    week,
    completed: weekMap[week] || 0,
  }));
}


