function generateSample(now = new Date(), random = Math.random) {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return {
    source: 'generated-sample', unit: '°C', timeZone: 'UTC',
    data: Array.from({ length: 10 }, (_, i) => ({
      date: end - (10 - i) * 86400000,
      temperature: Math.floor(random() * 30) + 15,
    })),
  };
}
function parseSample(payload) {
  if (!payload || !Array.isArray(payload.data) || payload.data.length > 366 ||
      !payload.data.every(row => row && Number.isFinite(row.date) &&
        Number.isFinite(new Date(row.date).getTime()) && Number.isFinite(row.temperature))) {
    throw new Error('The server returned invalid temperature data.');
  }
  return { ...payload, data: [...payload.data].sort((a, b) => a.date - b.date) };
}
module.exports = { generateSample, parseSample };
