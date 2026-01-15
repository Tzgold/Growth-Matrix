
import React, { useState, useMemo, useRef } from 'react';
import { generateSampleData } from './utils/dataGenerator';
import { KPICard } from './components/KPICard';
import { LineChart, LineChartHandle } from './components/LineChart';
import { BarChart, BarChartHandle } from './components/BarChart';
import { SummaryPanel } from './components/SummaryPanel';
import { DataPoint, TimeRange, MetricType, DashboardStats, SummaryInsights } from './types';
import { exportSvgAsPng } from './utils/exportUtils';
import ThreeDBarChart from './threejs.tsx';
const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [metric, setMetric] = useState<MetricType>('users');
  
  const lineChartRef = useRef<LineChartHandle>(null);
  const barChartRef = useRef<BarChartHandle>(null);

  // Seed the data once
  const fullData = useMemo(() => generateSampleData(120), []);

  const filteredData = useMemo(() => {
    if (timeRange === '7d') return fullData.slice(-7);
    if (timeRange === '30d') return fullData.slice(-30);
    return fullData;
  }, [fullData, timeRange]);

  const stats = useMemo<DashboardStats>(() => {
    const lastPoint = filteredData[filteredData.length - 1];
    const totalValue = lastPoint[metric];
    
    const sumSelected = filteredData.reduce((acc, curr) => acc + curr[metric], 0);
    const sumContrast = filteredData.reduce((acc, curr) => acc + (metric === 'users' ? curr.sessions : curr.users), 0);
    const avgEngagement = metric === 'users' ? (sumContrast / sumSelected) : (sumSelected / sumContrast);
    
    const totalContrastValue = filteredData.reduce((acc, curr) => acc + (metric === 'users' ? curr.sessions : curr.users), 0);
    
    // Growth rate relative to the start of the current range
    const firstValue = filteredData[0][metric];
    const growthRate = firstValue === 0 ? 0 : ((totalValue - firstValue) / firstValue) * 100;

    return { totalValue, totalContrastValue, avgEngagement, growthRate };
  }, [filteredData, metric]);

  const insights = useMemo<SummaryInsights>(() => {
    let peakDay = filteredData[0];
    let lowestDay = filteredData[0];

    filteredData.forEach(d => {
      if (d[metric] > peakDay[metric]) peakDay = d;
      if (d[metric] < lowestDay[metric]) lowestDay = d;
    });

    const first = filteredData[0][metric];
    const last = filteredData[filteredData.length - 1][metric];
    const diff = first === 0 ? 0 : (last - first) / first;
    const trend = diff > 0.05 ? 'increasing' : diff < -0.05 ? 'decreasing' : 'flat';

    return {
      peakDay: peakDay.date,
      peakValue: peakDay[metric],
      lowestDay: lowestDay.date,
      lowestValue: lowestDay[metric],
      trend
    };
  }, [filteredData, metric]);

  const handleExportLine = () => {
    if (lineChartRef.current) {
      exportSvgAsPng(lineChartRef.current.getSvg(), `line-chart-${metric}-${timeRange}`);
    }
  };

  const handleExportBar = () => {
    if (barChartRef.current) {
      exportSvgAsPng(barChartRef.current.getSvg(), `bar-chart-sessions-${timeRange}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-16 selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 hidden sm:block">GrowthMatrix</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Metric Selector */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
              {(['users', 'sessions'] as MetricType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 uppercase tracking-wider ${
                    metric === m
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {(['7d', '30d', 'all'] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${
                    timeRange === range
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Metric Selector Mobile */}
        <div className="flex md:hidden bg-slate-200/50 p-1 rounded-xl mb-6">
          {(['users', 'sessions'] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 uppercase tracking-widest ${
                metric === m
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPICard 
            label={`Today's ${metric.charAt(0).toUpperCase() + metric.slice(1)}`} 
            value={stats.totalValue.toLocaleString()} 
            subLabel={`Real-time active tracking`} 
            trend={stats.growthRate > 0 ? 'up' : 'down'}
          />
          <KPICard 
            label={metric === 'users' ? 'Period Sessions' : 'Period Users'} 
            value={stats.totalContrastValue.toLocaleString()} 
            subLabel={`Aggregate volume`} 
          />
          <KPICard 
            label={metric === 'users' ? 'Engagement Ratio' : 'Density Ratio'} 
            value={`${stats.avgEngagement.toFixed(2)} S/U`} 
            subLabel="Utilization metric" 
          />
          <KPICard 
            label="Growth Trend" 
            value={`${stats.growthRate > 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%`} 
            subLabel="Delta from period start" 
            trend={stats.growthRate > 0 ? 'up' : 'down'}
          />
        </div>

        {/* Main Line Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10 group relative transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                {metric.charAt(0).toUpperCase() + metric.slice(1)} Momentum
              </h2>
              <p className="text-sm text-slate-500 mt-1">Daily trend performance analyzed by {timeRange}.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportLine}
                className="flex items-center gap-2 p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                title="Export as PNG"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
              <div className="items-center gap-2 hidden sm:flex">
                <span className={`w-2.5 h-2.5 ${metric === 'users' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full ring-4 ${metric === 'users' ? 'ring-blue-50' : 'ring-purple-50'}`}></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Metric</span>
              </div>
            </div>
          </div>
          
          <LineChart ref={lineChartRef} data={filteredData} metric={metric} />
        </div>

        {/* Secondary visualizations grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 group transition-all hover:shadow-md">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Session Distribution</h2>
                <p className="text-sm text-slate-500 mt-1">Granular volume by individual day.</p>
              </div>
              <button 
                onClick={handleExportBar}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-300"
                title="Export as PNG"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
            <BarChart ref={barChartRef} data={filteredData} />
          </div>
          
          <div className="lg:col-span-1 space-y-8">
            <SummaryPanel insights={insights} />
            <div className="p-8 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold tracking-widest uppercase text-white/70 mb-4 border border-white/5">
                  Intelligence Status
                </div>
                <h4 className="text-lg font-bold mb-3">Model Prediction</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Based on the {insights.trend} trend, the system projects a <span className="text-white font-semibold">12.4% lift</span> in organic retention over the next quarter.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Confidence</div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full w-[85%] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    </div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Impact</div>
                    <div className="text-xs font-bold text-green-400">High</div>
                  </div>
                </div>
              </div>
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            </div>
          </div>
        </div>
        <ThreeDBarChart/>
      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-10 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-xs text-slate-400">GM</div>
            <p>© 2026 GrowthMatrix Analytics Engine</p>
          </div>
          <div className="flex gap-8 font-medium">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Developer API</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Governance</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
