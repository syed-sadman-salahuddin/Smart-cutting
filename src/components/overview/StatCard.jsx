import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ icon: Icon, tone, value, label, change, trend }) {
  const TrendIcon = trend === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={20} />
        </div>
        <div className="stat-text">
          <p className="stat-value">{value}</p>
          <p className="stat-label">{label}</p>
        </div>
      </div>

      <div className={`stat-trend ${trend}`}>
        <TrendIcon size={14} />
        <span>{change}</span>
        <span className="stat-trend-note">vs last month</span>
      </div>
    </div>
  );
}