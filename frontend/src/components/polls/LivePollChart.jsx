import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BAR_COLORS = ['#7C3AED', '#2563EB', '#22D3EE', '#10B981', '#F59E0B'];

const LivePollChart = ({ poll }) => {
  if (!poll?.options) {
    return (
      <div className="glass-card-static" style={{ padding: '28px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
        <div style={{ fontWeight: 700, color: '#F1F5F9', marginBottom: '4px' }}>No active poll</div>
        <div style={{ fontSize: '13px', color: '#64748B' }}>Launch a poll from the builder to see live results here.</div>
      </div>
    );
  }

  const data = poll.options.map(o => ({ name: o.text, votes: o.votes || 0 }));

  return (
    <div className="glass-card-static" style={{ padding: '22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Live results</div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#F1F5F9' }}>{poll.question}</div>
        </div>
        <span style={{ fontSize: '12px', color: '#64748B', background: '#0E1525', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, flexShrink: 0, marginLeft: '12px' }}>
          {poll.totalVotes || 0} votes
        </span>
      </div>

      <div style={{ width: '100%', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 16 }}>
            <XAxis dataKey="name" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#4B5563" fontSize={11} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#141D30', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#F1F5F9', fontSize: '13px' }}
              cursor={{ fill: 'rgba(124,58,237,0.06)' }}
            />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LivePollChart;
