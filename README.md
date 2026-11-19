# Temperature Graph

A Next.js / React / Chart.js temperature visualization demo. The API generates ten sample values for the previous ten complete UTC days. **These are random demo values, not measured or forecast weather.** No weather provider, API key, account, database, or paid service is needed.

## Run locally

Use Node.js 22 and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production server, run `npm run build` then `npm start`.

## Behavior

- `/api` returns `{ source: "generated-sample", unit: "°C", timeZone: "UTC", data: [{ date, temperature }] }`. Dates are UTC-midnight epoch milliseconds; generated integer values range from 15 through 44 °C. Each request generates new values; responses are not cached.
- The chart and semantic table show the same chronological values. The table preserves full dates and supplies a non-canvas alternative.
- Requests time out after ten seconds. Network/HTTP/JSON/schema errors and empty results have an explicit retry control. Unmounted requests are cancelled.
- The chart has no animation, supports pointer tooltips, and fits 320px and larger layouts. Keyboard users can read the table and activate retry.

## Validation

```sh
npx playwright install chromium
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Browser tests start the built production app on port 3018; keep that port free. Four Node tests exercise date boundaries and response validation. Eighteen Chromium cases cover the real API, failure/retry, invalid payloads, empty/timeout states, table semantics, keyboard recovery, reduced motion and responsive widths. CI uses Ubuntu 24.04 and installs Chromium dependencies. This JavaScript repository has no separate TypeScript check.

## Release status and limitations

The current framework is legacy Next.js 12.1.6. The dependency audit on 20 November 2026 initially reported 18 advisories; compatible lockfile updates reduced this to 2 remaining findings (1 critical, 1 high, in Next.js and its PostCSS dependency). Passing functional tests is not production security clearance. Resolve the framework/dependency findings in a separately validated migration before public production release; do not run a forced audit upgrade blindly.

No public deployment is verified. The repository has no configured homepage or GitHub Pages site. The `/api` endpoint requires a Next-compatible runtime; uploading static files to Pages alone will not run it. Reuse an existing free host if one is available, without paid upgrades or provisioning.

Release checklist:

1. Resolve dependency advisories and run all checks above.
2. Review/merge the scoped branch and confirm the actual hosting build succeeds.
3. Open the served URL and verify its sample disclosure, ten values, UTC dates and matching table.
4. Check 320px layout and keyboard retry after blocking `/api`; restore networking and confirm recovery.
5. Record the URL and deployed commit only after served behavior is verified.

See [the improvement register](docs/improvement-log.md) for scope, risk and deployment backlog.
