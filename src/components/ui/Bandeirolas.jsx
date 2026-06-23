'use client';

/* Bandeirolas SVG component — animated festival flags */
export default function Bandeirolas({ opacity = 1, className = '' }) {
  const colors = [
    '#C0392B', // vermelho
    '#E8A020', // amarelo
    '#2D7A3A', // verde
    '#1A6B8A', // azul
    '#C0392B',
    '#E8A020',
    '#2D7A3A',
    '#1A6B8A',
    '#C0392B',
    '#E8A020',
    '#2D7A3A',
    '#1A6B8A',
    '#C0392B',
    '#E8A020',
    '#2D7A3A',
    '#1A6B8A',
  ];

  // Triangle points for each flag along a drooping rope path
  const total = colors.length;
  const svgWidth = 1200;
  const svgHeight = 120;
  const spacing = svgWidth / (total + 1);
  const ropeY = 30; // rope height at endpoints
  const sagY = 65;  // max droop at center

  // Catenary approximation: y = ropeY + 4*sag*(x/W)*(1 - x/W)
  function ropeYAt(x) {
    return ropeY + 4 * (sagY - ropeY) * (x / svgWidth) * (1 - x / svgWidth);
  }

  const flags = colors.map((color, i) => {
    const cx = spacing * (i + 1);
    const cy = ropeYAt(cx);
    const halfW = 18;
    const height = 38;
    return {
      color,
      points: `${cx - halfW},${cy} ${cx + halfW},${cy} ${cx},${cy + height}`,
    };
  });

  // SVG rope path
  const ropePoints = [];
  for (let x = 0; x <= svgWidth; x += 10) {
    ropePoints.push(`${x},${ropeYAt(x)}`);
  }
  const ropePath = 'M ' + ropePoints.join(' L ');

  return (
    <div
      className={className}
      style={{
        width: '100%',
        overflow: 'hidden',
        opacity,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
        className="bandeirola-rope"
      >
        {/* Rope */}
        <path
          d={ropePath}
          stroke="rgba(42,24,16,0.35)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Flags */}
        {flags.map((flag, i) => (
          <polygon
            key={i}
            points={flag.points}
            fill={flag.color}
            opacity="0.9"
            style={{
              transformOrigin: `${flag.points.split(' ')[0].split(',')[0]}px ${flag.points.split(' ')[0].split(',')[1]}px`,
              animation: `sway ${3.5 + (i % 3) * 0.5}s ease-in-out infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            }}
          />
        ))}
        {/* Rope endpoints circles */}
        <circle cx="0" cy={ropeY} r="4" fill="rgba(42,24,16,0.4)" />
        <circle cx={svgWidth} cy={ropeY} r="4" fill="rgba(42,24,16,0.4)" />
      </svg>
    </div>
  );
}
