import {
  assertNormalizedGrowerDashboardPayload,
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  type DashboardPolygonGeometry,
  type NormalizedGrowerDashboardField,
  type NormalizedGrowerDashboardPayload,
} from "./contracts.ts";

const INLINE_CSS = `
:root {
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #eef4ec;
  color: #17261b;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(137, 198, 126, 0.18), transparent 28%),
    linear-gradient(180deg, #f7fbf5 0%, #eef4ec 100%);
}

main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 20px 72px;
}

.shell {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(23, 38, 27, 0.08);
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(43, 69, 50, 0.12);
}

.shell-body {
  display: grid;
  gap: 28px;
  padding: 0 0 32px;
}

.hero {
  display: grid;
  gap: 18px;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(230, 244, 226, 0.95), rgba(245, 250, 241, 0.98)),
    #f6faf3;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero-topline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.hero-meta {
  display: grid;
  gap: 6px;
  justify-items: end;
  text-align: right;
}

.hero-meta .label,
.hero-meta .value,
.hero-meta .detail {
  margin-top: 0;
}

.hero-meta .value {
  font-size: 1rem;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4d7758;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.lede {
  margin: 0;
  max-width: 62ch;
  font-size: 1.02rem;
  line-height: 1.7;
  color: #355141;
}

.sublede {
  margin: 0;
  color: #587061;
  font-size: 0.96rem;
}

.hero-aside {
  display: grid;
  gap: 14px;
}

.hero-note {
  padding: 18px;
  border-radius: 24px;
  background: #18281d;
  color: #f2f8f1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hero-note h2,
.portfolio h2,
.section-title,
.map-panel h2,
.teaser-card h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.hero-note p,
.portfolio-copy,
.signal-copy,
.map-copy,
.teaser-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: inherit;
}

.portfolio {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.portfolio-grid,
.summary-grid,
.signal-grid,
.map-grid,
.teaser-metrics,
.weather-grid {
  display: grid;
  gap: 14px;
}

.portfolio-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.summary-wrap,
.signal-wrap,
.map-wrap,
.weather-wrap,
.soil-wrap,
.crop-wrap,
.imagery-wrap,
.diagnostics-wrap {
  padding: 0 32px 32px;
}

.overview-grid,
.downstream-grid {
  display: grid;
  gap: 18px;
  padding: 0 32px;
}

.overview-grid {
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  align-items: start;
}

.overview-grid .summary-wrap,
.overview-grid .signal-wrap,
.downstream-grid .map-wrap,
.downstream-grid .weather-wrap,
.downstream-grid .soil-wrap,
.downstream-grid .crop-wrap,
.downstream-grid .imagery-wrap {
  padding: 0;
}

.overview-grid .summary-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.overview-grid .signal-grid {
  grid-template-columns: 1fr;
  margin-top: 0;
}

.selection-stage {
  padding: 0 32px;
}

.selection-panel {
  border-radius: 24px;
  padding: 20px;
  border: 1px solid rgba(23, 38, 27, 0.08);
  background: linear-gradient(180deg, #fbfdf9 0%, #f1f6ef 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
}

.selection-header {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  gap: 18px;
  align-items: end;
}

.selection-copy,
.selection-guide-copy {
  margin: 10px 0 0;
  font-size: 0.96rem;
  line-height: 1.65;
}

.selection-guide-copy {
  color: #4f695a;
}

.selection-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.selection-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 11px;
  background: rgba(69, 119, 83, 0.08);
  color: #214d2f;
  font-size: 0.82rem;
  font-weight: 700;
  border: 1px solid rgba(69, 119, 83, 0.12);
}

.selection-table-scroll {
  margin-top: 18px;
  overflow-x: auto;
  border-radius: 20px;
  border: 1px solid rgba(23, 38, 27, 0.08);
  background: rgba(255, 255, 255, 0.92);
}

.selection-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 920px;
}

.selection-table thead th {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #587061;
  background: rgba(238, 246, 235, 0.98);
  border-bottom: 1px solid rgba(23, 38, 27, 0.08);
}

.selection-table tbody td {
  padding: 14px 16px;
  vertical-align: top;
  border-bottom: 1px solid rgba(23, 38, 27, 0.08);
}

.selection-table tbody tr:last-child td {
  border-bottom: none;
}

.selection-table-row {
  transition: background 140ms ease, box-shadow 140ms ease;
  outline: none;
}

.selection-table-row:hover,
.selection-table-row:focus-visible {
  background: rgba(240, 247, 238, 0.92);
}

.selection-table-row[data-selected="true"] {
  background: linear-gradient(90deg, rgba(230, 244, 226, 0.95), rgba(245, 249, 242, 0.98));
  box-shadow: inset 4px 0 0 #31503c;
}

.action-field-cell {
  min-width: 240px;
}

.action-field-stack,
.action-window-cell,
.action-limiter-cell {
  display: grid;
  gap: 8px;
}

.field-table-button {
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  text-align: left;
  color: inherit;
  cursor: pointer;
}

.field-table-button.is-selected .action-field-name {
  color: #173d24;
}

.field-table-button:focus-visible {
  outline: 2px solid rgba(49, 80, 60, 0.35);
  outline-offset: 4px;
  border-radius: 12px;
}

.action-field-name,
.action-window-value,
.action-limiter-value {
  font-size: 0.98rem;
  font-weight: 700;
  color: #1d3424;
}

.action-field-meta,
.action-window-meta {
  font-size: 0.84rem;
  line-height: 1.45;
  color: #5a7464;
}

.action-priority-badge,
.action-state-pill,
.action-confidence-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.action-priority-badge {
  background: rgba(24, 40, 29, 0.08);
  color: #274534;
}

.action-priority-badge.priority-0 {
  background: rgba(80, 143, 89, 0.16);
  color: #1f5a2d;
}

.action-priority-badge.priority-1 {
  background: rgba(176, 150, 67, 0.16);
  color: #6f5615;
}

.action-priority-badge.priority-2,
.action-confidence-badge {
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
}

.action-priority-badge.priority-3 {
  background: rgba(179, 64, 64, 0.12);
  color: #8a2d2d;
}

.action-state-pill.tone-ready {
  background: rgba(80, 143, 89, 0.16);
  color: #1f5a2d;
}

.action-state-pill.tone-soon {
  background: rgba(176, 150, 67, 0.16);
  color: #6f5615;
}

.action-state-pill.tone-watch,
.action-state-pill.tone-neutral {
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
}

.action-state-pill.tone-blocked {
  background: rgba(179, 64, 64, 0.12);
  color: #8a2d2d;
}

.action-confidence-cell {
  white-space: nowrap;
}

.downstream-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: start;
}

.downstream-grid .map-wrap,
.downstream-grid .weather-wrap,
.downstream-grid .imagery-wrap {
  grid-column: 1 / -1;
}

.summary-wrap {
  margin-top: -8px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.signal-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 14px;
}

.map-grid {
  grid-template-columns: minmax(0, 1fr);
  align-items: stretch;
}

.map-stage-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 18px;
  align-items: start;
  margin-top: 12px;
}

.map-stage-main {
  display: grid;
  gap: 12px;
}

.field-focus-panel {
  position: sticky;
  top: 20px;
  display: grid;
  gap: 14px;
  border-radius: 24px;
  padding: 18px;
  background: linear-gradient(180deg, #fbfdf9 0%, #edf4ea 100%);
  border: 1px solid rgba(23, 38, 27, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.62);
  max-height: calc(100vh - 40px);
  overflow: auto;
}

.field-focus-panel[data-detail-state="overview"] {
  background: linear-gradient(180deg, #f8fbf7 0%, #f1f6ef 100%);
}



.field-focus-header,
.field-focus-topline,
.field-focus-limiter {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.field-focus-topline {
  align-items: center;
}

.field-focus-title {
  margin: 0;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  color: #17311f;
}

.field-focus-copy,
.field-focus-support-copy,
.field-support-copy,
.field-support-meta,
.field-overview-copy {
  margin: 8px 0 0;
  color: #4f695a;
  font-size: 0.92rem;
  line-height: 1.55;
}

.field-focus-reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(49, 80, 60, 0.14);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.88);
  color: #274534;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
}

.field-focus-reset:hover,
.field-focus-reset:focus-visible {
  background: #ffffff;
}

.field-focus-reset:focus-visible {
  outline: 2px solid rgba(49, 80, 60, 0.35);
  outline-offset: 3px;
}

.field-focus-meta-grid,
.field-plan-grid,
.field-overview-grid {
  display: grid;
  gap: 12px;
}

.field-focus-meta-grid,
.field-plan-grid,
.field-overview-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field-focus-meta-card,
.field-plan-card,
.field-limiter-card,
.field-overview-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 14px;
}

.field-plan-card.corn {
  background: linear-gradient(180deg, rgba(255, 243, 191, 0.92), rgba(255, 235, 168, 0.94));
}

.field-plan-card.soy {
  background: linear-gradient(180deg, rgba(223, 245, 210, 0.94), rgba(208, 236, 189, 0.96));
}

.field-plan-card .action-state-pill,
.field-limiter-card .action-confidence-badge {
  margin-top: 10px;
}

.field-plan-window,
.field-limiter-value {
  display: block;
  margin-top: 10px;
  font-size: 1.12rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #17311f;
}

.field-overview-copy {
  margin-top: 0;
}

.field-evidence-stage {
  display: grid;
  gap: 12px;
}

.field-evidence-header {
  display: grid;
  gap: 6px;
}

.field-evidence-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field-evidence-card {
  border-radius: 18px;
  border: 1px solid rgba(23, 38, 27, 0.08);
  background: rgba(255, 255, 255, 0.88);
  overflow: hidden;
}

.field-evidence-card[open] {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.72);
}

.field-evidence-card summary {
  list-style: none;
  cursor: pointer;
  padding: 14px 16px;
}

.field-evidence-card summary::-webkit-details-marker {
  display: none;
}

.field-evidence-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.field-evidence-summary-copy {
  margin: 6px 0 0;
  color: #4f695a;
  font-size: 0.84rem;
  line-height: 1.45;
}

.field-evidence-summary h3 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
  color: #17311f;
}

.field-evidence-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 9px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.field-evidence-body {
  padding: 0 16px 16px;
  display: grid;
  gap: 14px;
}

.field-focus-panel .weather-panel,
.field-focus-panel .soil-panel,
.field-focus-panel .crop-panel,
.field-focus-panel .imagery-panel {
  border-radius: 0;
  border: none;
  background: transparent;
  padding: 0;
}

.field-focus-panel .weather-header,
.field-focus-panel .soil-header,
.field-focus-panel .crop-header,
.field-focus-panel .imagery-header {
  display: block;
}

.field-focus-panel .weather-badge,
.field-focus-panel .soil-badge,
.field-focus-panel .crop-badge,
.field-focus-panel .imagery-badge {
  display: none;
}

.field-focus-panel .weather-copy,
.field-focus-panel .soil-copy,
.field-focus-panel .crop-copy,
.field-focus-panel .imagery-copy,
.field-focus-panel .weather-overview-copy,
.field-focus-panel .soil-summary-copy,
.field-focus-panel .soil-horizon-copy,
.field-focus-panel .crop-composition-copy,
.field-focus-panel .crop-rotation-copy,
.field-focus-panel .imagery-summary-copy,
.field-focus-panel .imagery-scenes-copy {
  font-size: 0.88rem;
}

.field-focus-panel .weather-overview,
.field-focus-panel .soil-grid,
.field-focus-panel .crop-grid,
.field-focus-panel .imagery-grid {
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;
}

.field-focus-panel .weather-overview-card,
.field-focus-panel .weather-chart-card,
.field-focus-panel .soil-summary-card,
.field-focus-panel .soil-horizon-card,
.field-focus-panel .crop-composition-card,
.field-focus-panel .crop-rotation-card,
.field-focus-panel .imagery-summary-card,
.field-focus-panel .imagery-scenes-card {
  padding: 14px;
  border-radius: 16px;
}

.field-focus-panel .weather-overview-metrics,
.field-focus-panel .soil-summary-metrics,
.field-focus-panel .imagery-metrics,
.field-focus-panel .weather-grid {
  gap: 10px;
  margin-top: 12px;
}

.field-focus-panel .weather-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field-focus-panel .chart-frame {
  margin-top: 10px;
  padding: 8px;
}

.field-focus-panel .weather-chart-card .chart-value,
.field-focus-panel .soil-metric .value,
.field-focus-panel .imagery-metric .value,
.field-focus-panel .rotation-value {
  font-size: 0.98rem;
}

.card,
.signal-card,
.map-panel,
.teaser-card,
.metric-card {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
  min-height: 100%;
}

.label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5a7464;
}

.value {
  display: block;
  margin-top: 8px;
  font-size: clamp(1.18rem, 2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.detail {
  display: block;
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.93rem;
  line-height: 1.5;
}

.portfolio-card {
  border-radius: 20px;
  padding: 16px;
  color: #16311d;
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.portfolio-card.corn {
  background: linear-gradient(180deg, #fff3bf 0%, #ffe08a 100%);
}

.portfolio-card.soy {
  background: linear-gradient(180deg, #dff5d2 0%, #c8e8b1 100%);
}

.portfolio-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.82;
}

.portfolio-value {
  display: block;
  margin-top: 8px;
  font-size: clamp(1.6rem, 2.3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.portfolio-detail {
  display: block;
  margin-top: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(22, 49, 29, 0.82);
}

.section-kicker {
  margin: 0 0 8px;
  color: #537060;
  font-size: 0.84rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
}

.map-header,
.teaser-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.map-topbar {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.65fr);
  gap: 16px;
  align-items: start;
}

.map-meta-stack {
  display: grid;
  gap: 10px;
}

.map-copy {
  max-width: 64ch;
}

.map-support-strip {
  display: grid;
  gap: 10px;
  justify-items: stretch;
}

.map-badge,
.teaser-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.map-frame {
  margin-top: 12px;
  border-radius: 24px;
  padding: 10px;
  background: linear-gradient(180deg, #eef8eb 0%, #f8fbf7 100%);
  border: 1px solid rgba(23, 38, 27, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.map-svg {
  display: block;
  width: 100%;
  min-height: 520px;
  height: auto;
}

.field-node {
  cursor: pointer;
  outline: none;
}

.field-shape {
  stroke: rgba(24, 40, 29, 0.54);
  stroke-width: 2;
  transition: fill 140ms ease, stroke 140ms ease, transform 140ms ease, opacity 140ms ease;
}

.field-node:hover .field-shape,
.field-node.is-hovered .field-shape,
.field-node:focus .field-shape {
  stroke: #173d24;
  stroke-width: 3;
  filter: brightness(1.02);
}

.field-node.is-selected .field-shape {
  stroke: #173d24;
  stroke-width: 4;
  filter: drop-shadow(0 10px 14px rgba(39, 78, 53, 0.18));
}

.field-shape.tone-corn {
  fill: rgba(255, 224, 138, 0.9);
}

.field-shape.tone-soy {
  fill: rgba(200, 232, 177, 0.92);
}

.field-shape.tone-mixed {
  fill: rgba(201, 226, 189, 0.92);
}

.field-shape.tone-other {
  fill: rgba(209, 221, 216, 0.94);
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  fill: #17311f;
  text-anchor: middle;
  pointer-events: none;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4f695a;
  font-size: 0.88rem;
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(23, 38, 27, 0.16);
}

.legend-swatch.corn {
  background: #ffe08a;
}

.legend-swatch.soy {
  background: #c8e8b1;
}

.legend-swatch.other {
  background: #d1ddd8;
}

.teaser-copy {
  color: #476356;
}

.teaser-card {
  padding: 14px;
  border-radius: 18px;
  background: rgba(248, 251, 247, 0.92);
}

.teaser-card h2 {
  font-size: 0.98rem;
}

.teaser-card .teaser-copy {
  margin-top: 6px;
  font-size: 0.88rem;
  line-height: 1.5;
}

.teaser-metrics {
  margin-top: 12px;
  grid-template-columns: 1fr;
  gap: 10px;
}

.teaser-metrics .metric-card {
  min-height: 0;
  padding: 10px 12px;
  border-radius: 16px;
  background: #ffffff;
}

.teaser-metrics .metric-card .label {
  font-size: 0.72rem;
}

.teaser-metrics .metric-card .value {
  margin-top: 6px;
  font-size: 0.96rem;
  line-height: 1.4;
}

.map-status-strip {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.weather-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.weather-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.weather-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.weather-copy,
.weather-overview-copy,
.chart-subtitle {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.weather-overview {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  margin-top: 16px;
}

.weather-overview-card,
.weather-chart-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.weather-overview-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.weather-metric {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.weather-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 16px;
}

.soil-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.soil-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.soil-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.soil-copy,
.soil-summary-copy,
.soil-horizon-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.soil-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  margin-top: 16px;
}

.soil-summary-card,
.soil-horizon-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.soil-summary-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.soil-metric {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.soil-metric .value {
  font-size: 1.05rem;
}

.crop-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.crop-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.crop-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.crop-copy,
.crop-composition-copy,
.crop-rotation-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.crop-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  margin-top: 16px;
}

.crop-composition-card,
.crop-rotation-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.composition-list,
.rotation-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.composition-row,
.rotation-item {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.composition-topline,
.rotation-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.composition-name,
.rotation-name {
  font-weight: 700;
  color: #213a2a;
}

.composition-pct,
.rotation-value {
  color: #214d2f;
  font-weight: 700;
}

.composition-bar {
  margin-top: 10px;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e6efe4;
}

.composition-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #9aca86 0%, #4f8b5f 100%);
}

.composition-meta,
.rotation-detail {
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.88rem;
  line-height: 1.5;
}

.rotation-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.rotation-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.imagery-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.imagery-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.imagery-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.imagery-copy,
.imagery-summary-copy,
.imagery-scenes-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.imagery-grid {
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  margin-top: 16px;
}

.imagery-summary-card,
.imagery-scenes-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.imagery-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.imagery-metric {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.imagery-list,
.scene-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.imagery-source-row,
.scene-row {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.imagery-empty-state {
  border-radius: 20px;
  padding: 18px;
  background: linear-gradient(180deg, #f5f8f4 0%, #edf4ec 100%);
  border: 1px dashed rgba(49, 80, 60, 0.25);
}

.imagery-empty-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #213a2a;
}

.imagery-empty-copy {
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.92rem;
  line-height: 1.6;
}

.imagery-empty-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.imagery-empty-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.diagnostics-panel {
  border-radius: 22px;
  background: rgba(250, 252, 249, 0.92);
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.diagnostics-disclosure {
  border-radius: 18px;
  border: 1px dashed rgba(49, 80, 60, 0.2);
  background: linear-gradient(180deg, #f8fbf7 0%, #f2f7f1 100%);
  overflow: hidden;
}

.diagnostics-disclosure summary {
  list-style: none;
  cursor: pointer;
  padding: 18px 20px;
}

.diagnostics-disclosure summary::-webkit-details-marker {
  display: none;
}

.diagnostics-summary {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.diagnostics-summary-copy {
  margin: 8px 0 0;
  color: #4f695a;
  font-size: 0.94rem;
  line-height: 1.6;
}

.diagnostics-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.diagnostics-body {
  padding: 0 20px 20px;
  display: grid;
  gap: 18px;
}

.diagnostics-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
}

.lineage-card,
.diagnostic-list-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.lineage-copy,
.diagnostic-list-copy {
  margin: 8px 0 0;
  color: #4f695a;
  font-size: 0.92rem;
  line-height: 1.6;
}

.lineage-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.lineage-metric {
  border-radius: 14px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.diagnostic-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.diagnostic-item {
  border-radius: 14px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.diagnostic-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.diagnostic-code {
  font-weight: 700;
  color: #213a2a;
}

.diagnostic-severity {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.diagnostic-severity.info {
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
}

.diagnostic-severity.warning {
  background: rgba(180, 131, 35, 0.14);
  color: #7a5713;
}

.diagnostic-severity.error {
  background: rgba(179, 64, 64, 0.14);
  color: #8a2d2d;
}

.diagnostic-message {
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.9rem;
  line-height: 1.55;
}

.diagnostic-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.diagnostic-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.imagery-topline,
.scene-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.imagery-name,
.scene-name {
  font-weight: 700;
  color: #213a2a;
}

.imagery-value,
.scene-value {
  color: #214d2f;
  font-weight: 700;
}

.imagery-detail,
.scene-detail {
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.88rem;
  line-height: 1.5;
}

.scene-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.scene-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.horizon-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.horizon-row {
  display: grid;
  gap: 8px;
  border-radius: 16px;
  padding: 12px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.horizon-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.horizon-name {
  font-weight: 700;
  color: #213a2a;
}

.horizon-depth {
  color: #4f695a;
  font-size: 0.88rem;
}

.horizon-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.horizon-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.weather-chart-card {
  min-width: 0;
}

.chart-value {
  display: block;
  margin-top: 8px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.chart-frame {
  margin-top: 14px;
  border-radius: 16px;
  padding: 10px;
  background: linear-gradient(180deg, #eef7ec 0%, #f9fcf8 100%);
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.weather-chart {
  display: block;
  width: 100%;
  height: auto;
}

.chart-grid-line {
  stroke: rgba(23, 38, 27, 0.1);
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: #3d7a50;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  fill: rgba(112, 177, 112, 0.16);
}

.chart-dot {
  fill: #214d2f;
}

.metric-card {
  padding: 14px;
}

.metric-card .value {
  font-size: 1.15rem;
}

.runtime-status {
  margin-top: 0;
  padding: 10px 12px;
  border-radius: 14px;
  background: #18281d;
  color: #f7fbf6;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
  font-size: 0.76rem;
  line-height: 1.45;
}

@media (max-width: 980px) {
  .hero,
  .summary-grid,
  .signal-grid,
  .map-grid,
  .map-topbar,
  .map-stage-grid {
    grid-template-columns: 1fr;
  }

  .hero-topline {
    flex-direction: column;
  }

  .hero-meta {
    justify-items: start;
    text-align: left;
  }

  .summary-wrap,
  .signal-wrap,
  .map-wrap,
  .weather-wrap,
  .soil-wrap,
  .crop-wrap,
  .imagery-wrap,
  .diagnostics-wrap {
    padding: 0 20px 20px;
  }

  .overview-grid,
  .downstream-grid,
  .selection-stage {
    padding: 0 20px;
  }

  .hero {
    padding: 24px;
  }

  .overview-grid,
  .selection-shell,
  .selection-header,
  .field-focus-meta-grid,
  .field-plan-grid,
  .field-overview-grid,
  .field-evidence-grid,
  .weather-overview,
  .weather-grid,
  .soil-grid,
  .crop-grid,
  .imagery-grid,
  .diagnostics-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  main {
    padding: 16px 12px 40px;
  }

  .map-panel,
  .teaser-card {
    padding: 14px;
  }

  .map-svg {
    min-height: 360px;
  }

  .overview-grid,
  .downstream-grid,
  .selection-stage {
    padding: 0 12px;
  }

  .portfolio-grid,
  .teaser-metrics,
  .weather-overview-metrics,
  .soil-summary-metrics,
  .imagery-metrics,
  .field-focus-panel .weather-grid,
  .lineage-metrics {
    grid-template-columns: 1fr;
  }
}
`;

