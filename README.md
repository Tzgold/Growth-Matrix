
# Interactive Analytics Dashboard

A lightweight, high-performance analytics dashboard built with React and D3 for interactive time‑series visualizations, KPI tracking and quick PNG export.

- Live, client-side sample data generation: [`utils.generateSampleData`](utils/dataGenerator.ts)
- Main app entry: [`App`](App.tsx)
- D3-based visual components: [`components.LineChart`](components/LineChart.tsx), [`components.BarChart`](components/BarChart.tsx)
- Small UI primitives: [`components.KPICard`](components/KPICard.tsx), [`components.SummaryPanel`](components/SummaryPanel.tsx)
- Export helper: [`utils.exportSvgAsPng`](utils/exportUtils.ts)
- Shared types: [`types.DataPoint`](types.ts), [`types.TimeRange`](types.ts), [`types.MetricType`](types.ts), [`types.DashboardStats`](types.ts), [`types.SummaryInsights`](types.ts)

Project files (quick links)
- [App.tsx](App.tsx)
- [index.tsx](index.tsx)
- [index.html](index.html)
- [vite.config.ts](vite.config.ts)
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)
- [types.ts](types.ts)
- components/
  - [components/LineChart.tsx](components/LineChart.tsx)
  - [components/BarChart.tsx](components/BarChart.tsx)
  - [components/KPICard.tsx](components/KPICard.tsx)
  - [components/SummaryPanel.tsx](components/SummaryPanel.tsx)
- utils/
  - [utils/dataGenerator.ts](utils/dataGenerator.ts)
  - [utils/exportUtils.ts](utils/exportUtils.ts)
- [.gitignore](.gitignore)
- [metadata.json](metadata.json)

Features

- Interactive line and bar charts with D3 animations, area fills and tooltips.
- Time-range and metric switching (7d / 30d / all, users / sessions).
- KPI cards showing current value, contrast metric and growth.
- Summary insights panel with peak/lowest day and trend detection.
- Export any chart SVG to a high-resolution PNG using [`utils.exportSvgAsPng`](utils/exportUtils.ts) (invoked via component handles: [`components.LineChart.LineChartHandle`](components/LineChart.tsx) and [`components.BarChart.BarChartHandle`](components/BarChart.tsx)).
- Lightweight dev setup using Vite.

Quick start

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start dev server:
    ```bash
    npm run dev
    ```
   Default dev server port is 3000 (see [`vite.config.ts`](vite.config.ts)). Open http://localhost:3000.

3. Build for production:
    ```bash
    npm run build
    npm run preview
    ```

How the app is wired

- App root: [`App.tsx`](App.tsx) mounts UI and wires state: time range and metric selection.
- Data: sample data is generated client-side via [`utils.generateSampleData`](utils/dataGenerator.ts). The app seeds data once with `generateSampleData(120)`.
- Charts:
  - Main time‑series line: [`components.LineChart`](components/LineChart.tsx). Exposes a handle interface (`LineChartHandle`) to get the SVG element for export.
  - Session bars: [`components.BarChart`](components/BarChart.tsx). Also exposes a handle (`BarChartHandle`).
- Export: [`utils.exportSvgAsPng`](utils/exportUtils.ts) serializes an SVG, renders it to a canvas at 2x resolution and triggers a PNG download.
- Types: shared shapes and unions live in [`types.ts`](types.ts): [`types.DataPoint`](types.ts), [`types.TimeRange`](types.ts), [`types.MetricType`](types.ts), etc.

Usage notes

- Metric selection (Users / Sessions) and time-range (7d / 30d / all) are controlled in the header and reflected across KPIs and charts.
- Exporting charts:
  - Click the export button near the chart. The app calls the chart's handle (for example, `lineChartRef.current.getSvg()`) then `utils.exportSvgAsPng`.
- Tooltips are implemented in the SVG via D3 and positioned using page coordinates (see `components/LineChart.tsx` and `components/BarChart.tsx`).

Development tips

- Environment variables: `vite.config.ts` loads env values (example: `process.env.GEMINI_API_KEY`) via Vite's `loadEnv` — review [`vite.config.ts`](vite.config.ts) if you need build-time settings.
- Styling: Tailwind CDN is included in [`index.html`](index.html) for simple local styling.
- Type safety: Types are centralized in [`types.ts`](types.ts) and used across components.

