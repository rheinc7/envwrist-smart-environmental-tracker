
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon, color }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-lg flex flex-col items-center justify-between hover:scale-105 transition-transform duration-300 border-2 border-transparent hover:border-white">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4 text-white shadow-md animate-float`}>
        {icon}
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800">
          {value} <span className="text-sm font-medium text-gray-400">{unit}</span>
        </h3>
      </div>
    </div>
  );
};
