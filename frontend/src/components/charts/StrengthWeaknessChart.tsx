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
  Cell
} from 'recharts';

type TopicScore = {
  topic: string;
  score: number;
  isStrength: boolean;
};

type StrengthWeaknessChartProps = {
  data: TopicScore[];
  title?: string;
  height?: number;
  threshold?: number; // Threshold score that determines strength vs. weakness
};

const StrengthWeaknessChart: React.FC<StrengthWeaknessChartProps> = ({
  data,
  title = 'Strengths & Improvement Areas',
  height = 400,
  threshold = 70
}) => {
  // Sort data by score for better visualization
  const sortedData = [...data].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>}
      
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 100, // Increased left margin for topic names
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
          />
          <YAxis 
            dataKey="topic" 
            type="category" 
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Score']}
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
            payload={[
              { value: 'Strengths', type: 'circle', color: '#16a34a' },
              { value: 'Improvement Areas', type: 'circle', color: '#f59e0b' }
            ]}
          />
          <ReferenceLine x={threshold} stroke="#9ca3af" strokeDasharray="3 3" />
          <Bar 
            dataKey="score" 
            radius={[0, 4, 4, 0]}
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.score >= threshold ? '#16a34a' : '#f59e0b'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Topics scoring above {threshold}% are considered strengths.</p>
      </div>
    </div>
  );
};

export default StrengthWeaknessChart; 