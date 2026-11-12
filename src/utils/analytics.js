export const dailySeries = (counts = {}, range = '30') => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const start = new Date(today);
  if (range === 'all') {
    const firstDay = Object.keys(counts).sort()[0];
    if (firstDay && /^\d{4}-\d{2}-\d{2}$/.test(firstDay)) {
      start.setTime(new Date(`${firstDay}T00:00:00Z`).getTime());
    }
  } else {
    start.setUTCDate(today.getUTCDate() - Number(range) + 1);
  }

  const labels = [];
  const values = [];
  for (const day = new Date(start); day <= today; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    labels.push(date);
    values.push(Number(counts[date] || 0));
  }
  return { labels, values };
};

export const categorySeries = (counts = {}, limit = 6) => {
  const entries = Object.entries(counts)
    .map(([label, value]) => [label || 'Other', Number(value)])
    .filter(([, value]) => Number.isFinite(value) && value > 0)
    .sort((a, b) => b[1] - a[1]);

  const visible = entries.slice(0, limit);
  const remaining = entries.slice(limit).reduce((total, [, value]) => total + value, 0);
  if (remaining) {
    const other = visible.find(([label]) => label === 'Other');
    if (other) other[1] += remaining;
    else visible.push(['Other', remaining]);
  }

  return {
    labels: visible.map(([label]) => label),
    values: visible.map(([, value]) => value)
  };
};
