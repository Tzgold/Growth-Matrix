
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as d3 from 'd3';
import { DataPoint, MetricType } from '../types';

interface LineChartProps {
  data: DataPoint[];
  metric: MetricType;
  height?: number;
}

export interface LineChartHandle {
  getSvg: () => SVGSVGElement | null;
}

export const LineChart = forwardRef<LineChartHandle, LineChartProps>(({ data, metric, height = 350 }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getSvg: () => svgRef.current
  }));

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.offsetWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('style', 'font-family: inherit;');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({
      ...d,
      parsedDate: parseDate(d.date) || new Date()
    }));

    const x = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.parsedDate) as [Date, Date])
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => d[metric]) || 0])
      .nice()
      .range([chartHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-opacity', 0.8)
      .call(d3.axisLeft(y).tickSize(-chartWidth).tickFormat(() => ''));

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(width > 500 ? 10 : 5).tickFormat(d3.timeFormat('%b %d') as any))
      .attr('color', '#94a3b8')
      .selectAll('text')
      .style('font-size', '11px');

    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('color', '#94a3b8')
      .selectAll('text')
      .style('font-size', '11px');

    // Line
    const line = d3.line<any>()
      .x(d => x(d.parsedDate))
      .y(d => y(d[metric]))
      .curve(d3.curveMonotoneX);

    const color = metric === 'users' ? '#3b82f6' : '#8b5cf6';

    // Area
    const area = d3.area<any>()
      .x(d => x(d.parsedDate))
      .y0(chartHeight)
      .y1(d => y(d[metric]))
      .curve(d3.curveMonotoneX);

    const gradId = `line-gradient-${metric}`;
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', gradId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', color).attr('stop-opacity', 0.3);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', color).attr('stop-opacity', 0);

    const areaPath = g.append('path')
      .datum(formattedData)
      .attr('fill', `url(#${gradId})`)
      .attr('opacity', 0)
      .attr('d', area);

    areaPath.transition()
      .duration(1000)
      .attr('opacity', 1);

    const path = g.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', line);

    // Animation: Smooth draw-in
    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

    // Tooltip overlay logic
    //the tool tip thing
    const tooltip = d3.select('body').append('div')
      .attr('class', 'chart-tooltip hidden');

    const focus = g.append('g')
      .style('display', 'none');

    focus.append('line')
      .attr('class', 'focus-line')
      .attr('stroke', '#cbd5e1')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('y1', 0)
      .attr('y2', chartHeight);

    focus.append('circle')
      .attr('r', 6)
      .attr('fill', color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2.5);

    g.append('rect')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .attr('fill', 'transparent')
      .on('mouseover', () => { 
        focus.style('display', null); 
        tooltip.classed('hidden', false);
      })
      .on('mouseout', () => { 
        focus.style('display', 'none'); 
        tooltip.classed('hidden', true);
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        const xDate = x.invert(mx);
        const bisect = d3.bisector((d: any) => d.parsedDate).left;
        const index = bisect(formattedData, xDate, 1);
        const d0 = formattedData[index - 1];
        const d1 = formattedData[index];
        const d = (d1 && xDate.getTime() - d0.parsedDate.getTime() > d1.parsedDate.getTime() - xDate.getTime()) ? d1 : d0;

        focus.attr('transform', `translate(${x(d.parsedDate)}, 0)`);
        focus.select('circle').attr('transform', `translate(0, ${y(d[metric])})`);
        
        tooltip.html(`
          <div class="flex flex-col gap-1 min-w-[120px]">
            <div class="font-bold text-gray-800 border-b pb-1 mb-1">${d3.timeFormat('%B %d, %Y')(d.parsedDate)}</div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-xs text-gray-500 font-medium">Users</span>
              <span class="font-bold ${metric === 'users' ? 'text-blue-600' : 'text-gray-700'}">${d.users.toLocaleString()}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-xs text-gray-500 font-medium">Sessions</span>
              <span class="font-bold ${metric === 'sessions' ? 'text-purple-600' : 'text-gray-700'}">${d.sessions.toLocaleString()}</span>
            </div>
            <div class="mt-1 pt-1 border-t flex justify-between gap-4">
              <span class="text-[10px] text-gray-400 font-medium uppercase">Ratio</span>
              <span class="text-[10px] font-bold text-gray-500">${(d.sessions / d.users).toFixed(2)} S/U</span>
            </div>
          </div>
        `)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 28}px`);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, metric, height]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} width="100%" height={height} className="overflow-visible" />
    </div>
  );
});
