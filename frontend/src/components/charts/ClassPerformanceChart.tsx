import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label
} from 'recharts';

type ClassPerformanceData = {
  className: string;
  averageScore: number;
  completionRate: number;
  improvementRate: number;
};

type ClassPerformanceChartProps = {
  data: ClassPerformanceData[];
  title?: string;
  height?: number;
  metric?: 'averageScore' | 'completionRate' | 'improvementRate';
};

const ClassPerformanceChart: React.FC<ClassPerformanceChartProps> = ({
  data,
  title = 'Class Performance Comparison',
  height = 400,
  metric = 'averageScore'
}) => {
  const getMetricLabel = () => {
    switch (metric) {
      case 'averageScore':
        return 'Average Score (%)';
      case 'completionRate':
        return 'Completion Rate (%)';
      case 'improvementRate':
        return 'Improvement Rate (%)';
      default:
        return 'Value';
    }
  };

  const getBarColor = () => {
    switch (metric) {
      case 'averageScore':
        return '#4f46e5'; // indigo
      case 'completionRate':
        return '#16a34a'; // green
      case 'improvementRate':
        return '#ea580c'; // orange
      default:
        return '#4f46e5'; // indigo
    }
  };

  // Sort data by selected metric for better visualization
  const sortedData = [...data].sort((a, b) => b[metric] - a[metric]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
      </div>
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 100, // Increased left margin for class names
            bottom: 45, // Space for X-axis label
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={metric === 'improvementRate' ? [-20, 20] : [0, 100]}
          >
            <Label value={getMetricLabel()} offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis 
            dataKey="className" 
            type="category" 
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, getMetricLabel()]}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              border: 'none' 
            }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Legend />
          
          {metric === 'improvementRate' && (
            <ReferenceLine x={0} stroke="#9ca3af" strokeWidth={1} />
          )}
          
          <Bar 
            dataKey={metric} 
            name={getMetricLabel()}
            fill={getBarColor()}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      {metric === 'improvementRate' && (
        <div className="mt-4 text-sm text-gray-500">
          <p>Improvement Rate shows the percentage change in performance compared to the previous period.</p>
        </div>
      )}
    </div>
  );
};

export default ClassPerformanceChart; 