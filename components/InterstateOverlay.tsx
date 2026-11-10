"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import interstateData from "@/lib/interstate-data.json";

const project = ([lon, lat]: number[]) => [(lon + 88) * 1000, (41.8 - lat) * 1000];
const roads = interstateData.roads.map(road => ({ ...road, path: road.paths.map(points => points.map((point, i) => { const [x,y] = project(point); return `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`; }).join(" ")).join(" ") }));

export default function InterstateOverlay({ viewBox }: { viewBox: string }) {
  const root = useRef<SVGGElement>(null);
  const [unitsPerPixel, setUnitsPerPixel] = useState(3);
  useLayoutEffect(() => {
    const svg = root.current?.ownerSVGElement;
    if (!svg) return;
    const update = () => {
      const rect = svg.getBoundingClientRect();
      const box = svg.viewBox.baseVal;
      if (rect.width && rect.height) setUnitsPerPixel(Math.max(box.width / rect.width, box.height / rect.height));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [viewBox]);

  const labels = useMemo(() => {
    const [left, top, width, height] = viewBox.split(" ").map(Number);
    const margin = 20 * unitsPerPixel;
    const chosen: { number: string; x: number; y: number }[] = [];
    const inside = ([x,y]: number[]) => x > left + margin && x < left + width - margin && y > top + margin && y < top + height - margin;
    const clear = ([x,y]: number[]) => chosen.every(p => Math.hypot(x-p.x,y-p.y) > 44 * unitsPerPixel);
    for (const road of roads) {
      let count = 0;
      for (const point of road.preferredLabels.map(project)) {
        if (inside(point) && clear(point)) { chosen.push({number:road.number,x:point[0],y:point[1]}); count++; }
      }
      // A rep’s narrower view still gets a road label when the preferred anchors fall outside it.
      if (!count) {
        const candidates = road.labelCandidates.map(project).filter(p => inside(p) && clear(p));
        candidates.sort((a,b) => Math.hypot(a[0]-left-width/2,a[1]-top-height/2) - Math.hypot(b[0]-left-width/2,b[1]-top-height/2));
        if (candidates[0]) chosen.push({number:road.number,x:candidates[0][0],y:candidates[0][1]});
      }
    }
    return chosen;
  }, [viewBox, unitsPerPixel]);

  return <g ref={root} pointerEvents="none" aria-hidden="true">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {roads.map(road => <path key={`edge-${road.number}`} d={road.path} stroke="#173d4d" strokeOpacity=".8" strokeWidth="4" vectorEffect="non-scaling-stroke" />)}
      {roads.map(road => <path key={road.number} d={road.path} stroke="#fff2ce" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
    </g>
    {labels.map((label,index) => <g key={`${label.number}-${index}`} transform={`translate(${label.x} ${label.y}) scale(${unitsPerPixel})`}>
      <path d="M-14 -12 Q0 -9 14 -12 L14 3 Q12 11 0 16 Q-12 11 -14 3 Z" fill="#173d4d" stroke="#f8fafc" strokeWidth="1.3" />
      <path d="M-12.5 -10 Q0 -7.5 12.5 -10 L12.5 -5 L-12.5 -5 Z" fill="#b66b5c" />
      <text x="0" y="7" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize={label.number.length === 3 ? 11.5 : 13} fontWeight="800">{label.number}</text>
    </g>)}
  </g>;
}
