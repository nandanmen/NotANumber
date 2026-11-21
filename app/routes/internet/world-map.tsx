import { geoEquirectangular, geoGraticule, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";

const width = 960;
const height = 430;
const lobeWidth = width / 12;
const lobeCenters = Array.from({ length: 12 }, (_, index) => lobeWidth * (index + 0.5));
const lobePath = (center: number) => {
  const edge = lobeWidth / 2;

  return `M${center} 0C${center - edge} 110 ${center - edge} 180 ${center - edge} 215C${center - edge} 280 ${center - edge} 350 ${center} ${height}C${center + edge} 350 ${center + edge} 280 ${center + edge} 215C${center + edge} 180 ${center + edge} 110 ${center} 0Z`;
};

const land = feature(landTopology as unknown as Parameters<typeof feature>[0], "land");
const projection = geoEquirectangular()
  .scale(width / (2 * Math.PI))
  .translate([width / 2, height / 2]);
const path = geoPath(projection);
const graticulePath = path(geoGraticule().step([30, 20])());
const landPath = path(land);

export function InterruptedWorldMap() {
  return (
    <svg
      aria-labelledby="world-map-title"
      role="img"
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
    >
      <title id="world-map-title">Interrupted world map</title>
      <defs>
        {lobeCenters.map((center, index) => (
          <clipPath id={`world-map-lobe-${index}`} key={center}>
            <path d={lobePath(center)} />
          </clipPath>
        ))}
      </defs>
      {lobeCenters.map((center, index) => (
        <g clipPath={`url(#world-map-lobe-${index})`} key={center}>
          <path d={lobePath(center)} fill="var(--blue-5)" />
          <path
            d={landPath ?? undefined}
            fill="var(--gray-2)"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={graticulePath ?? undefined}
            fill="none"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${center} 0V${height}`}
            fill="none"
            stroke="currentColor"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
      <g fill="none" stroke="currentColor">
        {lobeCenters.map((center) => (
          <path d={lobePath(center)} key={center} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}