const INLINE_JS = `
(function () {
  "use strict";

  const payloadScript = document.getElementById(${JSON.stringify(
    GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  )});
  const body = document.body;
  const statusNode = document.getElementById("runtime-status");
  const mapRoot = document.getElementById("field-map-root");
  const selectedFieldFocus = document.getElementById("selected-field-focus");
  const resetSelectionButton = document.getElementById("selected-field-reset");
  const teaserName = document.getElementById("selected-field-name");
  const teaserAcreage = document.getElementById("selected-field-acreage");
  const teaserCounty = document.getElementById("selected-field-county");
  const teaserCrop = document.getElementById("selected-field-crop");
  const teaserWeather = document.getElementById("selected-field-weather");
  const teaserSoil = document.getElementById("selected-field-soil");
  const teaserSignal = document.getElementById("selected-field-signal");
  const selectedShowcaseField = document.getElementById("selected-showcase-field");
  const selectedShowcaseSummary = document.getElementById("selected-showcase-summary");
  const selectedShowcaseImagery = document.getElementById("selected-showcase-imagery");
  const selectedCornState = document.getElementById("selected-corn-state");
  const selectedCornWindow = document.getElementById("selected-corn-window");
  const selectedCornMeta = document.getElementById("selected-corn-meta");
  const selectedSoyState = document.getElementById("selected-soy-state");
  const selectedSoyWindow = document.getElementById("selected-soy-window");
  const selectedSoyMeta = document.getElementById("selected-soy-meta");
  const selectedLimitingFactor = document.getElementById("selected-limiting-factor");
  const selectedLimitingMeta = document.getElementById("selected-limiting-meta");
  const selectedPlanConfidence = document.getElementById("selected-plan-confidence");
  const weatherPanelField = document.getElementById("weather-selected-field");
  const weatherPanelSummary = document.getElementById("weather-selected-summary");
  const weatherLatestDate = document.getElementById("weather-latest-date");
  const weatherLatestTemp = document.getElementById("weather-latest-temp");
  const weatherLatestRain = document.getElementById("weather-latest-rain");
  const weatherLatestSolar = document.getElementById("weather-latest-solar");
  const weatherLatestHumidity = document.getElementById("weather-latest-humidity");
  const weatherLatestWind = document.getElementById("weather-latest-wind");
  const weatherCharts = {
    temperature: document.getElementById("weather-chart-temperature"),
    precipitation: document.getElementById("weather-chart-precipitation"),
    solar: document.getElementById("weather-chart-solar"),
    humidity: document.getElementById("weather-chart-humidity"),
    wind: document.getElementById("weather-chart-wind"),
  };
  const weatherValues = {
    temperature: document.getElementById("weather-value-temperature"),
    precipitation: document.getElementById("weather-value-precipitation"),
    solar: document.getElementById("weather-value-solar"),
    humidity: document.getElementById("weather-value-humidity"),
    wind: document.getElementById("weather-value-wind"),
  };
  const weatherSubtitles = {
    temperature: document.getElementById("weather-subtitle-temperature"),
    precipitation: document.getElementById("weather-subtitle-precipitation"),
    solar: document.getElementById("weather-subtitle-solar"),
    humidity: document.getElementById("weather-subtitle-humidity"),
    wind: document.getElementById("weather-subtitle-wind"),
  };
  const soilPanelField = document.getElementById("soil-selected-field");
  const soilPanelSummary = document.getElementById("soil-selected-summary");
  const soilDominant = document.getElementById("soil-dominant");
  const soilOm = document.getElementById("soil-om");
  const soilPh = document.getElementById("soil-ph");
  const soilAws = document.getElementById("soil-aws");
  const soilTexture = document.getElementById("soil-texture");
  const soilDrainage = document.getElementById("soil-drainage");
  const soilHorizonCount = document.getElementById("soil-horizon-count");
  const soilHorizonList = document.getElementById("soil-horizon-list");
  const cropPanelField = document.getElementById("crop-selected-field");
  const cropPanelSummary = document.getElementById("crop-selected-summary");
  const cropLatestYear = document.getElementById("crop-latest-year");
  const cropCompositionLead = document.getElementById("crop-composition-lead");
  const cropCompositionList = document.getElementById("crop-composition-list");
  const cropRotationNext = document.getElementById("crop-rotation-next");
  const cropRotationConfidence = document.getElementById("crop-rotation-confidence");
  const cropRotationSequence = document.getElementById("crop-rotation-sequence");
  const cropRotationHistory = document.getElementById("crop-rotation-history");
  const cropRotationPatterns = document.getElementById("crop-rotation-patterns");
  const cropRotationOutlook = document.getElementById("crop-rotation-outlook");
  const imageryPanelField = document.getElementById("imagery-selected-field");
  const imageryPanelSummary = document.getElementById("imagery-selected-summary");
  const imageryReadyCount = document.getElementById("imagery-ready-count");
  const imageryLatestScene = document.getElementById("imagery-latest-scene");
  const imagerySources = document.getElementById("imagery-sources");
  const imagerySceneList = document.getElementById("imagery-scene-list");

  if (
    !payloadScript ||
    !statusNode ||
    !mapRoot ||
    !selectedFieldFocus ||
    !resetSelectionButton ||
    !teaserName ||
    !teaserAcreage ||
    !teaserCounty ||
    !teaserCrop ||
    !teaserWeather ||
    !teaserSoil ||
    !teaserSignal ||
    !selectedShowcaseField ||
    !selectedShowcaseSummary ||
    !selectedShowcaseImagery ||
    !selectedCornState ||
    !selectedCornWindow ||
    !selectedCornMeta ||
    !selectedSoyState ||
    !selectedSoyWindow ||
    !selectedSoyMeta ||
    !selectedLimitingFactor ||
    !selectedLimitingMeta ||
    !selectedPlanConfidence ||
    !weatherPanelField ||
    !weatherPanelSummary ||
    !weatherLatestDate ||
    !weatherLatestTemp ||
    !weatherLatestRain ||
    !weatherLatestSolar ||
    !weatherLatestHumidity ||
    !weatherLatestWind ||
    !weatherCharts.temperature ||
    !weatherCharts.precipitation ||
    !weatherCharts.solar ||
    !weatherCharts.humidity ||
    !weatherCharts.wind ||
    !weatherValues.temperature ||
    !weatherValues.precipitation ||
    !weatherValues.solar ||
    !weatherValues.humidity ||
    !weatherValues.wind ||
    !weatherSubtitles.temperature ||
    !weatherSubtitles.precipitation ||
    !weatherSubtitles.solar ||
    !weatherSubtitles.humidity ||
    !weatherSubtitles.wind ||
    !soilPanelField ||
    !soilPanelSummary ||
    !soilDominant ||
    !soilOm ||
    !soilPh ||
    !soilAws ||
    !soilTexture ||
    !soilDrainage ||
    !soilHorizonCount ||
    !soilHorizonList ||
    !cropPanelField ||
    !cropPanelSummary ||
    !cropLatestYear ||
    !cropCompositionLead ||
    !cropCompositionList ||
    !cropRotationNext ||
    !cropRotationConfidence ||
    !cropRotationSequence ||
    !cropRotationHistory ||
    !cropRotationPatterns ||
    !cropRotationOutlook ||
    !imageryPanelField ||
    !imageryPanelSummary ||
    !imageryReadyCount ||
    !imageryLatestScene ||
    !imagerySources ||
    !imagerySceneList
  ) {
    throw new Error("Dashboard HTML shell is missing the embedded payload weather/map nodes.");
  }

  const payload = JSON.parse(payloadScript.textContent || "null");

  function latestCropYear() {
    let year = null;
    for (const entry of payload.cropComposition) {
      if (year === null || entry.year > year) {
        year = entry.year;
      }
    }
    return year;
  }

  function dominantCrop(fieldId) {
    const year = latestCropYear();
    if (year === null) {
      return "Not available";
    }

    let best = null;
    for (const entry of payload.cropComposition) {
      if (entry.fieldId !== fieldId || entry.year !== year) {
        continue;
      }
      if (!best || entry.pct > best.pct) {
        best = entry;
      }
    }

    return best ? best.cropName + " (" + Number(best.pct).toFixed(1) + "%)" : "Not available";
  }

  function latestWeather(fieldId) {
    let best = null;
    for (const entry of payload.weatherSeries) {
      if (entry.fieldId !== fieldId) {
        continue;
      }
      if (!best || entry.date > best.date) {
        best = entry;
      }
    }
    if (!best) {
      return "Weather hint unavailable";
    }
    const temp = best.temperatureAvgC == null ? "n/a" : Number(best.temperatureAvgC).toFixed(1) + "°C";
    const rain = best.precipitationMm == null ? "n/a" : Number(best.precipitationMm).toFixed(1) + " mm rain";
    return best.date + " • " + temp + " • " + rain;
  }

  function soilHint(fieldId) {
    for (const entry of payload.soilSummary) {
      if (entry.fieldId !== fieldId) {
        continue;
      }
      const soil = entry.dominantSoil || "soil type unavailable";
      const om = entry.avgOrganicMatterPct == null ? "OM n/a" : "OM " + Number(entry.avgOrganicMatterPct).toFixed(1) + "%";
      return soil + " • " + om;
    }
    return "Soil hint unavailable";
  }

  function fieldSignal(fieldId) {
    for (const entry of payload.cropRotation) {
      if (entry.fieldId === fieldId) {
        return entry.predictedNextCrop
          ? "Rotation outlook favors " + entry.predictedNextCrop + "."
          : entry.rotationOutlook;
      }
    }
    return "Rotation signal unavailable.";
  }

  function formatCompactStatusLabel(value) {
    if (!value) {
      return "Unknown";
    }

    return String(value)
      .split("_")
      .filter(Boolean)
      .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
      .join(" ");
  }

  function formatEarliestSafeBand(value) {
    switch (value) {
      case "now":
        return "Now";
      case "next_3_days":
        return "Next 3 days";
      case "next_7_days":
        return "Next 7 days";
      case "blocked":
        return "Blocked";
      default:
        return "Unknown";
    }
  }

  function formatNextWindow(value) {
    if (!value) {
      return "Monitor conditions";
    }

    return String(value)
      .split("_")
      .filter(Boolean)
      .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); })
      .join(" ");
  }

  function readinessTone(value) {
    switch (value) {
      case "ready_now":
        return "ready";
      case "ready_soon":
        return "soon";
      case "blocked":
      case "hold":
      case "not_ready":
        return "blocked";
      case "watch":
      case "monitor":
      case "monitor_conditions":
        return "watch";
      default:
        return "neutral";
    }
  }

  function cornPlanForField(fieldId) {
    return (payload.fieldCornPlans || []).find(function (entry) { return entry.fieldId === fieldId; }) || null;
  }

  function soybeanPlanForField(fieldId) {
    return (payload.fieldSoybeanPlans || []).find(function (entry) { return entry.fieldId === fieldId; }) || null;
  }

  function sharedReadinessForField(fieldId) {
    return (payload.fieldSharedReadiness || []).find(function (entry) { return entry.fieldId === fieldId; }) || null;
  }

  function cropActionSummary(state, earliestSafeBand, nextRecheckWindow) {
    return {
      stateLabel: formatCompactStatusLabel(state || "monitor"),
      windowLabel: formatEarliestSafeBand(earliestSafeBand),
      windowMeta: "Recheck " + formatNextWindow(nextRecheckWindow),
      tone: readinessTone(state || earliestSafeBand),
    };
  }

  function limitingFactorSummary(cornPlan, soybeanPlan, sharedReadiness) {
    const explicitLimiter =
      (cornPlan && (cornPlan.limitingFactor || cornPlan.limitingReason)) ||
      (soybeanPlan && (soybeanPlan.limitingFactor || soybeanPlan.limitingReason));
    if (explicitLimiter) {
      return {
        label: explicitLimiter,
        meta: "Directly surfaced from the embedded plan summary.",
      };
    }

    if (sharedReadiness) {
      const parts = [
        sharedReadiness.accessStatus ? formatCompactStatusLabel(sharedReadiness.accessStatus) + " access" : null,
        sharedReadiness.trafficabilityStatus ? formatCompactStatusLabel(sharedReadiness.trafficabilityStatus) + " trafficability" : null,
        sharedReadiness.drydownStatus ? formatCompactStatusLabel(sharedReadiness.drydownStatus) + " drydown" : null,
      ].filter(Boolean);

      if (parts.length > 0) {
        return {
          label: parts.slice(0, 2).join(" • "),
          meta: "Shared field-fit state " + formatCompactStatusLabel(sharedReadiness.sharedReadinessState || "monitor") + ".",
        };
      }
    }

    return {
      label: "No strong limiter surfaced",
      meta: "Use the focused evidence cards for the next check.",
    };
  }

  function planConfidence(fieldId, cornPlan, soybeanPlan) {
    const directConfidence =
      (cornPlan && (cornPlan.confidenceLabel || cornPlan.confidence)) ||
      (soybeanPlan && (soybeanPlan.confidenceLabel || soybeanPlan.confidence));
    if (directConfidence) {
      return formatCompactStatusLabel(directConfidence);
    }

    const rotation = cropRotationForField(fieldId);
    return formatCompactStatusLabel(rotation && rotation.rotationConfidence ? rotation.rotationConfidence : "standard");
  }

  function setStateTone(node, tone) {
    const tones = ["ready", "soon", "watch", "blocked", "neutral"];
    for (const toneName of tones) {
      node.classList.remove("tone-" + toneName);
    }
    node.classList.add("tone-" + tone);
  }

  function escapeHtmlText(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function latestCropYearValue() {
    let year = null;
    for (const entry of payload.cropComposition) {
      if (year === null || entry.year > year) {
        year = entry.year;
      }
    }
    return year;
  }

  function cropCompositionForField(fieldId) {
    const latestYear = latestCropYearValue();
    if (latestYear === null) {
      return { latestYear: null, rows: [] };
    }

    const rows = payload.cropComposition
      .filter(function (entry) {
        return entry.fieldId === fieldId && entry.year === latestYear;
      })
      .sort(function (left, right) {
        return right.pct - left.pct;
      });

    return { latestYear: latestYear, rows: rows };
  }

  function cropRotationForField(fieldId) {
    for (const entry of payload.cropRotation) {
      if (entry.fieldId === fieldId) {
        return entry;
      }
    }
    return null;
  }

  function compositionRowMarkup(entry) {
    return '<article class="composition-row"><div class="composition-topline"><span class="composition-name">' +
      escapeHtmlText(entry.cropName) +
      '</span><span class="composition-pct">' +
      Number(entry.pct).toFixed(1) +
      '%</span></div><div class="composition-bar"><div class="composition-fill" style="width:' +
      Math.max(0, Math.min(100, Number(entry.pct))) +
      '%"></div></div><div class="composition-meta">Crop code ' +
      escapeHtmlText(entry.cropCode || 'n/a') +
      ' • source ' +
      escapeHtmlText(entry.source) +
      '</div></article>';
  }

  function updateCropPanel(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    const composition = cropCompositionForField(fieldId);
    const rotation = cropRotationForField(fieldId);
    const dominant = composition.rows.length > 0 ? composition.rows[0] : null;

    cropPanelField.textContent = field.fieldName;
    cropPanelSummary.textContent = dominant
      ? 'Latest-year crop composition and normalized rotation outlook for the selected field, updated directly from the embedded payload.'
      : 'No normalized crop composition was found for this field.';
    cropLatestYear.textContent = composition.latestYear === null ? 'Not available' : String(composition.latestYear);
    cropCompositionLead.textContent = dominant
      ? dominant.cropName + ' leads at ' + Number(dominant.pct).toFixed(1) + '%'
      : 'No latest-year composition available';
    cropCompositionList.innerHTML = composition.rows.length > 0
      ? composition.rows.map(function (entry) { return compositionRowMarkup(entry); }).join('')
      : '<article class="composition-row"><div class="composition-topline"><span class="composition-name">No composition data</span><span class="composition-pct">—</span></div><div class="composition-meta">The embedded payload has no latest-year crop composition rows for this field.</div></article>';

    cropRotationNext.textContent = rotation && rotation.predictedNextCrop ? rotation.predictedNextCrop : 'Not available';
    cropRotationConfidence.textContent = rotation && rotation.rotationConfidence ? rotation.rotationConfidence : 'Not available';
    cropRotationSequence.textContent = rotation ? rotation.rotationSequence : 'No normalized rotation sequence available';
    cropRotationHistory.textContent = rotation
      ? String(rotation.historyStartYear || '—') + ' → ' + String(rotation.historyEndYear || '—') + ' • diversity ' + String(rotation.cropDiversity)
      : 'History unavailable';
    cropRotationPatterns.innerHTML = rotation && rotation.rotationPatterns.length > 0
      ? rotation.rotationPatterns.map(function (pattern) { return '<span class="rotation-pill">' + escapeHtmlText(pattern) + '</span>'; }).join('')
      : '<span class="rotation-pill">No rotation patterns available</span>';
    cropRotationOutlook.textContent = rotation ? rotation.rotationOutlook : 'Rotation outlook unavailable';
  }

  function imageryCoverageForField(fieldId) {
    return payload.imageryCoverage
      .filter(function (entry) {
        return entry.fieldId === fieldId && entry.sceneCount > 0;
      })
      .sort(function (left, right) {
        return String(left.source).localeCompare(String(right.source));
      });
  }

  function imageryScenesForField(fieldId) {
    return payload.imageryScenes
      .filter(function (entry) {
        return entry.fieldId === fieldId;
      })
      .sort(function (left, right) {
        return right.sceneDate.localeCompare(left.sceneDate);
      });
  }

  function imagerySourceRowMarkup(entry) {
    return '<article class="imagery-source-row"><div class="imagery-topline"><span class="imagery-name">' +
      escapeHtmlText(entry.source) +
      '</span><span class="imagery-value">' +
      String(entry.sceneCount) +
      ' scene(s)</span></div><div class="imagery-detail">Available ' +
      escapeHtmlText(entry.firstSceneDate || 'n/a') +
      ' → ' +
      escapeHtmlText(entry.lastSceneDate || 'n/a') +
      ' • expected ' +
      escapeHtmlText(entry.expectedSceneCount == null ? 'n/a' : String(entry.expectedSceneCount)) +
      ' • coverage ' +
      escapeHtmlText(entry.coveragePct == null ? 'n/a' : Number(entry.coveragePct).toFixed(1) + '%') +
      '</div></article>';
  }

  function imagerySceneRowMarkup(entry) {
    const pills = [
      entry.cloudPct == null ? null : 'Cloud ' + Number(entry.cloudPct).toFixed(1) + '%',
      'Assets ' + String(entry.assetCount),
      entry.source,
    ].filter(Boolean);
    return '<article class="scene-row"><div class="scene-topline"><span class="scene-name">' +
      escapeHtmlText(entry.sceneDate) +
      '</span><span class="scene-value">' +
      escapeHtmlText(entry.sceneId) +
      '</span></div><div class="scene-detail">' +
      escapeHtmlText(entry.notes && entry.notes.length > 0 ? entry.notes.join(' • ') : 'Normalized scene metadata available') +
      '</div><div class="scene-pills">' +
      pills.map(function (pill) { return '<span class="scene-pill">' + escapeHtmlText(pill) + '</span>'; }).join('') +
      '</div></article>';
  }

  function updateImageryPanel(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    const coverage = imageryCoverageForField(fieldId);
    const scenes = imageryScenesForField(fieldId).slice(0, 6);
    const latestScene = scenes.length > 0 ? scenes[0] : null;

    imageryPanelField.textContent = field.fieldName;
    imageryPanelSummary.textContent = coverage.length > 0
      ? 'Imagery-ready source availability and recent normalized scene cues for the selected field, all from the embedded payload.'
      : 'This selected field has no imagery-ready sources in the current embedded payload, so the panel switches to a deliberate empty-state summary.';
    imageryReadyCount.textContent = String(coverage.length);
    imageryLatestScene.textContent = latestScene
      ? latestScene.sceneDate + ' • ' + latestScene.source
      : 'Not available';
    imagerySources.innerHTML = coverage.length > 0
      ? coverage.map(function (entry) { return imagerySourceRowMarkup(entry); }).join('')
      : '<article class="imagery-empty-state"><span class="imagery-empty-title">No imagery-ready sources for this field</span><div class="imagery-empty-copy">The embedded payload does not include any imagery-ready source coverage rows with available scenes for the currently selected field.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Source count 0</span><span class="imagery-empty-pill">Embedded payload only</span><span class="imagery-empty-pill">Pick another field to compare</span></div></article>';
    imagerySceneList.innerHTML = scenes.length > 0
      ? scenes.map(function (entry) { return imagerySceneRowMarkup(entry); }).join('')
      : '<article class="imagery-empty-state"><span class="imagery-empty-title">No scene list available</span><div class="imagery-empty-copy">There are no normalized imagery scene rows with available scene metadata for the selected field in this offline dashboard payload.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Recent scenes unavailable</span><span class="imagery-empty-pill">No reload needed</span><span class="imagery-empty-pill">Selection-aware panel</span></div></article>';
  }

  function soilSummaryForField(fieldId) {
    for (const entry of payload.soilSummary) {
      if (entry.fieldId === fieldId) {
        return entry;
      }
    }
    return null;
  }

  function soilHorizonsForField(fieldId) {
    return payload.soilHorizons
      .filter(function (entry) {
        return entry.fieldId === fieldId;
      })
      .sort(function (left, right) {
        const leftTop = left.horizonTopCm === null || left.horizonTopCm === undefined ? 9999 : left.horizonTopCm;
        const rightTop = right.horizonTopCm === null || right.horizonTopCm === undefined ? 9999 : right.horizonTopCm;
        return leftTop - rightTop;
      });
  }

  function compactValue(value, suffix, fractionDigits) {
    if (value === null || value === undefined) {
      return "Not available";
    }
    return Number(value).toFixed(fractionDigits) + suffix;
  }

  function dominantTexture(horizon) {
    if (!horizon) {
      return "Texture unavailable";
    }
    const clay = horizon.clayPct;
    const sand = horizon.sandPct;
    const silt = horizon.siltPct;
    const parts = [];
    if (clay !== null && clay !== undefined) parts.push("Clay " + Number(clay).toFixed(0) + "%");
    if (silt !== null && silt !== undefined) parts.push("Silt " + Number(silt).toFixed(0) + "%");
    if (sand !== null && sand !== undefined) parts.push("Sand " + Number(sand).toFixed(0) + "%");
    return parts.length > 0 ? parts.join(" • ") : "Texture unavailable";
  }

  function renderHorizonRow(horizon) {
    const top = horizon.horizonTopCm === null || horizon.horizonTopCm === undefined ? "?" : Number(horizon.horizonTopCm).toFixed(0);
    const bottom = horizon.horizonBottomCm === null || horizon.horizonBottomCm === undefined ? "?" : Number(horizon.horizonBottomCm).toFixed(0);
    const pills = [
      horizon.componentPct !== null && horizon.componentPct !== undefined ? 'Component ' + Number(horizon.componentPct).toFixed(0) + '%' : null,
      horizon.ph !== null && horizon.ph !== undefined ? 'pH ' + Number(horizon.ph).toFixed(1) : null,
      horizon.organicMatterPct !== null && horizon.organicMatterPct !== undefined ? 'OM ' + Number(horizon.organicMatterPct).toFixed(1) + '%' : null,
      horizon.availableWaterCapacity !== null && horizon.availableWaterCapacity !== undefined ? 'AWC ' + Number(horizon.availableWaterCapacity).toFixed(2) : null,
      dominantTexture(horizon),
    ].filter(Boolean);

    return '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">' +
      (horizon.componentName || 'Unnamed component') +
      '</span><span class="horizon-depth">' +
      top +
      '–' +
      bottom +
      ' cm</span></div><div class="horizon-metrics">' +
      pills.map(function (pill) { return '<span class="horizon-pill">' + pill + '</span>'; }).join('') +
      '</div></article>';
  }

  function updateSoilPanel(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }
    const summary = soilSummaryForField(fieldId);
    const horizons = soilHorizonsForField(fieldId).slice(0, 5);
    const surfaceHorizon = horizons.length > 0 ? horizons[0] : null;

    soilPanelField.textContent = field.fieldName;
    soilPanelSummary.textContent = summary
      ? 'Decision-relevant soil metrics and compact horizon context for the selected field, updated from the embedded normalized soil payload.'
      : 'No normalized soil summary is available for this field.';
    soilDominant.textContent = summary && summary.dominantSoil ? summary.dominantSoil : 'Not available';
    soilOm.textContent = summary ? compactValue(summary.avgOrganicMatterPct, '%', 1) : 'Not available';
    soilPh.textContent = summary ? compactValue(summary.avgPh, '', 2) : 'Not available';
    soilAws.textContent = summary ? compactValue(summary.totalAwsInches, ' in', 2) : 'Not available';
    soilTexture.textContent = dominantTexture(surfaceHorizon);
    soilDrainage.textContent = summary && summary.drainageClass ? summary.drainageClass : 'Not available';
    soilHorizonCount.textContent = summary ? String(summary.horizonCount) : '0';
    soilHorizonList.innerHTML = horizons.length > 0
      ? horizons.map(function (horizon) { return renderHorizonRow(horizon); }).join('')
      : '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">No horizon detail</span><span class="horizon-depth">—</span></div><div class="horizon-metrics"><span class="horizon-pill">No normalized soil horizon rows are available.</span></div></article>';
  }

  function weatherSeries(fieldId) {
    return payload.weatherSeries
      .filter(function (entry) {
        return entry.fieldId === fieldId;
      })
      .sort(function (left, right) {
        return left.date.localeCompare(right.date);
      });
  }

  function latestWeatherEntry(fieldId) {
    const rows = weatherSeries(fieldId);
    return rows.length > 0 ? rows[rows.length - 1] : null;
  }

  function trailingRows(fieldId, count) {
    const rows = weatherSeries(fieldId);
    return rows.slice(Math.max(0, rows.length - count));
  }

  function formatMetricValue(value, unit, fractionDigits) {
    if (value === null || value === undefined) {
      return "Not available";
    }

    return Number(value).toFixed(fractionDigits) + " " + unit;
  }

  function chartMarkup(values) {
    const width = 220;
    const height = 92;
    const paddingX = 10;
    const paddingY = 10;
    const usable = values.filter(function (value) {
      return value !== null && value !== undefined;
    });

    if (usable.length === 0) {
      return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="No weather data available"><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><text x="110" y="50" text-anchor="middle" fill="#587061" font-size="11">No data</text></svg>';
    }

    let min = usable[0];
    let max = usable[0];
    for (const value of usable) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (min === max) {
      min -= 1;
      max += 1;
    }

    const points = [];
    for (let index = 0; index < values.length; index += 1) {
      const rawValue = values[index];
      if (rawValue === null || rawValue === undefined) {
        continue;
      }
      const x = paddingX + (index / Math.max(values.length - 1, 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((rawValue - min) / (max - min)) * (height - paddingY * 2);
      points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    }

    if (points.length === 0) {
      return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="No weather data available"><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><text x="110" y="50" text-anchor="middle" fill="#587061" font-size="11">No data</text></svg>';
    }

    const linePath = points
      .map(function (point, index) {
        return (index === 0 ? 'M ' : 'L ') + point.x + ' ' + point.y;
      })
      .join(' ');
    const areaPath =
      linePath +
      ' L ' +
      points[points.length - 1].x +
      ' ' +
      (height - paddingY) +
      ' L ' +
      points[0].x +
      ' ' +
      (height - paddingY) +
      ' Z';

    return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="Selected field weather trend"><line class="chart-grid-line" x1="10" y1="20" x2="210" y2="20"></line><line class="chart-grid-line" x1="10" y1="49" x2="210" y2="49"></line><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><path class="chart-area" d="' + areaPath + '"></path><path class="chart-line" d="' + linePath + '"></path><circle class="chart-dot" cx="' + points[points.length - 1].x + '" cy="' + points[points.length - 1].y + '" r="3.5"></circle></svg>';
  }

  function updateWeatherPanel(fieldId) {
    const rows = trailingRows(fieldId, 21);
    const latest = latestWeatherEntry(fieldId);
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    weatherPanelField.textContent = field.fieldName;
    weatherPanelSummary.textContent = rows.length > 0
      ? 'Latest ' + String(rows.length) + ' daily rows for ' + field.fieldName + ', updated from the embedded weather series without any external chart libraries.'
      : 'No embedded weather series are available for this field.';
    weatherLatestDate.textContent = latest ? latest.date : 'Not available';
    weatherLatestTemp.textContent = latest ? formatMetricValue(latest.temperatureAvgC, '°C', 1) : 'Not available';
    weatherLatestRain.textContent = latest ? formatMetricValue(latest.precipitationMm, 'mm', 1) : 'Not available';
    weatherLatestSolar.textContent = latest ? formatMetricValue(latest.solarRadiationKwhM2, 'kWh/m²', 1) : 'Not available';
    weatherLatestHumidity.textContent = latest ? formatMetricValue(latest.relativeHumidityPct, '%', 1) : 'Not available';
    weatherLatestWind.textContent = latest ? formatMetricValue(latest.windSpeedMps, 'm/s', 1) : 'Not available';

    const metrics = {
      temperature: {
        values: rows.map(function (row) { return row.temperatureAvgC; }),
        current: latest ? formatMetricValue(latest.temperatureAvgC, '°C', 1) : 'Not available',
        subtitle: rows.length > 0 ? rows[0].date + ' → ' + rows[rows.length - 1].date : 'No data range',
      },
      precipitation: {
        values: rows.map(function (row) { return row.precipitationMm; }),
        current: latest ? formatMetricValue(latest.precipitationMm, 'mm', 1) : 'Not available',
        subtitle: 'Daily precipitation trend',
      },
      solar: {
        values: rows.map(function (row) { return row.solarRadiationKwhM2; }),
        current: latest ? formatMetricValue(latest.solarRadiationKwhM2, 'kWh/m²', 1) : 'Not available',
        subtitle: 'Incoming solar radiation',
      },
      humidity: {
        values: rows.map(function (row) { return row.relativeHumidityPct; }),
        current: latest ? formatMetricValue(latest.relativeHumidityPct, '%', 1) : 'Not available',
        subtitle: 'Relative humidity trend',
      },
      wind: {
        values: rows.map(function (row) { return row.windSpeedMps; }),
        current: latest ? formatMetricValue(latest.windSpeedMps, 'm/s', 1) : 'Not available',
        subtitle: '10m wind speed trend',
      },
    };

    for (const key of Object.keys(metrics)) {
      weatherValues[key].textContent = metrics[key].current;
      weatherSubtitles[key].textContent = metrics[key].subtitle;
      weatherCharts[key].innerHTML = chartMarkup(metrics[key].values);
    }
  }

  const byFieldId = new Map();
  for (const field of payload.fields) {
    byFieldId.set(field.fieldId, field);
  }

  const initialFieldId = mapRoot.getAttribute("data-initial-field-id") || (payload.fields[0] && payload.fields[0].fieldId);
  let selectedFieldId = initialFieldId;

  function syncSelectionChrome(fieldId) {
    const nodes = mapRoot.querySelectorAll("[data-field-id]");
    for (const node of nodes) {
      const isSelected = fieldId !== null && node.getAttribute("data-field-id") === fieldId;
      node.classList.toggle("is-selected", isSelected);
      node.setAttribute("aria-pressed", isSelected ? "true" : "false");
    }

    const selectionRows = document.querySelectorAll(".selection-table-row");
    for (const row of selectionRows) {
      const isSelected = fieldId !== null && row.getAttribute("data-selection-field-id") === fieldId;
      row.setAttribute("data-selected", isSelected ? "true" : "false");
    }

    const selectionButtons = document.querySelectorAll(".field-table-button");
    for (const button of selectionButtons) {
      const buttonFieldId = button.getAttribute("data-selection-field-id");
      const isSelected = fieldId !== null && buttonFieldId === fieldId;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
      if (isSelected && buttonFieldId) {
        button.setAttribute("data-field-id", buttonFieldId);
      } else {
        button.removeAttribute("data-field-id");
      }
    }
  }

  function applyOverviewDetails() {
    selectedFieldFocus.setAttribute("data-detail-state", "overview");

    teaserName.textContent = "Farm overview";
    teaserAcreage.textContent = "Select a field";
    teaserCounty.textContent = "Map and table stay available";
    teaserCrop.textContent = "Pick a field for crop context";
    teaserWeather.textContent = "Pick a field for the latest weather cue";
    teaserSoil.textContent = "Pick a field for the latest soil cue";
    teaserSignal.textContent = "Pick a field for the rotation cue";
    selectedShowcaseField.textContent = "Farm overview";
    selectedShowcaseSummary.textContent = "Use the map or action table to reopen one focused field panel.";
    selectedShowcaseImagery.textContent = "Select a field to compare imagery readiness";
    selectedCornState.textContent = "Select field";
    setStateTone(selectedCornState, "neutral");
    selectedCornWindow.textContent = "—";
    selectedCornMeta.textContent = "Corn plan summary appears here after a field click.";
    selectedSoyState.textContent = "Select field";
    setStateTone(selectedSoyState, "neutral");
    selectedSoyWindow.textContent = "—";
    selectedSoyMeta.textContent = "Soy plan summary appears here after a field click.";
    selectedLimitingFactor.textContent = "Farm overview active";
    selectedLimitingMeta.textContent = "Choose any field to restore its limiting factor and supporting evidence.";
    selectedPlanConfidence.textContent = "Overview";

    weatherPanelField.textContent = "Farm overview";
    weatherPanelSummary.textContent = "Select a field to reload weather evidence.";
    weatherLatestDate.textContent = "—";
    weatherLatestTemp.textContent = "—";
    weatherLatestRain.textContent = "—";
    weatherLatestSolar.textContent = "—";
    weatherLatestHumidity.textContent = "—";
    weatherLatestWind.textContent = "—";
    for (const key of Object.keys(weatherCharts)) {
      weatherValues[key].textContent = "—";
      weatherSubtitles[key].textContent = "Awaiting field selection";
      weatherCharts[key].innerHTML = chartMarkup([]);
    }

    soilPanelField.textContent = "Farm overview";
    soilPanelSummary.textContent = "Select a field to reload soil evidence.";
    soilDominant.textContent = "—";
    soilOm.textContent = "—";
    soilPh.textContent = "—";
    soilAws.textContent = "—";
    soilTexture.textContent = "—";
    soilDrainage.textContent = "—";
    soilHorizonCount.textContent = "0";
    soilHorizonList.innerHTML = '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">No horizon detail</span><span class="horizon-depth">—</span></div><div class="horizon-metrics"><span class="horizon-pill">Select a field to reload normalized soil horizon rows.</span></div></article>';

    cropPanelField.textContent = "Farm overview";
    cropPanelSummary.textContent = "Select a field to reload crop and rotation evidence.";
    cropLatestYear.textContent = "—";
    cropCompositionLead.textContent = "Select a field to restore the latest composition snapshot.";
    cropCompositionList.innerHTML = '<article class="composition-row"><div class="composition-topline"><span class="composition-name">No composition data</span><span class="composition-pct">—</span></div><div class="composition-meta">Select a field to reload latest-year crop composition rows.</div></article>';
    cropRotationNext.textContent = "—";
    cropRotationConfidence.textContent = "Confidence: —";
    cropRotationSequence.textContent = "Select a field to reload the normalized rotation sequence.";
    cropRotationHistory.textContent = "History unavailable";
    cropRotationPatterns.innerHTML = '<span class="rotation-pill">Select a field to reload observed patterns</span>';
    cropRotationOutlook.textContent = "Select a field to reload the rotation outlook.";

    imageryPanelField.textContent = "Farm overview";
    imageryPanelSummary.textContent = "Select a field to reload imagery evidence.";
    imageryReadyCount.textContent = "0";
    imageryLatestScene.textContent = "—";
    imagerySources.innerHTML = '<article class="imagery-empty-state"><span class="imagery-empty-title">No imagery-ready sources in overview</span><div class="imagery-empty-copy">Select a field to restore source coverage rows and imagery readiness details.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Overview mode</span><span class="imagery-empty-pill">Source count 0</span><span class="imagery-empty-pill">Selection required</span></div></article>';
    imagerySceneList.innerHTML = '<article class="imagery-empty-state"><span class="imagery-empty-title">No scene list in overview</span><div class="imagery-empty-copy">Select a field to reload the recent normalized imagery scene list.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Overview mode</span><span class="imagery-empty-pill">Recent scenes hidden</span><span class="imagery-empty-pill">Selection required</span></div></article>';

    statusNode.textContent = [
      "Offline showcase dashboard loaded successfully.",
      "Farm: " + payload.farm.farmName,
      "Selected field: none",
      "Rendered boundaries: " + String(payload.fields.length),
      "Interactive schematic: inline SVG only",
      "Focused panel reset to farm overview",
    ].join("\\n");
  }

  function applySelectedFieldDetails(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    selectedFieldFocus.setAttribute("data-detail-state", "selected");
    teaserName.textContent = field.fieldName;
    teaserAcreage.textContent = Number(field.areaAcres).toFixed(2) + " acres";
    teaserCounty.textContent = field.countyName || "County unavailable";
    teaserCrop.textContent = dominantCrop(fieldId);
    teaserWeather.textContent = latestWeather(fieldId);
    teaserSoil.textContent = soilHint(fieldId);
    teaserSignal.textContent = fieldSignal(fieldId);
    selectedShowcaseField.textContent = field.fieldName;
    selectedShowcaseSummary.textContent =
      (field.countyName || "County unavailable") +
      ' • ' +
      Number(field.areaAcres).toFixed(2) +
      ' acres • ' +
      field.fieldId;
    selectedShowcaseImagery.textContent = String(imageryCoverageForField(fieldId).length) + ' ready source(s)';
    const cornPlan = cornPlanForField(fieldId);
    const soybeanPlan = soybeanPlanForField(fieldId);
    const sharedReadiness = sharedReadinessForField(fieldId);
    const cornAction = cropActionSummary(
      cornPlan && cornPlan.cornReadinessState,
      cornPlan && cornPlan.earliestSafeBand,
      cornPlan && cornPlan.nextRecheckWindow,
    );
    const soyAction = cropActionSummary(
      soybeanPlan && soybeanPlan.soybeanReadinessState,
      soybeanPlan && soybeanPlan.earliestSafeBand,
      soybeanPlan && soybeanPlan.nextRecheckWindow,
    );
    const limiter = limitingFactorSummary(cornPlan, soybeanPlan, sharedReadiness);
    selectedCornState.textContent = cornAction.stateLabel;
    setStateTone(selectedCornState, cornAction.tone);
    selectedCornWindow.textContent = cornAction.windowLabel;
    selectedCornMeta.textContent = cornAction.windowMeta;
    selectedSoyState.textContent = soyAction.stateLabel;
    setStateTone(selectedSoyState, soyAction.tone);
    selectedSoyWindow.textContent = soyAction.windowLabel;
    selectedSoyMeta.textContent = soyAction.windowMeta;
    selectedLimitingFactor.textContent = limiter.label;
    selectedLimitingMeta.textContent = limiter.meta;
    selectedPlanConfidence.textContent = planConfidence(fieldId, cornPlan, soybeanPlan);
    updateWeatherPanel(fieldId);
    updateSoilPanel(fieldId);
    updateCropPanel(fieldId);
    updateImageryPanel(fieldId);

    statusNode.textContent = [
      "Offline showcase dashboard loaded successfully.",
      "Farm: " + payload.farm.farmName,
      "Selected field: " + field.fieldId,
      "Rendered boundaries: " + String(payload.fields.length),
      "Interactive schematic: inline SVG only",
      "Focused panel and action table stay in sync with the selected field",
    ].join("\\n");
  }

  function setSelectedField(fieldId) {
    const normalizedFieldId = fieldId && byFieldId.has(fieldId) ? fieldId : null;
    selectedFieldId = normalizedFieldId || "";
    body.dataset.selectedFieldId = normalizedFieldId || "";
    syncSelectionChrome(normalizedFieldId);

    if (normalizedFieldId) {
      applySelectedFieldDetails(normalizedFieldId);
      return;
    }

    applyOverviewDetails();
  }

  const nodes = mapRoot.querySelectorAll("[data-field-id]");
  for (const node of nodes) {
    node.addEventListener("click", function () {
      setSelectedField(node.getAttribute("data-field-id"));
    });
    node.addEventListener("mouseenter", function () {
      node.classList.add("is-hovered");
    });
    node.addEventListener("mouseleave", function () {
      node.classList.remove("is-hovered");
    });
    node.addEventListener("focus", function () {
      node.classList.add("is-hovered");
    });
    node.addEventListener("blur", function () {
      node.classList.remove("is-hovered");
    });
    node.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedField(node.getAttribute("data-field-id"));
      }
    });
  }

  const selectionRows = document.querySelectorAll(".selection-table-row");
  for (const row of selectionRows) {
    row.addEventListener("click", function () {
      setSelectedField(row.getAttribute("data-selection-field-id"));
    });
    row.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedField(row.getAttribute("data-selection-field-id"));
      }
    });
  }

  const selectionButtons = document.querySelectorAll(".field-table-button");
  for (const button of selectionButtons) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      setSelectedField(button.getAttribute("data-selection-field-id"));
    });
  }

  resetSelectionButton.addEventListener("click", function () {
    setSelectedField(null);
  });

  if (selectedFieldId) {
    setSelectedField(selectedFieldId);
  }
})();
`;

