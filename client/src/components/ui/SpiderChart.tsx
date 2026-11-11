import React from 'react';
import { toPersianDigits } from '../../utils/formatters';

interface SkillPoint {
  subject: string;
  value: number; // 0 to 100
  fullMark?: number;
}

interface SpiderChartProps {
  skills: SkillPoint[];
  size?: number;
}

export const SpiderChart: React.FC<SpiderChartProps> = ({ skills, size = 320 }) => {
  const center = size / 2;
  const radius = size * 0.36; // leave room for labels around perimeter
  const totalAxes = skills.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to get coordinates
  const getCoordinates = (valueNormalized: number, index: number, offsetDistance = radius) => {
    // Start from top: -Math.PI / 2
    const angle = index * angleStep - Math.PI / 2;
    const r = offsetDistance * valueNormalized;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build grid polygons
  const gridPolygons = levels.map((lvl) => {
    const points = skills
      .map((_, i) => {
        const { x, y } = getCoordinates(lvl, i);
        return `${x},${y}`;
      })
      .join(' ');
    return points;
  });

  // Build user data polygon
  const dataPoints = skills.map((item, i) => {
    const norm = Math.min(100, Math.max(10, item.value)) / 100;
    return getCoordinates(norm, i);
  });
  const dataPolygonString = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="w-full max-w-[340px] flex flex-col items-center justify-center py-2 select-none mx-auto overflow-hidden">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto aspect-square overflow-visible">
        {/* Background Grid Polygons */}
        {gridPolygons.map((pts, idx) => (
          <polygon
            key={`grid-${idx}`}
            points={pts}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-ui-border-default opacity-60"
          />
        ))}

        {/* Radial Axis Lines */}
        {skills.map((_, i) => {
          const { x, y } = getCoordinates(1.0, i);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-ui-border-default opacity-70"
            />
          );
        })}

        {/* Data Area Fill and Stroke */}
        <polygon
          points={dataPolygonString}
          fill="var(--theme-primary)"
          fillOpacity="0.25"
          stroke="var(--theme-primary)"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* Data Points / Dots */}
        {dataPoints.map((pt, i) => (
          <circle
            key={`pt-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="4.5"
            fill="var(--theme-primary)"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        ))}

        {/* Non-overlapping Axis Labels */}
        {skills.map((item, i) => {
          // Put labels 24px outside max radius
          const labelDist = radius + 26;
          const { x, y } = getCoordinates(1.0, i, labelDist);

          // Determine text anchor based on x position relative to center
          let textAnchor: 'inherit' | 'end' | 'middle' | 'start' = 'middle';
          if (x > center + 10) textAnchor = 'start';
          else if (x < center - 10) textAnchor = 'end';

          return (
            <g key={`lbl-${i}`}>
              <text
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-[12px] font-bold fill-ui-text-primary pointer-events-none"
              >
                {item.subject}
              </text>
              <text
                x={x}
                y={y + 14}
                textAnchor={textAnchor}
                dominantBaseline="central"
                className="text-[11px] font-black fill-[var(--theme-primary)]"
              >
                {toPersianDigits(item.value)}٪
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
