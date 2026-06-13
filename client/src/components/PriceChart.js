import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

export default function PriceChart({ data, symbol }) {
  if (!data || data.length === 0) return <div className="loading">No chart data</div>;

  const first = data[0]?.close || 0;
  const last = data[data.length - 1]?.close || 0;
  const isUp = last >= first;
  const color = isUp ? '#00D4AA' : '#FF4566';

  const formatted = data.map(d => ({
    date: d.date?.slice(5),  // show MM-DD
    close: d.close,
    high: d.high,
    low: d.low,
    volume: d.volume,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#5A5A7A', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#5A5A7A', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${v.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              background: '#1A1A26',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              color: '#F0F0F8',
            }}
            formatter={(v) => [`$${v.toFixed(2)}`, 'Close']}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#colorClose)"
            dot={false}
            activeDot={{ r: 5, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}