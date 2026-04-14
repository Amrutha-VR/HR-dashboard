import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { statusDistribution } from '../utils';
import type { Employee } from '../types';

const STATUS_COLORS: Record<string, string> = {
  active: '#6d9e78',
  inactive: '#c47070',
  'on-leave': '#c9a855',
  probation: '#6a9ec4',
};

interface StatusChartProps {
  employees: Employee[];
}

export default function StatusChart({ employees }: StatusChartProps) {
  const data = statusDistribution(employees);

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">Workforce Status</h3>
      <div className="flex items-center gap-4">
        <div className="w-[120px] h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={55}
                dataKey="count"
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#a8a29e'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: '12px',
                  backgroundColor: '#fafaf9',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[item.name] ?? '#a8a29e' }}
              />
              <span className="text-xs text-neutral-600 capitalize">
                {item.name === 'on-leave' ? 'On Leave' : item.name}
              </span>
              <span className="text-xs font-semibold text-neutral-800 ml-auto">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
