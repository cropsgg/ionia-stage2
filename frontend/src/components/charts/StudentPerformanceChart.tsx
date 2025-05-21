import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area
} from 'recharts';

type DataPoint = {
  date: string;
  score: number;
  average: number;
  classAverage: number;
};

type StudentPerformanceChartProps = {
  data: DataPoint[];
  title?: string;
  height?: number;
};

const StudentPerformanceChart: React.FC<StudentPerformanceChartProps> = ({
  data,
  title = 'Performance Over Time',
  height = 400
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis 
            dataKey="date" 
            scale="point" 
            padding={{ left: 10, right: 10 }} 
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              border: 'none' 
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
            iconSize={10}
          />
          
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="classAverage" 
            fill="#f3f4f6" 
            stroke="#9ca3af" 
            name="Class Average" 
          />
          <Bar 
            yAxisId="left"
            dataKey="score" 
            barSize={20} 
            fill="#4f46e5" 
            name="Your Score" 
            radius={[4, 4, 0, 0]}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="average" 
            stroke="#16a34a" 
            name="Your Average" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentPerformanceChart; 