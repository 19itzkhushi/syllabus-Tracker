function parseSyllabus(text) {
  try {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    const result = [];
    let currentUnit = null;

    const isUnit = line =>
      /^(Unit|UNIT|Chapter)\s*\w+\s*[:\-]?\s*.+/i.test(line) || // "Unit I: Title" or "Chapter 2- Title"
      /^\d+\s*[:\-]?\s*.+/i.test(line); // "2: Title" or "2 - Title"

    const isBullet = line => /^[-•.]?\s*[^.\s]/.test(line);
    const isNumbered = line => /^\d+[.)]\s+/.test(line);
    const isDetailedTopic = line =>
      /^\d+[.)]\s+.+\(\d+\)\s*Periods?/i.test(line);

    const cleanUnitTitle = line => {
      return line
        .replace(/^(Unit|UNIT|Chapter)?\s*\w+\s*[:\-]?\s*/i, '') // Remove "Chapter 2 -"
        .replace(/^\.\s*/, '')
        .trim();
    };

    lines.forEach(line => {
      if (isUnit(line)) {
        if (currentUnit) result.push(currentUnit);
        currentUnit = { Chapter: cleanUnitTitle(line), topics: [] };
      } else {
        if (!currentUnit) {
          console.warn('Skipping line without unit:', line);
          return;
        }

        // Handle comma-separated topic list in one line
        if (
          !isNumbered(line) &&
          !isBullet(line) &&
          !isDetailedTopic(line) &&
          line.includes(',') &&
          line.length > 30
        ) {
          const topics = line
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
          topics.forEach(topic => {
            currentUnit.topics.push({ title: topic });
          });
        } else if (isDetailedTopic(line)) {
          const match = line.match(
            /^\d+[.)]\s+(.+?)\s*\((\d+)\)\s*Periods?/i
          );
          if (match) {
            currentUnit.topics.push({ title: match[1].trim() });
          }
        } else if (isNumbered(line) || isBullet(line)) {
          const cleaned = line.replace(/^[-•.\d)\s]+/, '').trim();
          currentUnit.topics.push({ title: cleaned });
        } else {
          currentUnit.topics.push({ title: line });
        }
      }
    });

    if (currentUnit) result.push(currentUnit);

    console.log(result);
    return result;
  } catch (error) {
    console.error('Error parsing syllabus:', error.message);
    return [];
  }
}



export {parseSyllabus};