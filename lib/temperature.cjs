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
module.exports = { generateSample };
