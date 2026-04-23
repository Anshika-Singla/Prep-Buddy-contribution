export function createSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mergeTaskState(baseItem, savedItem = {}, pdfPath) {
  return {
    ...baseItem,
    pdf: savedItem.pdf || baseItem.pdf || pdfPath || '',
    resource: savedItem.resource || baseItem.resource || '',
    opened: savedItem.opened || false,
    completed: savedItem.completed || false,
    bookmarked: savedItem.bookmarked || false,
    reviseAt: savedItem.reviseAt || null,
    completedAt: savedItem.completedAt || null,
    lastCompletedAt: savedItem.lastCompletedAt || null,
    lastOpenedAt: savedItem.lastOpenedAt || null,
  };
}

export function syncDsaData(baseData, savedData = []) {
  return baseData.map((topic) => {
    const savedTopic = savedData.find((entry) => entry.name === topic.name);
    const topicCopy = { ...topic };

    Object.keys(topic).forEach((key) => {
      if (key !== 'name' && Array.isArray(topic[key])) {
        topicCopy[key] = topic[key].map((item) => {
          const savedItem = (savedTopic?.[key] || []).find((entry) => entry.name === item.name) || {};
          return mergeTaskState(
            item,
            savedItem,
            `/assets/dsa/${createSlug(topic.name)}/${createSlug(key)}/${createSlug(item.name)}.pdf`
          );
        });
      }
    });

    return topicCopy;
  });
}

export function syncGroupedData(baseData, savedData = {}, assetRoot) {
  return Object.fromEntries(
    Object.entries(baseData).map(([groupName, items]) => [
      groupName,
      items.map((item) => {
        const savedItem = (savedData[groupName] || []).find((entry) => entry.name === item.name) || {};
        return mergeTaskState(
          item,
          savedItem,
          `/assets/${assetRoot}/${createSlug(groupName)}/${createSlug(item.name)}.pdf`
        );
      }),
    ])
  );
}