type FieldCropTone = "corn" | "soy" | "mixed" | "other";

interface DashboardReadinessPlanEntry {
  fieldId: string;
  earliestSafeBand?: string | null;
  nextRecheckWindow?: string | null;
  cornReadinessState?: string | null;
  soybeanReadinessState?: string | null;
  limitingFactor?: string | null;
  limitingReason?: string | null;
  confidenceLabel?: string | null;
  confidence?: string | null;
}

interface DashboardSharedReadinessEntry {
  fieldId: string;
  sharedReadinessState?: string | null;
  trafficabilityStatus?: string | null;
  accessStatus?: string | null;
  drydownStatus?: string | null;
}

type DashboardPayloadWithReadiness = NormalizedGrowerDashboardPayload & {
  fieldCornPlans?: DashboardReadinessPlanEntry[];
  fieldSoybeanPlans?: DashboardReadinessPlanEntry[];
  fieldSharedReadiness?: DashboardSharedReadinessEntry[];
};

interface ActionTableRowView {
  field: NormalizedGrowerDashboardField;
  priorityRank: number;
  priorityLabel: string;
  cornStateLabel: string;
  cornWindowLabel: string;
  cornWindowMeta: string;
  cornTone: string;
  soyStateLabel: string;
  soyWindowLabel: string;
  soyWindowMeta: string;
  soyTone: string;
  limitingFactorLabel: string;
  limitingFactorMeta: string;
  confidenceLabel: string;
}

