import { History } from 'lucide-react';
import { activityTypes } from '../../data/overviewData';

export default function RecentActivity({ items }) {
  return (
    <div className="panel span-2">
      <div className="panel-head">
        <h3 className="panel-title">
          <History size={16} className="panel-title-icon" /> Recent Activity
        </h3>
      </div>

      <ul className="activity-list">
        {items.map((item) => {
          const look = activityTypes[item.type];
          if (!look) return null; 
          const Icon = look.icon;
          return (
            <li className={`activity-item tone-${look.tone}`} key={item.id}>
              <div className="activity-icon">
                <Icon size={16} />
              </div>
              <div className="activity-body">
                <p className="activity-text">
                  {look.before}
                  <b>{item.name}</b>
                  {look.after}
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