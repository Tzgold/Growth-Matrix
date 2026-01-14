
import React from 'react';
import { SummaryInsights } from '../types';

interface SummaryPanelProps {
  insights: SummaryInsights;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ insights }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
      <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Analytical Insights</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Peak Usage</p>
            <p className="text-sm font-semibold text-gray-900">{insights.peakDay}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-blue-700">{insights.peakValue.toLocaleString()}</p>
            <p className="text-xs text-blue-500">Users</p>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Lowest Usage</p>
            <p className="text-sm font-semibold text-gray-900">{insights.lowestDay}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-700">{insights.lowestValue.toLocaleString()}</p>
            <p className="text-xs text-gray-400">Users</p>
          </div>
        </div>

        <div className="p-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Overall Trend</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
              insights.trend === 'increasing' ? 'bg-green-100 text-green-700' : 
              insights.trend === 'decreasing' ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {insights.trend}
            </span>
            <p className="text-sm text-gray-600">
              {insights.trend === 'increasing' 
                ? 'Usage metrics show consistent growth over the selected period.' 
                : insights.trend === 'decreasing' 
                ? 'Recent decline detected. Suggest investigating retention cohorts.'
                : 'Metrics are stable with minimal variance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