interface MapFeatureRender {
  field: NormalizedGrowerDashboardField;
  pathData: string;
  labelX: number;
  labelY: number;
  shortLabel: string;
  tone: FieldCropTone;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeEmbeddedPayload(payload: NormalizedGrowerDashboardPayload): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/<\/script/giu, "<\\/script");
}

function formatNumber(value: number, maximumFractionDigits: number = 0): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function formatSignedNumber(
  value: number | null,
  unit: string,
  fractionDigits: number = 1,
): string {
  if (value == null) {
    return "Not available";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)} ${unit}`;
}

function countImageryReadyFields(payload: NormalizedGrowerDashboardPayload): number {
  return new Set(
    payload.imageryCoverage.filter((entry) => entry.sceneCount > 0).map((entry) => entry.fieldId),
  ).size;
}

function dominantSummaryValue(values: Array<string | null | undefined>, fallback: string): string {
  const usable = values
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));
  if (usable.length === 0) {
    return fallback;
  }

  const counts = new Map<string, number>();
  for (const value of usable) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return (
    [...counts.entries()].toSorted(
      (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
    )[0]?.[0] ?? fallback
  );
}

function formatEarliestSafeBandLabel(value: string | null | undefined): string {
  switch (value) {
    case "now":
      return "Now";
    case "next_3_days":
      return "Next 3 days";
    case "next_7_days":
      return "Next 7 days";
    case "blocked":
      return "Blocked";
    default:
      return "Unknown";
  }
}

function earliestSafeBandPriority(value: string | null | undefined): number {
  switch (value) {
    case "now":
      return 0;
    case "next_3_days":
      return 1;
    case "next_7_days":
      return 2;
    case "blocked":
      return 3;
    default:
      return 4;
  }
}

function formatNextWindowLabel(value: string | null | undefined): string {
  if (!value) {
    return "Monitor conditions";
  }

  return value
    .split("_")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCompactStatusLabel(value: string | null | undefined): string {
  if (!value) {
    return "Unknown";
  }

  return value
    .split("_")
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function readinessStatePriority(value: string | null | undefined): number {
  switch (value) {
    case "ready_now":
      return 0;
    case "ready_soon":
      return 1;
    case "watch":
    case "monitor":
    case "monitor_conditions":
      return 2;
    case "blocked":
    case "hold":
    case "not_ready":
      return 3;
    default:
      return 2;
  }
}

function readinessTone(
  value: string | null | undefined,
): "ready" | "soon" | "watch" | "blocked" | "neutral" {
  switch (value) {
    case "ready_now":
      return "ready";
    case "ready_soon":
      return "soon";
    case "blocked":
    case "hold":
    case "not_ready":
      return "blocked";
    case "watch":
    case "monitor":
    case "monitor_conditions":
      return "watch";
    default:
      return "neutral";
  }
}

function actionPriorityLabel(rank: number): string {
  switch (rank) {
    case 0:
      return "First pass";
    case 1:
      return "Next pass";
    case 2:
      return "Stage soon";
    case 3:
      return "Hold";
    default:
      return "Review";
  }
}

function readinessPayload(
  payload: NormalizedGrowerDashboardPayload,
): DashboardPayloadWithReadiness {
  return payload as DashboardPayloadWithReadiness;
}

function cornPlanForField(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): DashboardReadinessPlanEntry | null {
  return (
    readinessPayload(payload).fieldCornPlans?.find((entry) => entry.fieldId === fieldId) ?? null
  );
}

function soybeanPlanForField(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): DashboardReadinessPlanEntry | null {
  return (
    readinessPayload(payload).fieldSoybeanPlans?.find((entry) => entry.fieldId === fieldId) ?? null
  );
}

function sharedReadinessForField(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): DashboardSharedReadinessEntry | null {
  return (
    readinessPayload(payload).fieldSharedReadiness?.find((entry) => entry.fieldId === fieldId) ??
    null
  );
}

function planConfidenceLabel(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
  cornPlan: DashboardReadinessPlanEntry | null,
  soybeanPlan: DashboardReadinessPlanEntry | null,
): string {
  const directConfidence =
    cornPlan?.confidenceLabel ??
    cornPlan?.confidence ??
    soybeanPlan?.confidenceLabel ??
    soybeanPlan?.confidence;
  if (directConfidence) {
    return formatCompactStatusLabel(directConfidence);
  }

  return formatCompactStatusLabel(
    cropRotationForFieldPayload(payload, fieldId)?.rotationConfidence ?? "standard",
  );
}

function limitingFactorSummary(
  cornPlan: DashboardReadinessPlanEntry | null,
  soybeanPlan: DashboardReadinessPlanEntry | null,
  sharedReadiness: DashboardSharedReadinessEntry | null,
): { label: string; meta: string } {
  const explicitLimiter =
    cornPlan?.limitingFactor ??
    cornPlan?.limitingReason ??
    soybeanPlan?.limitingFactor ??
    soybeanPlan?.limitingReason;
  if (explicitLimiter) {
    return {
      label: explicitLimiter,
      meta: "Directly surfaced from the embedded plan summary.",
    };
  }

  if (sharedReadiness) {
    const access = sharedReadiness.accessStatus
      ? `${formatCompactStatusLabel(sharedReadiness.accessStatus)} access`
      : null;
    const trafficability = sharedReadiness.trafficabilityStatus
      ? `${formatCompactStatusLabel(sharedReadiness.trafficabilityStatus)} trafficability`
      : null;
    const drydown = sharedReadiness.drydownStatus
      ? `${formatCompactStatusLabel(sharedReadiness.drydownStatus)} drydown`
      : null;
    const summaryParts = [access, trafficability, drydown].filter((value): value is string =>
      Boolean(value),
    );

    if (summaryParts.length > 0) {
      return {
        label: summaryParts.slice(0, 2).join(" • "),
        meta: `Shared field-fit state ${formatCompactStatusLabel(sharedReadiness.sharedReadinessState ?? "monitor")}.`,
      };
    }
  }

  return {
    label: "No strong limiter surfaced",
    meta: "Use the row windows and the selected-field detail panels for the next check.",
  };
}

function cropActionCell(
  state: string | null | undefined,
  earliestSafeBand: string | null | undefined,
  nextRecheckWindow: string | null | undefined,
): { stateLabel: string; windowLabel: string; windowMeta: string; tone: string } {
  return {
    stateLabel: formatCompactStatusLabel(state ?? "monitor"),
    windowLabel: formatEarliestSafeBandLabel(earliestSafeBand),
    windowMeta: `Recheck ${formatNextWindowLabel(nextRecheckWindow)}`,
    tone: readinessTone(state ?? earliestSafeBand),
  };
}

function actionPriorityRank(
  cornPlan: DashboardReadinessPlanEntry | null,
  soybeanPlan: DashboardReadinessPlanEntry | null,
  sharedReadiness: DashboardSharedReadinessEntry | null,
): number {
  const cropRank = Math.min(
    earliestSafeBandPriority(cornPlan?.earliestSafeBand),
    earliestSafeBandPriority(soybeanPlan?.earliestSafeBand),
  );
  const normalizedCropRank = Number.isFinite(cropRank) ? cropRank : 4;
  const fieldFitRank = readinessStatePriority(sharedReadiness?.sharedReadinessState);
  return Math.max(normalizedCropRank, fieldFitRank);
}

function buildActionTableRows(payload: NormalizedGrowerDashboardPayload): ActionTableRowView[] {
  return payload.fields
    .map((field) => {
      const cornPlan = cornPlanForField(payload, field.fieldId);
      const soybeanPlan = soybeanPlanForField(payload, field.fieldId);
      const sharedReadiness = sharedReadinessForField(payload, field.fieldId);
      const cornAction = cropActionCell(
        cornPlan?.cornReadinessState,
        cornPlan?.earliestSafeBand,
        cornPlan?.nextRecheckWindow,
      );
      const soyAction = cropActionCell(
        soybeanPlan?.soybeanReadinessState,
        soybeanPlan?.earliestSafeBand,
        soybeanPlan?.nextRecheckWindow,
      );
      const limiting = limitingFactorSummary(cornPlan, soybeanPlan, sharedReadiness);
      const priorityRank = actionPriorityRank(cornPlan, soybeanPlan, sharedReadiness);

      return {
        field,
        priorityRank,
        priorityLabel: actionPriorityLabel(priorityRank),
        cornStateLabel: cornAction.stateLabel,
        cornWindowLabel: cornAction.windowLabel,
        cornWindowMeta: cornAction.windowMeta,
        cornTone: cornAction.tone,
        soyStateLabel: soyAction.stateLabel,
        soyWindowLabel: soyAction.windowLabel,
        soyWindowMeta: soyAction.windowMeta,
        soyTone: soyAction.tone,
        limitingFactorLabel: limiting.label,
        limitingFactorMeta: limiting.meta,
        confidenceLabel: planConfidenceLabel(payload, field.fieldId, cornPlan, soybeanPlan),
      };
    })
    .toSorted(
      (left, right) =>
        left.priorityRank - right.priorityRank ||
        left.field.fieldName.localeCompare(right.field.fieldName),
    );
}

function renderActionTableRows(
  payload: NormalizedGrowerDashboardPayload,
  initialFieldId: string,
): string {
  return buildActionTableRows(payload)
    .map((row) => {
      const isSelected = row.field.fieldId === initialFieldId;
      return `<tr class="selection-table-row" data-selection-field-id="${escapeHtml(row.field.fieldId)}" data-selected="${isSelected ? "true" : "false"}" tabindex="0"><td class="action-field-cell"><div class="action-field-stack"><button type="button" class="field-table-button${isSelected ? " is-selected" : ""}" data-selection-field-id="${escapeHtml(row.field.fieldId)}"${isSelected ? ` data-field-id="${escapeHtml(row.field.fieldId)}"` : ""} aria-pressed="${isSelected ? "true" : "false"}"><span class="action-field-name">${escapeHtml(row.field.fieldName)}</span><span class="action-field-meta">${escapeHtml(`${formatNumber(row.field.areaAcres, 2)} acres • ${row.field.fieldId}`)}</span></button><span class="action-priority-badge priority-${escapeHtml(String(row.priorityRank))}">${escapeHtml(row.priorityLabel)}</span></div></td><td><div class="action-window-cell"><span class="action-state-pill tone-${escapeHtml(row.cornTone)}">${escapeHtml(row.cornStateLabel)}</span><span class="action-window-value">${escapeHtml(row.cornWindowLabel)}</span><span class="action-window-meta">${escapeHtml(row.cornWindowMeta)}</span></div></td><td><div class="action-window-cell"><span class="action-state-pill tone-${escapeHtml(row.soyTone)}">${escapeHtml(row.soyStateLabel)}</span><span class="action-window-value">${escapeHtml(row.soyWindowLabel)}</span><span class="action-window-meta">${escapeHtml(row.soyWindowMeta)}</span></div></td><td><div class="action-limiter-cell"><span class="action-limiter-value">${escapeHtml(row.limitingFactorLabel)}</span><span class="action-window-meta">${escapeHtml(row.limitingFactorMeta)}</span></div></td><td class="action-confidence-cell"><span class="action-confidence-badge">${escapeHtml(row.confidenceLabel)}</span></td></tr>`;
    })
    .join("");
}

function summarizePlanKpi<PlanEntry>(
  plans: PlanEntry[] | undefined,
  getState: (plan: PlanEntry) => string | null | undefined,
  getEarliestBand: (plan: PlanEntry) => string | null | undefined,
  getNextWindow: (plan: PlanEntry) => string | null | undefined,
): {
  readySoonCount: number;
  earliestBandLabel: string;
  nextWindowLabel: string;
} {
  let readySoonCount = 0;
  let bestBand: string | null = null;
  let bestPriority = Number.POSITIVE_INFINITY;
  const nextWindows: string[] = [];

  for (const plan of plans ?? []) {
    const state = getState(plan);
    if (state === "ready_now" || state === "ready_soon") {
      readySoonCount += 1;
    }

    const band = getEarliestBand(plan);
    const priority = earliestSafeBandPriority(band);
    if (priority < bestPriority) {
      bestPriority = priority;
      bestBand = band ?? null;
    }

    const nextWindow = getNextWindow(plan);
    if (nextWindow) {
      nextWindows.push(nextWindow);
    }
  }

  return {
    readySoonCount,
    earliestBandLabel: formatEarliestSafeBandLabel(bestBand),
    nextWindowLabel: formatNextWindowLabel(dominantSummaryValue(nextWindows, "Monitor conditions")),
  };
}

function summarizeFieldFitKpi(payload: NormalizedGrowerDashboardPayload): {
  readySoonCount: number;
  trafficability: string;
  access: string;
  drydown: string;
} {
  const rows = readinessPayload(payload).fieldSharedReadiness ?? [];
  return {
    readySoonCount: rows.filter(
      (entry) =>
        entry.sharedReadinessState === "ready_now" || entry.sharedReadinessState === "ready_soon",
    ).length,
    trafficability: dominantSummaryValue(
      rows.map((entry) => entry.trafficabilityStatus),
      "Unknown",
    ),
    access: dominantSummaryValue(
      rows.map((entry) => entry.accessStatus),
      "Unknown",
    ),
    drydown: dominantSummaryValue(
      rows.map((entry) => entry.drydownStatus),
      "Unknown",
    ),
  };
}

function latestCropYear(payload: NormalizedGrowerDashboardPayload): number | null {
  return payload.cropComposition.reduce<number | null>(
    (maxYear, entry) => (maxYear == null || entry.year > maxYear ? entry.year : maxYear),
    null,
  );
}

function dominantCropForField(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): { name: string; pct: number } | null {
  const year = latestCropYear(payload);
  if (year == null) {
    return null;
  }

  let best: { name: string; pct: number } | null = null;
  for (const entry of payload.cropComposition) {
    if (entry.fieldId !== fieldId || entry.year !== year) {
      continue;
    }
    if (!best || entry.pct > best.pct) {
      best = { name: entry.cropName, pct: entry.pct };
    }
  }
  return best;
}

function toneForField(payload: NormalizedGrowerDashboardPayload, fieldId: string): FieldCropTone {
  const dominantCrop = dominantCropForField(payload, fieldId);
  if (!dominantCrop) {
    return "other";
  }

  const cropName = dominantCrop.name.trim().toLowerCase();
  if (cropName === "corn") {
    return "corn";
  }
  if (cropName === "soybeans" || cropName === "soybean") {
    return "soy";
  }

  const year = latestCropYear(payload);
  if (year == null) {
    return "other";
  }

  let corn = 0;
  let soy = 0;
  for (const entry of payload.cropComposition) {
    if (entry.fieldId !== fieldId || entry.year !== year) {
      continue;
    }
    const name = entry.cropName.trim().toLowerCase();
    if (name === "corn") {
      corn += entry.pct;
    }
    if (name === "soybeans" || name === "soybean") {
      soy += entry.pct;
    }
  }

  if (corn > 0 && soy > 0) {
    return "mixed";
  }
  return "other";
}

function flattenRings(geometry: DashboardPolygonGeometry): number[][][] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates as number[][][];
  }

  const polygons = geometry.coordinates as number[][][][];
  const rings: number[][][] = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      rings.push(ring);
    }
  }
  return rings;
}

function buildMapFeatures(payload: NormalizedGrowerDashboardPayload): MapFeatureRender[] {
  const width = 760;
  const height = 430;
  const margin = 24;
  const west = Math.min(...payload.fields.map((field) => field.boundary.bbox[0]));
  const south = Math.min(...payload.fields.map((field) => field.boundary.bbox[1]));
  const east = Math.max(...payload.fields.map((field) => field.boundary.bbox[2]));
  const north = Math.max(...payload.fields.map((field) => field.boundary.bbox[3]));
  const lonSpan = Math.max(east - west, 0.000001);
  const latSpan = Math.max(north - south, 0.000001);
  const scale = Math.min((width - margin * 2) / lonSpan, (height - margin * 2) / latSpan);

  const project = (lon: number, lat: number): [number, number] => {
    const x = margin + (lon - west) * scale;
    const y = height - margin - (lat - south) * scale;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  };

  return payload.fields.map((field, index) => {
    const rings = flattenRings(field.boundary.geometry);
    const pathData = rings
      .map((ring) => {
        return (
          ring
            .map(([lon, lat], pointIndex) => {
              const [x, y] = project(lon, lat);
              return `${pointIndex === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ") + " Z"
        );
      })
      .join(" ");

    const [labelX, labelY] = project(field.boundary.centroid.lon, field.boundary.centroid.lat);

    return {
      field,
      pathData,
      labelX,
      labelY,
      shortLabel: `F${index + 1}`,
      tone: toneForField(payload, field.fieldId),
    };
  });
}

