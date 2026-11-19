const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests/browser', fullyParallel: true, workers: 2,
  use: { baseURL: 'http://127.0.0.1:3018' },
  webServer: { command: 'npm run start -- --hostname 127.0.0.1 --port 3018', url: 'http://127.0.0.1:3018', reuseExistingServer: false },
  projects: [{name:'desktop',use:{viewport:{width:1280,height:800}}}, {name:'mobile',use:{viewport:{width:320,height:740}}}],
});