Project structure

- App root and bootstrapping
  - [`index.html`](index.html) — HTML shell and Tailwind import
  - [`index.tsx`](index.tsx) — React DOM bootstrap
  - [`App.tsx`](App.tsx) — main layout and state
- Components
  - [`components/LineChart.tsx`](components/LineChart.tsx) — d3 line/area + tooltip + export handle
  - [`components/BarChart.tsx`](components/BarChart.tsx) — d3 bars + tooltip + export handle
  - [`components/KPICard.tsx`](components/KPICard.tsx) — KPI display
  - [`components/SummaryPanel.tsx`](components/SummaryPanel.tsx) — derived insight cards
- Utilities
  - [`utils/dataGenerator.ts`](utils/dataGenerator.ts) — `utils.generateSampleData`
  - [`utils/exportUtils.ts`](utils/exportUtils.ts) — `utils.exportSvgAsPng`
- Config
  - [`vite.config.ts`](vite.config.ts)
  - [`tsconfig.json`](tsconfig.json)
  - [`package.json`](package.json)

Contributing

- Create a branch, keep changes focused, add tests for non-UI logic when possible, then open a PR.
- Prefer keeping visualization logic inside components and utility logic (data generation, export) inside `utils/`.

Troubleshooting

- Blank screen on start: confirm dependencies installed and that `index.html` points to `/index.tsx`.
- Chart sizing oddities: charts compute width from the container offset; ensure parent containers are visible and the layout is not hidden by CSS.
- Export fails or PNG is blank: confirm the component handle returns the actual SVG element and that browser blocks popups/downloads.

License

- Add preferred license text here.

Acknowledgements

- Built with React and D3. Tailwind used for quick local styling in `index.html`.

