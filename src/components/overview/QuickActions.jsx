import { Link } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import { quickActions } from '../../data/overviewData';

export default function QuickActions() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">
          <Zap size={16} className="panel-title-icon" /> Quick Actions
        </h3>
      </div>

      <div className="quick-list">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.path} className="quick-link" key={action.id}>
              <div className="quick-icon">
                <Icon size={16} />
              </div>
              <span className="quick-label">{action.label}</span>
              <ChevronRight size={16} className="quick-arrow" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}