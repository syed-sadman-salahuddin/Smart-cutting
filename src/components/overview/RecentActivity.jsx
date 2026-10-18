import { History } from 'lucide-react';
import { recentActivity } from '../../data/overviewData';

export default function RecentActivity() {
  return (
    <div className="panel span-2">
      <div className="panel-head">
        <h3 className="panel-title">
          <History size={16} className="panel-title-icon" /> Recent Activity
        </h3>
      </div>

      <ul className="activity-list">
        {recentActivity.map((item) => {
          const Icon = item.icon;
          return (
            <li className={`activity-item tone-${item.tone}`} key={item.id}>
              <div className="activity-icon">
                <Icon size={16} />
              </div>
              <div className="activity-body">
                <p className="activity-text">
                  {item.before}
                  <b>{item.bold}</b>
                  {item.after}
                </p>
                <span className="activity-time">{item.time}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}