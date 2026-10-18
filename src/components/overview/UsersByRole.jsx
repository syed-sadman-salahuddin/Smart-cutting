import { ChartNoAxesColumn } from 'lucide-react';
import { usersByRole } from '../../data/overviewData';

export default function UsersByRole() {
  // the biggest count fills 100% of the bar, the others are relative to it
  const max = Math.max(...usersByRole.map((r) => r.count));

  return (
    <div className="panel span-2">
      <div className="panel-head">
        <h3 className="panel-title">
          <ChartNoAxesColumn size={16} className="panel-title-icon" /> Users by Role
        </h3>
        <p className="panel-sub">Ranked by member count</p>
      </div>

      <div className="panel-body">
        <div className="role-list">
          {usersByRole.map((item) => (
            <div className="role-group" key={item.role}>
              <div className="role-row">
                <span className="role-name">{item.role}</span>
                <span className="role-count">{item.count}</span>
              </div>
              <div className="role-track">
                <div className="role-fill" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}