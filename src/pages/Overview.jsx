import { TrendingUp } from 'lucide-react';
import { currentUser } from '../data/user';
import { overviewStats } from '../data/overviewData';
import StatCard from '../components/overview/StatCard';
import UserGrowthChart from '../components/overview/UserGrowthChart';
import UsersByRole from '../components/overview/UsersByRole';
import RecentActivity from '../components/overview/RecentActivity';
import QuickActions from '../components/overview/QuickActions';
import '../styles/overview.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Overview() {
  return (
    <div className="card-shell">
      {/* greeting banner */}
      <div className="overview-banner">
        <div className="banner-inner">
          <div className="banner-icon">
            <TrendingUp size={20} />
          </div>
          <h1 className="banner-title">
            {getGreeting()}, {currentUser.name}
          </h1>
        </div>
      </div>

      <div className="overview-body">
        {/* 4 small cards */}
        <div className="stats-grid">
          {overviewStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>

        {/* chart + role bars */}
        <div className="row-chart">
          <UserGrowthChart />
          <UsersByRole />
        </div>

        {/* activity + quick actions */}
        <div className="row-bottom">
          <RecentActivity />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}