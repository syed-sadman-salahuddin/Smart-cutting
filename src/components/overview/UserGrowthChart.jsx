import { useState } from 'react';
import { ChartSpline } from 'lucide-react';
import { userGrowth } from '../../data/overviewData';

// The chart is drawn on a 640 x 240 canvas and then scaled to fit the card
const W = 640;
const H = 240;
const LEFT = 40;
const RIGHT = 620;
const TOP = 8;
const BOTTOM = 208;

const points = userGrowth.values.map((value, i) => ({
  value,
  label: userGrowth.months[i],
  x: LEFT + (i * (RIGHT - LEFT)) / (userGrowth.values.length - 1),
  y: BOTTOM - (value / userGrowth.max) * (BOTTOM - TOP),
}));

const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
const areaPath = `${linePath} L ${RIGHT},${BOTTOM} L ${LEFT},${BOTTOM} Z`;

// horizontal grid lines + the numbers on the left
const ticks = [
  { y: 8, label: '2000' },
  { y: 108, label: '1000' },
  { y: 208, label: '0' },
];

export default function UserGrowthChart() {
  const [hover, setHover] = useState(null); // index of the point under the mouse
  const last = points[points.length - 1];
  const active = hover === null ? null : points[hover];

  // find the point closest to the mouse
  const handleMove = (e) => {
    const box = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    let nearest = 0;
    points.forEach((p, i) => {
      if (Math.abs(p.x - x) < Math.abs(points[nearest].x - x)) nearest = i;
    });
    setHover(nearest);
  };

  return (
    <div className="panel span-3">
      <div className="panel-head">
        <h3 className="panel-title">
          <ChartSpline size={16} className="panel-title-icon" /> User Growth
        </h3>
        <p className="panel-sub">New signups over the last 8 months</p>
      </div>

      <div className="panel-body">
        <div className="chart-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="user-growth-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.03" />
              </linearGradient>
            </defs>

            {/* grid lines */}
            <g>
              {ticks.map((t) => (
                <line key={t.y} x1={LEFT} x2={RIGHT} y1={t.y} y2={t.y} className="chart-grid" strokeWidth="1" />
              ))}
            </g>
            {ticks.map((t) => (
              <text key={t.label} x={34} y={t.y + 3} textAnchor="end" className="chart-label" fontSize="10">
                {t.label}
              </text>
            ))}

            {/* filled area + line */}
            <path d={areaPath} fill="url(#user-growth-gradient)" stroke="none" />
            <path d={linePath} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* dot on the newest value */}
            <circle cx={last.x} cy={last.y} r="4" fill="var(--color-primary)" className="chart-dot" strokeWidth="2" />

            {/* dot on the hovered value */}
            {active && (
              <circle cx={active.x} cy={active.y} r="4" fill="var(--color-primary)" className="chart-dot" strokeWidth="2" />
            )}

            {/* month names */}
            {points.map((p) => (
              <text key={p.label} x={p.x} y={228} textAnchor="middle" className="chart-label" fontSize="10">
                {p.label}
              </text>
            ))}

            {/* invisible layer that listens to the mouse */}
            <rect
              x={LEFT}
              y={TOP}
              width={RIGHT - LEFT}
              height={BOTTOM - TOP}
              fill="transparent"
              onMouseMove={handleMove}
              onMouseLeave={() => setHover(null)}
            />
          </svg>

          {active && (
            <div className="chart-tooltip" style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}>
              {active.label}: {active.value.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}