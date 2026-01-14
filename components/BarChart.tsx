
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { DataPoint } from '../types';

interface BarChartProps {
  data: DataPoint[];
  height?: number;
}

export interface BarChartHandle {
  getSvg: () => SVGSVGElement | null;
}

export const BarChart = forwardRef<BarChartHandle, BarChartProps>(({ data, height = 300 }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getSvg: () => svgRef.current
  }));

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('style', 'font-family: inherit;');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, chartWidth])
      .domain(data.map(d => d.date))
      .padding(0.3);

    const y = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(data, d => d.sessions) || 0])
      .nice();

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => !(i % Math.ceil(data.length / 8)))))
      .attr('color', '#94a3b8')
      .selectAll('text')
      .style('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#94a3b8')
      .selectAll('text')
      .style('font-size', '11px');

    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.date) || 0)
      .attr('width', x.bandwidth())
      .attr('fill', '#e2e8f0')
      .attr('rx', 4)
      .attr('y', chartHeight)
      .attr('height', 0);

    bars.transition()
      .duration(1000)
      .delay((_, i) => i * 15)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.sessions))
      .attr('height', d => chartHeight - y(d.sessions))
      .attr('fill', '#6366f1');

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'chart-tooltip hidden');

    bars.on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('fill', '#4f46e5')
          .attr('transform', 'translate(0,-2)');
          
        tooltip.classed('hidden', false)
          .html(`
            <div class="flex flex-col gap-1 min-w-[120px]">
              <div class="font-bold text-gray-800 border-b pb-1 mb-1">${d.date}</div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-xs text-gray-500 font-medium">Sessions</span>
                <span class="font-bold text-indigo-600">${d.sessions.toLocaleString()}</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-xs text-gray-500 font-medium">Users</span>
                <span class="font-bold text-gray-700">${d.users.toLocaleString()}</span>
              </div>
            </div>
          `)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .transition().duration(200)
          .attr('fill', '#6366f1')
          .attr('transform', 'translate(0,0)');
        tooltip.classed('hidden', true);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, height]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible" />
    </div>
  );
});
