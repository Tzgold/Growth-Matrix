
import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const KPICard: React.FC<KPICardProps> = ({ label, value, subLabel, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className={`text-xs font-semibold ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-400'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
          </span>
        )}
      </div>
      {subLabel && <p className="text-xs text-gray-400 mt-2">{subLabel}</p>}
    </div>
  );
};
