import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

type SubjectScore = {
  subject: string;
  score: number;
  average: number;
};

type SubjectPerformanceRadarProps = {
  data: SubjectScore[];
  title?: string;
  height?: number;
};

const SubjectPerformanceRadar: React.FC<SubjectPerformanceRadarProps> = ({
  data,
  title = 'Performance By Subject',
  height = 400
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <PolarRadiusAxis 
            angle={45} 
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            labelFormatter={(label) => `Subject: ${label}`}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              border: 'none'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            iconSize={10}
          />
          <Radar 
            name="Your Score" 
            dataKey="score" 
            stroke="#4f46e5" 
            fill="#4f46e5" 
            fillOpacity={0.6}
          />
          <Radar 
            name="Class Average" 
            dataKey="average" 
            stroke="#9ca3af" 
            fill="#9ca3af" 
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubjectPerformanceRadar; 