function formatFieldCropContext(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const dominantCrop = dominantCropForField(payload, fieldId);
  if (!dominantCrop) {
    return "Crop context unavailable";
  }
  return `${dominantCrop.name} (${formatNumber(dominantCrop.pct, 1)}%)`;
}

function formatFieldWeatherHint(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  let latestEntry = null as null | NormalizedGrowerDashboardPayload["weatherSeries"][number];
  for (const entry of payload.weatherSeries) {
    if (entry.fieldId !== fieldId) {
      continue;
    }
    if (!latestEntry || entry.date > latestEntry.date) {
      latestEntry = entry;
    }
  }
  if (!latestEntry) {
    return "Weather hint unavailable";
  }

  return `${latestEntry.date} • ${formatSignedNumber(latestEntry.temperatureAvgC, "°C")} • ${formatSignedNumber(latestEntry.precipitationMm, "mm")}`;
}

function formatFieldSoilHint(payload: NormalizedGrowerDashboardPayload, fieldId: string): string {
  const soil = payload.soilSummary.find((entry) => entry.fieldId === fieldId);
  if (!soil) {
    return "Soil hint unavailable";
  }

  const dominant = soil.dominantSoil ?? "soil type unavailable";
  const om =
    soil.avgOrganicMatterPct == null
      ? "OM n/a"
      : `OM ${formatNumber(soil.avgOrganicMatterPct, 1)}%`;
  return `${dominant} • ${om}`;
}

function soilSummaryForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["soilSummary"][number] | null {
  return payload.soilSummary.find((entry) => entry.fieldId === fieldId) ?? null;
}

function soilHorizonsForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["soilHorizons"] {
  return payload.soilHorizons
    .filter((entry) => entry.fieldId === fieldId)
    .toSorted((left, right) => {
      const leftTop = left.horizonTopCm ?? 9_999;
      const rightTop = right.horizonTopCm ?? 9_999;
      return leftTop - rightTop;
    });
}

function formatOptionalMetric(
  value: number | null,
  suffix: string,
  fractionDigits: number,
): string {
  if (value == null) {
    return "Not available";
  }

  return `${value.toFixed(fractionDigits)}${suffix}`;
}

function textureHintFromHorizon(
  horizon: NormalizedGrowerDashboardPayload["soilHorizons"][number] | null,
): string {
  if (!horizon) {
    return "Texture unavailable";
  }

  const parts: string[] = [];
  if (horizon.clayPct != null) {
    parts.push(`Clay ${horizon.clayPct.toFixed(0)}%`);
  }
  if (horizon.siltPct != null) {
    parts.push(`Silt ${horizon.siltPct.toFixed(0)}%`);
  }
  if (horizon.sandPct != null) {
    parts.push(`Sand ${horizon.sandPct.toFixed(0)}%`);
  }

  return parts.length > 0 ? parts.join(" • ") : "Texture unavailable";
}

function renderInitialSoilHorizonRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const horizons = soilHorizonsForFieldPayload(payload, fieldId).slice(0, 5);
  if (horizons.length === 0) {
    return '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">No horizon detail</span><span class="horizon-depth">—</span></div><div class="horizon-metrics"><span class="horizon-pill">No normalized soil horizon rows are available.</span></div></article>';
  }

  return horizons
    .map((horizon) => {
      const pills = [
        horizon.componentPct != null ? `Component ${horizon.componentPct.toFixed(0)}%` : null,
        horizon.ph != null ? `pH ${horizon.ph.toFixed(1)}` : null,
        horizon.organicMatterPct != null ? `OM ${horizon.organicMatterPct.toFixed(1)}%` : null,
        horizon.availableWaterCapacity != null
          ? `AWC ${horizon.availableWaterCapacity.toFixed(2)}`
          : null,
        textureHintFromHorizon(horizon),
      ].filter((value): value is string => Boolean(value));
      const top = horizon.horizonTopCm != null ? horizon.horizonTopCm.toFixed(0) : "?";
      const bottom = horizon.horizonBottomCm != null ? horizon.horizonBottomCm.toFixed(0) : "?";

      return `<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">${escapeHtml(horizon.componentName ?? "Unnamed component")}</span><span class="horizon-depth">${escapeHtml(`${top}–${bottom} cm`)}</span></div><div class="horizon-metrics">${pills.map((pill) => `<span class="horizon-pill">${escapeHtml(pill)}</span>`).join("")}</div></article>`;
    })
    .join("");
}

function fieldRotationSignal(payload: NormalizedGrowerDashboardPayload, fieldId: string): string {
  const rotation = payload.cropRotation.find((entry) => entry.fieldId === fieldId);
  if (!rotation) {
    return "Rotation signal unavailable.";
  }
  return rotation.predictedNextCrop
    ? `Rotation outlook favors ${rotation.predictedNextCrop}.`
    : rotation.rotationOutlook;
}

function cropCompositionForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): {
  latestYear: number | null;
  rows: NormalizedGrowerDashboardPayload["cropComposition"];
} {
  const year = latestCropYear(payload);
  if (year == null) {
    return { latestYear: null, rows: [] };
  }

  return {
    latestYear: year,
    rows: payload.cropComposition
      .filter((entry) => entry.fieldId === fieldId && entry.year === year)
      .toSorted((left, right) => right.pct - left.pct),
  };
}

function cropRotationForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["cropRotation"][number] | null {
  return payload.cropRotation.find((entry) => entry.fieldId === fieldId) ?? null;
}

function renderInitialCropCompositionRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const composition = cropCompositionForFieldPayload(payload, fieldId);
  if (composition.rows.length === 0) {
    return '<article class="composition-row"><div class="composition-topline"><span class="composition-name">No composition data</span><span class="composition-pct">—</span></div><div class="composition-meta">The embedded payload has no latest-year crop composition rows for this field.</div></article>';
  }

  return composition.rows
    .map(
      (entry) =>
        `<article class="composition-row"><div class="composition-topline"><span class="composition-name">${escapeHtml(entry.cropName)}</span><span class="composition-pct">${escapeHtml(entry.pct.toFixed(1))}%</span></div><div class="composition-bar"><div class="composition-fill" style="width:${Math.max(0, Math.min(100, entry.pct))}%"></div></div><div class="composition-meta">Crop code ${escapeHtml(entry.cropCode ?? "n/a")} • source ${escapeHtml(entry.source)}</div></article>`,
    )
    .join("");
}

function imageryCoverageForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["imageryCoverage"] {
  return payload.imageryCoverage
    .filter((entry) => entry.fieldId === fieldId && entry.sceneCount > 0)
    .toSorted((left, right) => String(left.source).localeCompare(String(right.source)));
}

function imageryScenesForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["imageryScenes"] {
  return payload.imageryScenes
    .filter((entry) => entry.fieldId === fieldId)
    .toSorted((left, right) => right.sceneDate.localeCompare(left.sceneDate));
}

function renderInitialImagerySourceRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const rows = imageryCoverageForFieldPayload(payload, fieldId);
  if (rows.length === 0) {
    return '<article class="imagery-empty-state"><span class="imagery-empty-title">No imagery-ready sources for this field</span><div class="imagery-empty-copy">The embedded payload does not include any imagery-ready source coverage rows with available scenes for the currently selected field.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Source count 0</span><span class="imagery-empty-pill">Embedded payload only</span><span class="imagery-empty-pill">Pick another field to compare</span></div></article>';
  }

  return rows
    .map(
      (entry) =>
        `<article class="imagery-source-row"><div class="imagery-topline"><span class="imagery-name">${escapeHtml(entry.source)}</span><span class="imagery-value">${escapeHtml(String(entry.sceneCount))} scene(s)</span></div><div class="imagery-detail">Available ${escapeHtml(entry.firstSceneDate ?? "n/a")} → ${escapeHtml(entry.lastSceneDate ?? "n/a")} • expected ${escapeHtml(entry.expectedSceneCount == null ? "n/a" : String(entry.expectedSceneCount))} • coverage ${escapeHtml(entry.coveragePct == null ? "n/a" : `${entry.coveragePct.toFixed(1)}%`)}</div></article>`,
    )
    .join("");
}

function renderInitialImagerySceneRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const rows = imageryScenesForFieldPayload(payload, fieldId).slice(0, 6);
  if (rows.length === 0) {
    return '<article class="imagery-empty-state"><span class="imagery-empty-title">No scene list available</span><div class="imagery-empty-copy">There are no normalized imagery scene rows with available scene metadata for the selected field in this offline dashboard payload.</div><div class="imagery-empty-pills"><span class="imagery-empty-pill">Recent scenes unavailable</span><span class="imagery-empty-pill">No reload needed</span><span class="imagery-empty-pill">Selection-aware panel</span></div></article>';
  }

  return rows
    .map((entry) => {
      const pills = [
        entry.cloudPct == null ? null : `Cloud ${entry.cloudPct.toFixed(1)}%`,
        `Assets ${entry.assetCount}`,
        entry.source,
      ].filter((value): value is string => Boolean(value));

      return `<article class="scene-row"><div class="scene-topline"><span class="scene-name">${escapeHtml(entry.sceneDate)}</span><span class="scene-value">${escapeHtml(entry.sceneId)}</span></div><div class="scene-detail">${escapeHtml(entry.notes.length > 0 ? entry.notes.join(" • ") : "Normalized scene metadata available")}</div><div class="scene-pills">${pills.map((pill) => `<span class="scene-pill">${escapeHtml(pill)}</span>`).join("")}</div></article>`;
    })
    .join("");
}

function summarizeDiagnosticCounts(
  payload: NormalizedGrowerDashboardPayload,
): Record<"info" | "warning" | "error", number> {
  return payload.diagnostics.reduce(
    (counts, entry) => {
      counts[entry.severity] += 1;
      return counts;
    },
    { info: 0, warning: 0, error: 0 },
  );
}

function uniqueLineagePaths(payload: NormalizedGrowerDashboardPayload): string[] {
  return [...new Set(payload.diagnostics.flatMap((entry) => entry.sourcePaths))].toSorted();
}

function coverageSummary(payload: NormalizedGrowerDashboardPayload): {
  weatherReady: number;
  soilReady: number;
  cropReady: number;
  imageryReady: number;
} {
  const fieldIds = payload.fields.map((field) => field.fieldId);
  return {
    weatherReady: fieldIds.filter((fieldId) =>
      payload.weatherSeries.some((entry) => entry.fieldId === fieldId),
    ).length,
    soilReady: fieldIds.filter((fieldId) =>
      payload.soilSummary.some((entry) => entry.fieldId === fieldId),
    ).length,
    cropReady: fieldIds.filter((fieldId) =>
      payload.cropRotation.some((entry) => entry.fieldId === fieldId),
    ).length,
    imageryReady: fieldIds.filter((fieldId) =>
      payload.imageryCoverage.some((entry) => entry.fieldId === fieldId && entry.sceneCount > 0),
    ).length,
  };
}

