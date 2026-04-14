import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { departmentDistribution } from '../utils';
import type { Employee } from '../types';

const COLORS = ['#a8a29e', '#d6d3d1', '#c2b8a3', '#b8b0a0', '#9c9588', '#e7e2db'];

interface DepartmentChartProps {
  employees: Employee[];
}

export default function DepartmentChart({ employees }: DepartmentChartProps) {
  const data = departmentDistribution(employees);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">Headcount by Department</h3>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: '#78716c' }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontSize: '12px',
                backgroundColor: '#fafaf9',
                border: '1px solid #e7e5e4',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
              cursor={{ fill: 'rgba(168,162,158,0.08)' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
