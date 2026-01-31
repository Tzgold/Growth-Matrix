

A compact, reusable visualization used inside the Interactive Analytics Dashboard to compare growth across segments, metrics and time ranges. The Growth Matrix component is intended to highlight relative change (growth/decline), surface top/bottom performers, and provide a quick export option.

## Key features

- Grid-style matrix showing percentage growth and absolute delta per segment
- Conditional coloring for positive / negative growth
- Tooltip with exact values on hover
- Optional sorting and top-N highlighting
- Export to PNG/SVG via provided export helper

## Example usage

Import the component into your app and pass a simple data array:

```tsx
// Example usage (TypeScript / React)
import GrowthMatrix from '../Growth-Matrix/GrowthMatrix'
import { generateSampleData } from '../utils/dataGenerator'

const data = generateSampleData({ days: 30 }) // or your backend data

<GrowthMatrix
  data={data}                     // see Data shape below
  metric="sessions"               // metric key to visualize
  timeRange="30d"                 // UI time range
  topN={6}                        // show top 6 segments (optional)
  onExport={(svgEl) => exportSvgAsPng(svgEl, { scale: 2 })} // optional
/>
```

## Data shape

The component expects an array of segment records. Minimal required fields:

```ts
type GrowthRow = {
  id: string
  label: string
  baseline: number      // value in the earlier period
  current: number       // value in the later/current period
  meta?: Record<string, any>
}
```

The component computes:
- absolute delta = current - baseline
- percent change = (current - baseline) / baseline

Rows with baseline === 0 are handled gracefully (shows N/A or special styling).

## Styling & theming

- The component exposes a root CSS class `.growth-matrix` — use CSS or Tailwind to theme.
- Cells use `.gm-cell`, positive values use `.gm-positive`, negatives `.gm-negative`.
- Example CSS hooks:
```css
.growth-matrix .gm-cell { transition: background 120ms; }
.growth-matrix .gm-positive { background: #e6ffed; color: #046a33; }
.growth-matrix .gm-negative { background: #fff1f0; color: #8b0000; }
```

## Integration & running locally

This component is part of the main Vite app. To run the full dashboard:

1. Install dependencies from the project root:
   npm install

2. Start dev server:
   npm run dev

Edit or test Growth Matrix in the dev UI at the dashboard route where it's mounted