function renderDiagnosticEntries(payload: NormalizedGrowerDashboardPayload): string {
  if (payload.diagnostics.length === 0) {
    return '<article class="diagnostic-item"><div class="diagnostic-topline"><span class="diagnostic-code">no-diagnostics</span><span class="diagnostic-severity info">info</span></div><div class="diagnostic-message">No lineage or anomaly records were embedded in the normalized payload.</div></article>';
  }

  return payload.diagnostics
    .map((entry) => {
      const pills = [
        ...entry.fieldIds.map((fieldId) => `field ${fieldId}`),
        ...entry.sourcePaths.map((sourcePath) => sourcePath),
      ];

      return `<article class="diagnostic-item"><div class="diagnostic-topline"><span class="diagnostic-code">${escapeHtml(entry.code)}</span><span class="diagnostic-severity ${escapeHtml(entry.severity)}">${escapeHtml(entry.severity)}</span></div><div class="diagnostic-message">${escapeHtml(entry.message)}</div><div class="diagnostic-pills">${pills.map((pill) => `<span class="diagnostic-pill">${escapeHtml(pill)}</span>`).join("")}</div></article>`;
    })
    .join("");
}

export function renderGrowerDashboardHtml(payload: NormalizedGrowerDashboardPayload): string {
  assertNormalizedGrowerDashboardPayload(payload);

  const title = `${payload.farm.farmName} Dashboard`;
  const embeddedPayload = serializeEmbeddedPayload(payload);
  const fieldCountLabel = formatNumber(payload.fields.length);
  const generatedAtLabel = new Date(payload.generatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: payload.grower.timezone,
  });
  const imageryReadyFields = countImageryReadyFields(payload);
  const readiness = readinessPayload(payload);
  const cornKpi = summarizePlanKpi(
    readiness.fieldCornPlans,
    (plan) => plan.cornReadinessState,
    (plan) => plan.earliestSafeBand,
    (plan) => plan.nextRecheckWindow,
  );
  const soybeanKpi = summarizePlanKpi(
    readiness.fieldSoybeanPlans,
    (plan) => plan.soybeanReadinessState,
    (plan) => plan.earliestSafeBand,
    (plan) => plan.nextRecheckWindow,
  );
  const fieldFitKpi = summarizeFieldFitKpi(payload);
  const nextWorkableWindowLabel = dominantSummaryValue(
    [cornKpi.nextWindowLabel, soybeanKpi.nextWindowLabel],
    "Monitor conditions",
  );
  const mapFeatures = buildMapFeatures(payload);
  const initialField = payload.fields[0];
  const initialSoilSummary = soilSummaryForFieldPayload(payload, initialField.fieldId);
  const initialSurfaceHorizon =
    soilHorizonsForFieldPayload(payload, initialField.fieldId)[0] ?? null;
  const initialCropComposition = cropCompositionForFieldPayload(payload, initialField.fieldId);
  const initialCropLead = initialCropComposition.rows[0] ?? null;
  const initialRotation = cropRotationForFieldPayload(payload, initialField.fieldId);
  const initialCornPlan = cornPlanForField(payload, initialField.fieldId);
  const initialSoybeanPlan = soybeanPlanForField(payload, initialField.fieldId);
  const initialSharedReadiness = sharedReadinessForField(payload, initialField.fieldId);
  const initialCornAction = cropActionCell(
    initialCornPlan?.cornReadinessState,
    initialCornPlan?.earliestSafeBand,
    initialCornPlan?.nextRecheckWindow,
  );
  const initialSoyAction = cropActionCell(
    initialSoybeanPlan?.soybeanReadinessState,
    initialSoybeanPlan?.earliestSafeBand,
    initialSoybeanPlan?.nextRecheckWindow,
  );
  const initialLimitingFactor = limitingFactorSummary(
    initialCornPlan,
    initialSoybeanPlan,
    initialSharedReadiness,
  );
  const initialPlanConfidence = planConfidenceLabel(
    payload,
    initialField.fieldId,
    initialCornPlan,
    initialSoybeanPlan,
  );
  const initialImageryCoverage = imageryCoverageForFieldPayload(payload, initialField.fieldId);
  const initialImageryScenes = imageryScenesForFieldPayload(payload, initialField.fieldId);
  const initialLatestImageryScene = initialImageryScenes[0] ?? null;
  const actionTableRows = renderActionTableRows(payload, initialField.fieldId);
  const diagnosticCounts = summarizeDiagnosticCounts(payload);
  const lineagePaths = uniqueLineagePaths(payload);
  const coverage = coverageSummary(payload);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>${INLINE_CSS}</style>
  </head>
  <body data-selected-field-id="${escapeHtml(initialField.fieldId)}">
    <main>
      <section class="shell" aria-label="Grower dashboard hero overview">
        <section class="hero">
          <div class="hero-copy">
            <div class="hero-topline">
              <div>
                <p class="eyebrow">Offline classroom demo dashboard</p>
                <h1>${escapeHtml(payload.farm.farmName)}</h1>
              </div>
              <div class="hero-meta" aria-label="Farm overview metadata">
                <span class="label">Grower</span>
                <span class="value">${escapeHtml(payload.grower.growerName)}</span>
                <span class="detail">Generated ${escapeHtml(generatedAtLabel)}</span>
              </div>
            </div>
            <p class="lede">Compact readiness KPIs for corn, soy, field fit, and the next workable window.</p>
            <p class="sublede">
              ${escapeHtml(payload.farm.countyName ?? "Kansas county")} County, ${escapeHtml(payload.farm.stateCode)}
            </p>
          </div>
        </section>

        <div class="shell-body">
        <section class="overview-grid" aria-label="Overview dashboard rail">
          <section class="summary-wrap" aria-label="Portfolio summary cards">
            <p class="section-kicker">Readiness snapshot</p>
            <div class="summary-grid">
              <article class="card">
                <span class="label">Corn earliest band</span>
                <span class="value">${escapeHtml(cornKpi.earliestBandLabel)}</span>
                <span class="detail">${escapeHtml(`${formatNumber(cornKpi.readySoonCount)}/${fieldCountLabel} fields ready or soon`)}</span>
              </article>
              <article class="card">
                <span class="label">Soy earliest band</span>
                <span class="value">${escapeHtml(soybeanKpi.earliestBandLabel)}</span>
                <span class="detail">${escapeHtml(`${formatNumber(soybeanKpi.readySoonCount)}/${fieldCountLabel} fields ready or soon`)}</span>
              </article>
              <article class="card">
                <span class="label">Field fit readiness</span>
                <span class="value">${escapeHtml(`${formatNumber(fieldFitKpi.readySoonCount)}/${fieldCountLabel}`)}</span>
                <span class="detail">${escapeHtml(`${fieldFitKpi.trafficability} trafficability • ${fieldFitKpi.access} access • ${fieldFitKpi.drydown} drydown`)}</span>
              </article>
              <article class="card">
                <span class="label">Next workable / access window</span>
                <span class="value">${escapeHtml(nextWorkableWindowLabel)}</span>
                <span class="detail">${escapeHtml(`${fieldFitKpi.access} access outlook • Corn ${cornKpi.nextWindowLabel} • Soy ${soybeanKpi.nextWindowLabel}`)}</span>
              </article>
              <article class="card">
                <span class="label">Imagery-ready fields</span>
                <span class="value">${escapeHtml(String(imageryReadyFields))}</span>
                <span class="detail">Based on reconciled on-disk TIFF presence, not manifest claims alone.</span>
              </article>
            </div>
          </section>
        </section>

        <section class="downstream-grid" aria-label="Selected field dashboard rail">
        <section class="map-wrap" aria-label="Offline field boundary schematic">
          <p class="section-kicker">Field boundary schematic</p>
          <div class="map-grid">
            <section class="map-panel">
              <div class="map-topbar">
                <div class="map-meta-stack">
                  <div class="map-header">
                    <div>
                      <h2>Clickable offline farm map</h2>
                      <p class="map-copy">
                        All five field boundaries are rendered as inline SVG. Hover and select states stay local to this document with no tiles or mapping libraries.
                      </p>
                    </div>
                    <span class="map-badge">SVG only</span>
                  </div>
                  <div class="legend" aria-label="Map legend">
                    <span class="legend-item"><span class="legend-swatch corn"></span>Corn-led</span>
                    <span class="legend-item"><span class="legend-swatch soy"></span>Soy-led</span>
                    <span class="legend-item"><span class="legend-swatch other"></span>Other / mixed</span>
                  </div>
                </div>

              </div>

              <div class="map-stage-grid">
                <div class="map-stage-main">
                  <div class="map-frame">
                    <svg id="field-map-root" class="map-svg" viewBox="0 0 760 430" role="group" aria-label="Farm field boundary schematic" data-initial-field-id="${escapeHtml(initialField.fieldId)}">
                      ${mapFeatures
                        .map(
                          (feature) => `
                      <g class="field-node" data-field-id="${escapeHtml(feature.field.fieldId)}" tabindex="0" role="button" aria-pressed="false" aria-label="${escapeHtml(feature.field.fieldName)}">
                        <path class="field-shape tone-${feature.tone}" d="${feature.pathData}" />
                        <text class="field-label" x="${feature.labelX}" y="${feature.labelY}">${escapeHtml(feature.shortLabel)}</text>
                      </g>`,
                        )
                        .join("")}
                    </svg>
                  </div>
                  <div class="map-status-strip">
                    <p class="teaser-copy">Map selection stays synchronized with the field-focus panel and action table.</p>
                    <div id="runtime-status" class="runtime-status" aria-live="polite">Loading embedded payload…</div>
                  </div>
                </div>

                <section id="selected-field-focus" class="field-focus-panel" data-detail-state="selected" aria-label="Focused selected-field detail panel">
                  <div class="field-focus-header">
                    <div>
                      <div class="field-focus-topline">
                        <p class="section-kicker">Field focus</p>
                        <button id="selected-field-reset" class="field-focus-reset" type="button">Reset to farm overview</button>
                      </div>
                      <h2 id="selected-showcase-field" class="field-focus-title">${escapeHtml(initialField.fieldName)}</h2>
                      <p id="selected-showcase-summary" class="field-focus-copy">${escapeHtml(`${initialField.countyName ?? "County unavailable"} • ${formatNumber(initialField.areaAcres, 2)} acres • ${initialField.fieldId}`)}</p>
                    </div>
                  </div>

                  <div class="field-focus-meta-grid">
                    <article class="field-focus-meta-card">
                      <span class="label">Field name</span>
                      <span id="selected-field-name" class="value">${escapeHtml(initialField.fieldName)}</span>
                    </article>
                    <article class="field-focus-meta-card">
                      <span class="label">Acreage</span>
                      <span id="selected-field-acreage" class="value">${escapeHtml(`${formatNumber(initialField.areaAcres, 2)} acres`)}</span>
                    </article>
                    <article class="field-focus-meta-card">
                      <span class="label">County</span>
                      <span id="selected-field-county" class="value">${escapeHtml(initialField.countyName ?? "County unavailable")}</span>
                    </article>
                    <article class="field-focus-meta-card">
                      <span class="label">Imagery readiness</span>
                      <span id="selected-showcase-imagery" class="value">${escapeHtml(`${initialImageryCoverage.length} ready source(s)`)}</span>
                    </article>
                  </div>

                  <div class="field-plan-grid">
                    <article class="field-plan-card corn">
                      <span class="label">Corn plan</span>
                      <span id="selected-corn-state" class="action-state-pill tone-${escapeHtml(initialCornAction.tone)}">${escapeHtml(initialCornAction.stateLabel)}</span>
                      <span id="selected-corn-window" class="field-plan-window">${escapeHtml(initialCornAction.windowLabel)}</span>
                      <p id="selected-corn-meta" class="field-focus-support-copy">${escapeHtml(initialCornAction.windowMeta)}</p>
                    </article>
                    <article class="field-plan-card soy">
                      <span class="label">Soy plan</span>
                      <span id="selected-soy-state" class="action-state-pill tone-${escapeHtml(initialSoyAction.tone)}">${escapeHtml(initialSoyAction.stateLabel)}</span>
                      <span id="selected-soy-window" class="field-plan-window">${escapeHtml(initialSoyAction.windowLabel)}</span>
                      <p id="selected-soy-meta" class="field-focus-support-copy">${escapeHtml(initialSoyAction.windowMeta)}</p>
                    </article>
                  </div>

                  <article class="field-limiter-card">
                    <div class="field-focus-limiter">
                      <div>
                        <span class="label">Limiting factor</span>
                        <span id="selected-limiting-factor" class="field-limiter-value">${escapeHtml(initialLimitingFactor.label)}</span>
                        <p id="selected-limiting-meta" class="field-focus-support-copy">${escapeHtml(initialLimitingFactor.meta)}</p>
                      </div>
                      <span id="selected-plan-confidence" class="action-confidence-badge">${escapeHtml(initialPlanConfidence)}</span>
                    </div>
                  </article>

                  <section aria-label="Concise supporting evidence block">
                    <p class="section-kicker">Supporting evidence</p>
                    <p class="field-overview-copy">Quick cues stay directly under the plan summaries so one field can be understood without scanning multiple downstream sections.</p>
                    <div class="field-overview-grid">
                      <article class="field-overview-card">
                        <span class="label">Crop context</span>
                        <span id="selected-field-crop" class="value">${escapeHtml(formatFieldCropContext(payload, initialField.fieldId))}</span>
                      </article>
                      <article class="field-overview-card">
                        <span class="label">Weather cue</span>
                        <span id="selected-field-weather" class="value">${escapeHtml(formatFieldWeatherHint(payload, initialField.fieldId))}</span>
                      </article>
                      <article class="field-overview-card">
                        <span class="label">Soil cue</span>
                        <span id="selected-field-soil" class="value">${escapeHtml(formatFieldSoilHint(payload, initialField.fieldId))}</span>
                      </article>
                      <article class="field-overview-card">
                        <span class="label">Rotation cue</span>
                        <span id="selected-field-signal" class="value">${escapeHtml(fieldRotationSignal(payload, initialField.fieldId))}</span>
                      </article>
                    </div>
                  </section>

                  <section class="field-evidence-stage" aria-label="Expanded selected-field evidence">
                    <div class="field-evidence-header">
                      <p class="section-kicker">Secondary evidence</p>
                      <p class="field-overview-copy">Weather, soil, crop history, and NDVI-supporting imagery stay attached to the selected field here, but remain visually subordinate to the planting plans.</p>
                    </div>

                    <div class="field-evidence-grid">
                      <details class="field-evidence-card" open>
                        <summary>
                          <div class="field-evidence-summary">
                            <div>
                              <h3 id="weather-selected-field">${escapeHtml(initialField.fieldName)}</h3>
                              <p id="weather-selected-summary" class="field-evidence-summary-copy">Latest selected-field weather series rendered as inline SVG trend cards from the embedded payload only.</p>
                            </div>
                            <span class="field-evidence-badge">Weather</span>
                          </div>
                        </summary>
                        <div class="field-evidence-body">
                          <section class="weather-panel" aria-label="Selected field weather panel">
                            <div class="weather-header">
                              <div>
                                <h2 class="section-title">Latest field snapshot</h2>
                                <p class="weather-overview-copy">
                                  Daily weather context updates instantly when you click a different field in the schematic above.
                                </p>
                              </div>
                            </div>

                            <div class="weather-overview">
                              <section class="weather-overview-card">
                                <div class="weather-overview-metrics">
                                  <article class="weather-metric">
                                    <span class="label">Latest date</span>
                                    <span id="weather-latest-date" class="value">Loading…</span>
                                  </article>
                                  <article class="weather-metric">
                                    <span class="label">Average temp</span>
                                    <span id="weather-latest-temp" class="value">Loading…</span>
                                  </article>
                                  <article class="weather-metric">
                                    <span class="label">Precipitation</span>
                                    <span id="weather-latest-rain" class="value">Loading…</span>
                                  </article>
                                  <article class="weather-metric">
                                    <span class="label">Solar</span>
                                    <span id="weather-latest-solar" class="value">Loading…</span>
                                  </article>
                                  <article class="weather-metric">
                                    <span class="label">Humidity</span>
                                    <span id="weather-latest-humidity" class="value">Loading…</span>
                                  </article>
                                  <article class="weather-metric">
                                    <span class="label">Wind</span>
                                    <span id="weather-latest-wind" class="value">Loading…</span>
                                  </article>
                                </div>
                              </section>

                              <section class="weather-overview-card">
                                <h2 class="section-title">Inline trend cards</h2>
                                <p class="weather-overview-copy">
                                  Each chart uses the latest embedded daily rows for the currently selected field and redraws without any page reload.
                                </p>
                              </section>
                            </div>

                            <div class="weather-grid">
                              <article class="weather-chart-card">
                                <span class="label">Temperature</span>
                                <span id="weather-value-temperature" class="chart-value">Loading…</span>
                                <p id="weather-subtitle-temperature" class="chart-subtitle">Preparing chart…</p>
                                <div id="weather-chart-temperature" class="chart-frame"></div>
                              </article>
                              <article class="weather-chart-card">
                                <span class="label">Precipitation</span>
                                <span id="weather-value-precipitation" class="chart-value">Loading…</span>
                                <p id="weather-subtitle-precipitation" class="chart-subtitle">Preparing chart…</p>
                                <div id="weather-chart-precipitation" class="chart-frame"></div>
                              </article>
                              <article class="weather-chart-card">
                                <span class="label">Solar</span>
                                <span id="weather-value-solar" class="chart-value">Loading…</span>
                                <p id="weather-subtitle-solar" class="chart-subtitle">Preparing chart…</p>
                                <div id="weather-chart-solar" class="chart-frame"></div>
                              </article>
                              <article class="weather-chart-card">
                                <span class="label">Humidity</span>
                                <span id="weather-value-humidity" class="chart-value">Loading…</span>
                                <p id="weather-subtitle-humidity" class="chart-subtitle">Preparing chart…</p>
                                <div id="weather-chart-humidity" class="chart-frame"></div>
                              </article>
                              <article class="weather-chart-card">
                                <span class="label">Wind</span>
                                <span id="weather-value-wind" class="chart-value">Loading…</span>
                                <p id="weather-subtitle-wind" class="chart-subtitle">Preparing chart…</p>
                                <div id="weather-chart-wind" class="chart-frame"></div>
                              </article>
                            </div>
                          </section>
                        </div>
                      </details>

                      <details class="field-evidence-card">
                        <summary>
                          <div class="field-evidence-summary">
                            <div>
                              <h3 id="soil-selected-field">${escapeHtml(initialField.fieldName)}</h3>
                              <p id="soil-selected-summary" class="field-evidence-summary-copy">Decision-relevant soil summary metrics and compact horizon detail for the currently selected field.</p>
                            </div>
                            <span class="field-evidence-badge">Soil</span>
                          </div>
                        </summary>
                        <div class="field-evidence-body">
                          <section class="soil-panel" aria-label="Selected field soil panel">
                            <div class="soil-grid">
                              <section class="soil-summary-card">
                                <h2 class="section-title">Field soil summary</h2>
                                <p class="soil-summary-copy">
                                  Core soil signals stay visible for quick agronomic framing before deeper downstream panels are added.
                                </p>
                                <div class="soil-summary-metrics">
                                  <article class="soil-metric">
                                    <span class="label">Dominant soil</span>
                                    <span id="soil-dominant" class="value">${escapeHtml(initialSoilSummary?.dominantSoil ?? "Not available")}</span>
                                  </article>
                                  <article class="soil-metric">
                                    <span class="label">Organic matter</span>
                                    <span id="soil-om" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.avgOrganicMatterPct ?? null, "%", 1))}</span>
                                  </article>
                                  <article class="soil-metric">
                                    <span class="label">pH</span>
                                    <span id="soil-ph" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.avgPh ?? null, "", 2))}</span>
                                  </article>
                                  <article class="soil-metric">
                                    <span class="label">Total AWS</span>
                                    <span id="soil-aws" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.totalAwsInches ?? null, " in", 2))}</span>
                                  </article>
                                  <article class="soil-metric">
                                    <span class="label">Surface texture</span>
                                    <span id="soil-texture" class="value">${escapeHtml(textureHintFromHorizon(initialSurfaceHorizon))}</span>
                                  </article>
                                  <article class="soil-metric">
                                    <span class="label">Drainage</span>
                                    <span id="soil-drainage" class="value">${escapeHtml(initialSoilSummary?.drainageClass ?? "Not available")}</span>
                                  </article>
                                </div>
                              </section>

                              <section class="soil-horizon-card">
                                <h2 class="section-title">Compact horizon view</h2>
                                <p class="soil-horizon-copy">
                                  Normalized horizon rows are condensed into a quick read for depth, chemistry, water capacity, and texture.
                                </p>
                                <p class="soil-horizon-copy">
                                  Horizon rows shown: <strong id="soil-horizon-count">${escapeHtml(String(initialSoilSummary?.horizonCount ?? 0))}</strong>
                                </p>
                                <div id="soil-horizon-list" class="horizon-list">${renderInitialSoilHorizonRows(payload, initialField.fieldId)}</div>
                              </section>
                            </div>
                          </section>
                        </div>
                      </details>

                      <details class="field-evidence-card">
                        <summary>
                          <div class="field-evidence-summary">
                            <div>
                              <h3 id="crop-selected-field">${escapeHtml(initialField.fieldName)}</h3>
                              <p id="crop-selected-summary" class="field-evidence-summary-copy">Latest-year composition and normalized rotation outlook for the selected field, updated from the embedded payload only.</p>
                            </div>
                            <span class="field-evidence-badge">Crop history</span>
                          </div>
                        </summary>
                        <div class="field-evidence-body">
                          <section class="crop-panel" aria-label="Selected field crop and rotation panel">
                            <div class="crop-grid">
                              <section class="crop-composition-card">
                                <h2 class="section-title">Latest composition snapshot</h2>
                                <p class="crop-composition-copy">
                                  Farmer-friendly composition rows for the latest available year stay tied to the current map selection.
                                </p>
                                <div class="rotation-list">
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">Latest crop year</span>
                                      <span id="crop-latest-year" class="rotation-value">${escapeHtml(initialCropComposition.latestYear == null ? "Not available" : String(initialCropComposition.latestYear))}</span>
                                    </div>
                                    <div id="crop-composition-lead" class="rotation-detail">${escapeHtml(initialCropLead ? `${initialCropLead.cropName} leads at ${initialCropLead.pct.toFixed(1)}%` : "No latest-year composition available")}</div>
                                  </article>
                                </div>
                                <div id="crop-composition-list" class="composition-list">${renderInitialCropCompositionRows(payload, initialField.fieldId)}</div>
                              </section>

                              <section class="crop-rotation-card">
                                <h2 class="section-title">Rotation outlook</h2>
                                <p class="crop-rotation-copy">
                                  Short historical context plus next-crop signal from the normalized rotation summary for the selected field.
                                </p>
                                <div class="rotation-list">
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">Predicted next crop</span>
                                      <span id="crop-rotation-next" class="rotation-value">${escapeHtml(initialRotation?.predictedNextCrop ?? "Not available")}</span>
                                    </div>
                                    <div id="crop-rotation-confidence" class="rotation-detail">Confidence: ${escapeHtml(initialRotation?.rotationConfidence ?? "Not available")}</div>
                                  </article>
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">Sequence</span>
                                    </div>
                                    <div id="crop-rotation-sequence" class="rotation-detail">${escapeHtml(initialRotation?.rotationSequence ?? "No normalized rotation sequence available")}</div>
                                  </article>
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">History window</span>
                                    </div>
                                    <div id="crop-rotation-history" class="rotation-detail">${escapeHtml(initialRotation ? `${initialRotation.historyStartYear ?? "—"} → ${initialRotation.historyEndYear ?? "—"} • diversity ${initialRotation.cropDiversity}` : "History unavailable")}</div>
                                  </article>
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">Observed patterns</span>
                                    </div>
                                    <div id="crop-rotation-patterns" class="rotation-pills">${initialRotation && initialRotation.rotationPatterns.length > 0 ? initialRotation.rotationPatterns.map((pattern) => `<span class="rotation-pill">${escapeHtml(pattern)}</span>`).join("") : '<span class="rotation-pill">No rotation patterns available</span>'}</div>
                                  </article>
                                  <article class="rotation-item">
                                    <div class="rotation-topline">
                                      <span class="rotation-name">Rotation outlook</span>
                                    </div>
                                    <div id="crop-rotation-outlook" class="rotation-detail">${escapeHtml(initialRotation?.rotationOutlook ?? "Rotation outlook unavailable")}</div>
                                  </article>
                                </div>
                              </section>
                            </div>
                          </section>
                        </div>
                      </details>

                      <details class="field-evidence-card">
                        <summary>
                          <div class="field-evidence-summary">
                            <div>
                              <h3 id="imagery-selected-field">${escapeHtml(initialField.fieldName)}</h3>
                              <p id="imagery-selected-summary" class="field-evidence-summary-copy">Imagery-ready source coverage and recent normalized scene cues for the currently selected field.</p>
                            </div>
                            <span class="field-evidence-badge">NDVI + imagery</span>
                          </div>
                        </summary>
                        <div class="field-evidence-body">
                          <section class="imagery-panel" aria-label="Selected field imagery panel">
                            <div class="imagery-grid">
                              <section class="imagery-summary-card">
                                <h2 class="section-title">Source availability</h2>
                                <p class="imagery-summary-copy">
                                  Farmer-friendly source readiness and date coverage for imagery-ready fields, updated by the map selection above.
                                </p>
                                <div class="imagery-metrics">
                                  <article class="imagery-metric">
                                    <span class="label">Ready sources</span>
                                    <span id="imagery-ready-count" class="value">${escapeHtml(String(initialImageryCoverage.length))}</span>
                                  </article>
                                  <article class="imagery-metric">
                                    <span class="label">Latest scene</span>
                                    <span id="imagery-latest-scene" class="value">${escapeHtml(initialLatestImageryScene ? `${initialLatestImageryScene.sceneDate} • ${initialLatestImageryScene.source}` : "Not available")}</span>
                                  </article>
                                </div>
                                <div id="imagery-sources" class="imagery-list">${renderInitialImagerySourceRows(payload, initialField.fieldId)}</div>
                              </section>

                              <section class="imagery-scenes-card">
                                <h2 class="section-title">Recent scene cues</h2>
                                <p class="imagery-scenes-copy">
                                  Recent normalized scene metadata helps explain source freshness, cloud context, and asset availability without opening imagery yet.
                                </p>
                                <div id="imagery-scene-list" class="scene-list">${renderInitialImagerySceneRows(payload, initialField.fieldId)}</div>
                              </section>
                            </div>
                          </section>
                        </div>
                      </details>
                    </div>
                  </section>
                </section>
              </div>
            </section>
          </div>
        </section>

        <section class="selection-stage" aria-label="Field action table">
          <section class="selection-panel">
            <div class="selection-header">
              <div>
                <p class="section-kicker">Field action table</p>
                <h2 class="section-title">Compare the whole farm, then click into one field</h2>
                <p class="selection-copy">The table stays in context below the map while the field-focus panel on the right concentrates the selected field's corn plan, soy plan, limiter, and supporting evidence.</p>
              </div>
              <div>
                <p class="section-kicker">Queue logic</p>
                <p class="selection-guide-copy">
                  Compare corn and soybean windows row by row, use the limiting-factor column to see what is actually holding a field back, and click any row to sync the same selected field into the focused panel beside the map.
                </p>
              </div>
            </div>

            <div class="selection-table-scroll">
              <table class="selection-table" aria-label="Primary field action table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">Corn action</th>
                    <th scope="col">Soy action</th>
                    <th scope="col">Limiting factor</th>
                    <th scope="col">Confidence</th>
                  </tr>
                </thead>
                <tbody>${actionTableRows}</tbody>
              </table>
            </div>
          </section>
        </section>

        <section class="diagnostics-wrap" aria-label="Diagnostics and lineage panel">
          <p class="section-kicker">Diagnostics + lineage</p>
          <section class="diagnostics-panel">
            <details class="diagnostics-disclosure">
              <summary>
                <div class="diagnostics-summary">
                  <div>
                    <h2 class="section-title">Secondary lineage and anomaly view</h2>
                    <p class="diagnostics-summary-copy">
                      Collapsed by default so the showcase stays primary, while still exposing normalized lineage, coverage, and anomaly notes such as farm metadata mismatch and imagery reconciliation issues.
                    </p>
                  </div>
                  <span class="diagnostics-badge">${escapeHtml(String(payload.diagnostics.length))} diagnostic record(s)</span>
                </div>
              </summary>
              <div class="diagnostics-body">
                <div class="diagnostics-grid">
                  <section class="lineage-card">
                    <h2 class="section-title">Lineage snapshot</h2>
                    <p class="lineage-copy">
                      This panel summarizes the embedded payload contract, source-trace coverage, and normalized anomaly counts without interrupting the main dashboard flow.
                    </p>
                    <div class="lineage-metrics">
                      <article class="lineage-metric">
                        <span class="label">Contract version</span>
                        <span class="value">${escapeHtml(payload.contractVersion)}</span>
                      </article>
                      <article class="lineage-metric">
                        <span class="label">Runtime mode</span>
                        <span class="value">${escapeHtml(payload.runtime.dataMode)}</span>
                      </article>
                      <article class="lineage-metric">
                        <span class="label">Coverage footprint</span>
                        <span class="value">${escapeHtml(`${coverage.weatherReady}/${payload.fields.length} weather • ${coverage.soilReady}/${payload.fields.length} soil • ${coverage.cropReady}/${payload.fields.length} crop • ${coverage.imageryReady}/${payload.fields.length} imagery`)}</span>
                      </article>
                      <article class="lineage-metric">
                        <span class="label">Severity mix</span>
                        <span class="value">${escapeHtml(`info ${diagnosticCounts.info} • warning ${diagnosticCounts.warning} • error ${diagnosticCounts.error}`)}</span>
                      </article>
                      <article class="lineage-metric">
                        <span class="label">Source paths traced</span>
                        <span class="value">${escapeHtml(String(lineagePaths.length))}</span>
                      </article>
                      <article class="lineage-metric">
                        <span class="label">Browser restrictions</span>
                        <span class="value">${escapeHtml(`raw ${payload.runtime.rawSourceAccess} • fetch ${payload.runtime.networkFetch} • storage ${payload.runtime.localStorage}`)}</span>
                      </article>
                    </div>
                  </section>

                  <section class="diagnostic-list-card">
                    <h2 class="section-title">Embedded anomalies and notes</h2>
                    <p class="diagnostic-list-copy">
                      Includes the known farm metadata mismatch and any imagery or coverage anomalies preserved during normalization.
                    </p>
                    <div class="diagnostic-list">${renderDiagnosticEntries(payload)}</div>
                  </section>
                </div>
              </div>
            </details>
          </section>
        </section>
        </section>
        </div>
      </section>
    </main>
    <script id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}" type="application/json">${embeddedPayload}</script>
    <script>${INLINE_JS}</script>
  </body>
</html>`;
}