If you want this README shortened, converted to a GitHub-style summary with badges, or translated to another format (e.g., MDX), request the specific format and it will be provided.
```// filepath: c:\Users\Admin\Downloads\interactive-analytics-dashboard\README.md
// ...existing code...
# Interactive Analytics Dashboard

A lightweight, high-performance analytics dashboard built with React and D3 for interactive time‑series visualizations, KPI tracking and quick PNG export.

- Live, client-side sample data generation: [`utils.generateSampleData`](utils/dataGenerator.ts)
- Main app entry: [`App`](App.tsx)
- D3-based visual components: [`components.LineChart`](components/LineChart.tsx), [`components.BarChart`](components/BarChart.tsx)
- Small UI primitives: [`components.KPICard`](components/KPICard.tsx), [`components.SummaryPanel`](components/SummaryPanel.tsx)
- Export helper: [`utils.exportSvgAsPng`](utils/exportUtils.ts)
- Shared types: [`types.DataPoint`](types.ts), [`types.TimeRange`](types.ts), [`types.MetricType`](types.ts), [`types.DashboardStats`](types.ts), [`types.SummaryInsights`](types.ts)

Project files (quick links)
- [App.tsx](App.tsx)
- [index.tsx](index.tsx)
- [index.html](index.html)
- [vite.config.ts](vite.config.ts)
- [package.json](package.json)
- [tsconfig.json](tsconfig.json)
- [types.ts](types.ts)
- components/
  - [components/LineChart.tsx](components/LineChart.tsx)
  - [components/BarChart.tsx](components/BarChart.tsx)
  - [components/KPICard.tsx](components/KPICard.tsx)
  - [components/SummaryPanel.tsx](components/SummaryPanel.tsx)
- utils/
  - [utils/dataGenerator.ts](utils/dataGenerator.ts)
  - [utils/exportUtils.ts](utils/exportUtils.ts)
- [.gitignore](.gitignore)
- [metadata.json](metadata.json)

Features

- Interactive line and bar charts with D3 animations, area fills and tooltips.
- Time-range and metric switching (7d / 30d / all, users / sessions).
- KPI cards showing current value, contrast metric and growth.
- Summary insights panel with peak/lowest day and trend detection.
- Export any chart SVG to a high-resolution PNG using [`utils.exportSvgAsPng`](utils/exportUtils.ts) (invoked via component handles: [`components.LineChart.LineChartHandle`](components/LineChart.tsx) and [`components.BarChart.BarChartHandle`](components/BarChart.tsx)).
- Lightweight dev setup using Vite.

Quick start

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start dev server:
    ```bash
    npm run dev
    ```
   Default dev server port is 3000 (see [`vite.config.ts`](vite.config.ts)). Open http://localhost:3000.

3. Build for production:
    ```bash
    npm run build
    npm run preview
    ```

How the app is wired

- App root: [`App.tsx`](App.tsx) mounts UI and wires state: time range and metric selection.
- Data: sample data is generated client-side via [`utils.generateSampleData`](utils/dataGenerator.ts). The app seeds data once with `generateSampleData(120)`.
- Charts:
  - Main time‑series line: [`components.LineChart`](components/LineChart.tsx). Exposes a handle interface (`LineChartHandle`) to get the SVG element for export.
  - Session bars: [`components.BarChart`](components/BarChart.tsx). Also exposes a handle (`BarChartHandle`).
- Export: [`utils.exportSvgAsPng`](utils/exportUtils.ts) serializes an SVG, renders it to a canvas at 2x resolution and triggers a PNG download.
- Types: shared shapes and unions live in [`types.ts`](types.ts): [`types.DataPoint`](types.ts), [`types.TimeRange`](types.ts), [`types.MetricType`](types.ts), etc.

Usage notes

- Metric selection (Users / Sessions) and time-range (7d / 30d / all) are controlled in the header and reflected across KPIs and charts.
- Exporting charts:
  - Click the export button near the chart. The app calls the chart's handle (for example, `lineChartRef.current.getSvg()`) then `utils.exportSvgAsPng`.
- Tooltips are implemented in the SVG via D3 and positioned using page coordinates (see `components/LineChart.tsx` and `components/BarChart.tsx`).

Development tips

- Environment variables: `vite.config.ts` loads env values (example: `process.env.GEMINI_API_KEY`) via Vite's `loadEnv` — review [`vite.config.ts`](vite.config.ts) if you need build-time settings.
- Styling: Tailwind CDN is included in [`index.html`](index.html) for simple local styling.
- Type safety: Types are centralized in [`types.ts`](types.ts) and used across components.

Project structure

- App root and bootstrapping
  - [`index.html`](index.html) — HTML shell and Tailwind import
  - [`index.tsx`](index.tsx) — React DOM bootstrap
  - [`App.tsx`](App.tsx) — main layout and state
- Components
  - [`components/LineChart.tsx`](components/LineChart.tsx) — d3 line/area + tooltip + export handle
  - [`components/BarChart.tsx`](components/BarChart.tsx) — d3 bars + tooltip + export handle
  - [`components/KPICard.tsx`](components/KPICard.tsx) — KPI display
  - [`components/SummaryPanel.tsx`](components/SummaryPanel.tsx) — derived insight cards
- Utilities
  - [`utils/dataGenerator.ts`](utils/dataGenerator.ts) — `utils.generateSampleData`
  - [`utils/exportUtils.ts`](utils/exportUtils.ts) — `utils.exportSvgAsPng`
- Config
  - [`vite.config.ts`](vite.config.ts)
  - [`tsconfig.json`](tsconfig.json)
  - [`package.json`](package.json)

Contributing

- Create a branch, keep changes focused, add tests for non-UI logic when possible, then open a PR.
- Prefer keeping visualization logic inside components and utility logic (data generation, export) inside `utils/`.

Troubleshooting

- Blank screen on start: confirm dependencies installed and that `index.html` points to `/index.tsx`.
- Chart sizing oddities: charts compute width from the container offset; ensure parent containers are visible and the layout is not hidden by CSS.
- Export fails or PNG is blank: confirm the component handle returns the actual SVG element and that browser blocks popups/downloads.

License

- Add preferred license text here.

Acknowledgements

- Built with React and D3. Tailwind used for quick local styling in `index.html`.

If you want this README shortened, converted to a GitHub-style summary with badges, or translated to another format (e.g., MDX), request the specific format and it will