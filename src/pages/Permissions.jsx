import { useMemo, useState } from 'react';
import {
  CircleCheck,
  FolderOpen,
  Lock,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import {
  filterPermissionsGroups,
  getTotalPermissionsCount,
} from '../data/permissionsData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/permissions.css';
import '../styles/po.css';

export default function Permissions() {
  const { items: groups } = useCollection(KEYS.permissions);
  const [searchQuery, setSearchQuery] = useState('');

  const totalCount = useMemo(() => {
    return getTotalPermissionsCount(groups);
  }, [groups]);

  const filteredGroups = useMemo(() => {
    return filterPermissionsGroups(groups, searchQuery);
  }, [groups, searchQuery]);

  const filteredCount = useMemo(() => {
    return getTotalPermissionsCount(filteredGroups);
  }, [filteredGroups]);

  return (
    <div className="perm-page">
      <Breadcrumb label="Permissions" icon={Lock} />

      <div className="card-shell">
        <div className="po-banner">
          <div className="po-banner-left">
            <div className="po-banner-icon">
              <Lock size={20} />
            </div>
            <h1 className="po-banner-title">Permissions List</h1>
          </div>
        </div>

        <div className="perm-body">
          <div className="perm-panel">
            <div className="perm-panel-header">
              <div className="perm-panel-header-left">
                <div className="perm-panel-header-icon">
                  <Lock size={15} />
                </div>
                <h2 className="perm-panel-header-title">Permissions</h2>
              </div>
              <div className="perm-panel-badge">
                {searchQuery ? `${filteredCount} / ${totalCount}` : totalCount}
              </div>
            </div>

            <div className="perm-panel-content">
              <div className="perm-search-wrap">
                <div className="perm-search-box">
                  <span className="perm-search-icon">
                    <Search size={16} />
                  </span>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    className="perm-search-input"
                    placeholder="Search by name or codename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="perm-search-clear"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              <div className="perm-groups-container">
                {filteredGroups.length === 0 ? (
                  <div className="perm-empty-state">
                    <div className="perm-empty-icon">
                      <ShieldAlert size={24} />
                    </div>
                    <div className="perm-empty-title">No permissions found</div>
                    <p className="perm-empty-desc">
                      No permissions or groups match &ldquo;{searchQuery}&rdquo;. Try another
                      search term.
                    </p>
                  </div>
                ) : (
                  filteredGroups.map((group) => (
                    <div key={group.id} className="perm-group-card">
                      <div className="perm-group-header">
                        <FolderOpen size={16} className="perm-group-icon" />
                        <h4 className="perm-group-title">{group.name}</h4>
                        <span className="perm-group-count">
                          ({group.permissions.length})
                        </span>
                      </div>

                      <div className="perm-group-grid">
                        {group.permissions.map((perm) => (
                          <div
                            key={perm.id || perm.codename}
                            className="perm-item-card"
                            title={`${perm.name} (${perm.codename})`}
                          >
                            <CircleCheck
                              size={16}
                              className="perm-item-icon"
                            />
                            <div className="perm-item-text">
                              <span className="perm-item-name">{perm.name}</span>
                              <span className="perm-item-codename">
                                {perm.codename}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
