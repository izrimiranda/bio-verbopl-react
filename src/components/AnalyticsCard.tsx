import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'beige';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorVariants = {
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-500',
    light: 'bg-purple-50'
  },
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    light: 'bg-blue-50'
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    light: 'bg-green-50'
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    light: 'bg-orange-50'
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    light: 'bg-red-50'
  },
  beige: {
    bg: 'bg-beige',
    text: 'text-beige',
    light: 'bg-beige/10'
  }
};

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend
}) => {
  const colors = colorVariants[color];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Color Bar */}
        <div className={`w-2 h-12 rounded-full ${colors.bg}`}></div>
        
        {/* Content */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-800">
              {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
            </p>
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Icon */}
        <div className={`${colors.light} p-3 rounded-lg ${colors.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
