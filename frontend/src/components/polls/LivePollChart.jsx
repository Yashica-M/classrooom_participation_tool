import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MUTED_CHART_COLORS = ['#14B8A6', '#3B82F6', '#0EA5E9', '#6366F1', '#38BDF8'];

const LivePollChart = ({ poll }) => {
  if (!poll || !poll.options) {
    return (
      <div style={{
        background: '#0F172A',
        borderRadius: '12px',
        padding: '24px',
        color: '#94A3B8',
        textAlign: 'center',
        border: '1px solid #1E293B'
      }}>
        No active poll right now. Broadcast a poll to start gathering live votes!
      </div>
    );
  }

  const chartData = poll.options.map(opt => ({
    name: opt.text,
    votes: opt.votes || 0
  }));

  return (
    <div style={{
      background: '#0F172A',
      borderRadius: '12px',
      padding: '24px',
      color: '#F1F5F9',
      border: '1px solid #1E293B'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ background: '#0D9488', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
            LIVE POLL
          </span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 700 }}>
            {poll.question}
          </h3>
        </div>
        <span style={{ background: '#020617', border: '1px solid #1E293B', padding: '4px 12px', borderRadius: '16px', fontSize: '12px', color: '#14B8A6', fontWeight: 600 }}>
          {poll.totalVotes || 0} Total Votes
        </span>
      </div>

      <div style={{ width: '100%', height: '220px', marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#020617', borderColor: '#1E293B', borderRadius: '8px', color: '#FFF' }}
            />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={MUTED_CHART_COLORS[index % MUTED_CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LivePollChart;
