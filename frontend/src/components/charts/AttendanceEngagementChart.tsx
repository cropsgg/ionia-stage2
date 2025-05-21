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
  PieChart,
  Pie,
  Cell
} from 'recharts';

type AttendanceData = {
  date: string;
  present: number;
  absent: number;
  late: number;
};

type EngagementSummary = {
  highlyEngaged: number;
  moderatelyEngaged: number;
  minimallyEngaged: number;
};

type AttendanceEngagementChartProps = {
  attendanceData: AttendanceData[];
  engagementSummary: EngagementSummary;
  title?: string;
  period?: string;
  className?: string;
};

const AttendanceEngagementChart: React.FC<AttendanceEngagementChartProps> = ({
  attendanceData,
  engagementSummary,
  title = 'Attendance & Engagement Metrics',
  period = 'Last 14 days',
  className
}) => {
  // Calculate totals for the pie chart
  const totalStudents = 
    engagementSummary.highlyEngaged + 
    engagementSummary.moderatelyEngaged + 
    engagementSummary.minimallyEngaged;
  
  const engagementPieData = [
    { name: 'Highly Engaged', value: engagementSummary.highlyEngaged },
    { name: 'Moderately Engaged', value: engagementSummary.moderatelyEngaged },
    { name: 'Minimally Engaged', value: engagementSummary.minimallyEngaged }
  ];
  
  const ENGAGEMENT_COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  
  // Calculate attendance rate
  const totalDays = attendanceData.length;
  let totalPresents = 0;
  let totalStudentDays = 0;
  
  attendanceData.forEach(day => {
    totalPresents += day.present;
    totalStudentDays += day.present + day.absent + day.late;
  });
  
  const attendanceRate = totalStudentDays > 0 
    ? Math.round((totalPresents / totalStudentDays) * 100) 
    : 0;
  
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{period}</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          {attendanceRate}% Attendance
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Daily Attendance</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={attendanceData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 20,
              }}
              barSize={20}
              barGap={0}
              barCategoryGap={12}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 10 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  const formattedName = name === 'present' ? 'Present' : 
                    name === 'absent' ? 'Absent' : 'Late';
                  return [`${value} students`, formattedName];
                }}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none' 
                }}
              />
              <Legend />
              <Bar 
                dataKey="present" 
                stackId="a" 
                fill="#10b981" 
                name="Present" 
              />
              <Bar 
                dataKey="late" 
                stackId="a" 
                fill="#f59e0b" 
                name="Late" 
              />
              <Bar 
                dataKey="absent" 
                stackId="a" 
                fill="#ef4444" 
                name="Absent" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Engagement Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement Distribution</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={engagementPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {engagementPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ENGAGEMENT_COLORS[index % ENGAGEMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} students (${Math.round((value / totalStudents) * 100)}%)`, '']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  border: 'none' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <h5 className="text-xs font-medium text-gray-500 mb-1">Highly Engaged</h5>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">{engagementSummary.highlyEngaged}</span>
            <span className="text-sm text-green-600">{Math.round((engagementSummary.highlyEngaged / totalStudents) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-green-500 h-1.5 rounded-full" 
              style={{ width: `${(engagementSummary.highlyEngaged / totalStudents) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h5 className="text-xs font-medium text-gray-500 mb-1">Moderately Engaged</h5>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">{engagementSummary.moderatelyEngaged}</span>
            <span className="text-sm text-amber-600">{Math.round((engagementSummary.moderatelyEngaged / totalStudents) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-amber-500 h-1.5 rounded-full" 
              style={{ width: `${(engagementSummary.moderatelyEngaged / totalStudents) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <h5 className="text-xs font-medium text-gray-500 mb-1">Minimally Engaged</h5>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">{engagementSummary.minimallyEngaged}</span>
            <span className="text-sm text-red-600">{Math.round((engagementSummary.minimallyEngaged / totalStudents) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-red-500 h-1.5 rounded-full" 
              style={{ width: `${(engagementSummary.minimallyEngaged / totalStudents) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Engagement is measured based on classroom participation, homework submissions, and online activity.</p>
      </div>
    </div>
  );
};

export default AttendanceEngagementChart; 