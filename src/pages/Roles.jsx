import { useCallback, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Layers,
  ListOrdered,
  LockKeyhole,
  Plus,
  Search,
  ShieldCheck,
  SquarePen,
  Trash2,
  X,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import ConfirmDialog from '../components/ConfirmDialog';
import RoleFormModal from '../components/roles/RoleFormModal';
import { roleModules } from '../data/rolesData';
import { useCollection } from '../hooks/useCollection';
import { KEYS } from '../services/storage';
import '../styles/po.css';
import '../styles/roles.css';

const INITIAL_EXPANDED_ROLES = [
  'super-admin',
  'hr-admin',
  'employee',
  'cutting-pc-operator',
];

function pad(value) {
  return String(value).padStart(2, '0');
}

function RoleDetails({ role, onClose }) {
  return (
    <div className="roles-view-overlay" onMouseDown={onClose}>
      <section
        className="roles-view-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-details-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="roles-view-header">
          <div className="roles-view-title">
            <span className="roles-avatar"><ShieldCheck size={18} /></span>
            <div>
              <h2 id="role-details-title">{role.name}</h2>
              <span>Role permissions overview</span>
            </div>
          </div>
          <button type="button" className="roles-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="roles-view-body">
          <div className="roles-view-permission-count">
            <LockKeyhole size={15} />
            {role.permissionsCount || 0} permissions
          </div>
          <h3>Modules ({role.modules.length})</h3>
          <div className="roles-view-modules">
            {role.modules.map((module, index) => (
              <span className="roles-module-chip" key={`${module}-${index}`}>
                <Layers size={12} />
                {module}
              </span>
            ))}
            {role.modules.length === 0 && <p>No modules assigned to this role.</p>}
          </div>
        </div>
        <footer className="roles-view-footer">
          <button type="button" className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
        </footer>
      </section>
    </div>
  );
}

export default function Roles() {
  const { items, add, update, remove } = useCollection(KEYS.roles);
  const [query, setQuery] = useState('');
  const [formRole, setFormRole] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [roleToView, setRoleToView] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [expandedRoles, setExpandedRoles] = useState(() => new Set(INITIAL_EXPANDED_ROLES));

  const filteredRoles = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return items;

    return items.filter(
      (role) =>
        role.name.toLowerCase().includes(search) ||
        role.modules.some((module) => module.toLowerCase().includes(search))
    );
  }, [items, query]);

  const closeForm = useCallback(() => {
    setFormRole(null);
    setIsCreating(false);
  }, []);

  const handleSave = (values) => {
    if (formRole) {
      update(formRole.id, values);
    } else {
      add({ ...values, permissionsCount: 0 });
    }
    closeForm();
  };

  const cancelDelete = useCallback(() => setRoleToDelete(null), []);
  const confirmDelete = useCallback(() => {
    if (!roleToDelete) return;
    remove(roleToDelete.id);
    setRoleToDelete(null);
  }, [remove, roleToDelete]);

  const toggleExpanded = (roleId) => {
    setExpandedRoles((current) => {
      const next = new Set(current);
      if (next.has(roleId)) next.delete(roleId);
      else next.add(roleId);
      return next;
    });
  };

  const openCreateForm = () => {
    setFormRole(null);
    setIsCreating(true);
  };

  const visibleFrom = filteredRoles.length > 0 ? 1 : 0;
  const visibleTo = filteredRoles.length;

  return (
    <div className="roles-page">
      <Breadcrumb label="Roles" icon={ShieldCheck} />

      <div className="card-shell">
        <div className="po-banner">
          <div className="po-banner-left">
            <div className="po-banner-icon"><ShieldCheck size={20} /></div>
            <h1 className="po-banner-title">Roles &amp; Permissions List</h1>
          </div>
          <button type="button" className="po-add-btn" onClick={openCreateForm}>
            <Plus size={16} />
            <span>Create new role</span>
          </button>
        </div>

        <div className="roles-body">
          <div className="roles-panel">
            <div className="roles-toolbar">
              <div className="roles-search">
                <Search size={16} className="roles-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  className="roles-search-input"
                  placeholder="Search roles..."
                  aria-label="Search roles"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    className="roles-search-clear"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="roles-table-scroll">
              <table className="roles-table">
                <colgroup>
                  <col className="roles-col-index" />
                  <col className="roles-col-name" />
                  <col className="roles-col-modules" />
                  <col className="roles-col-permissions" />
                  <col className="roles-col-actions" />
                </colgroup>
                <thead>
                  <tr>
                    <th><span className="roles-index-heading"><ListOrdered size={12} /> #</span></th>
                    <th>Name</th>
                    <th>Modules</th>
                    <th>Total Permission</th>
                    <th className="roles-actions-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="roles-empty">
                        <div className="roles-empty-icon"><ShieldCheck size={22} /></div>
                        <p>{query ? 'No roles match your search.' : 'No roles found.'}</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRoles.map((role, index) => {
                      const expanded = expandedRoles.has(role.id);
                      const hasMoreModules = role.modules.length > 10;
                      const displayedModules =
                        hasMoreModules && !expanded ? role.modules.slice(0, 10) : role.modules;

                      return (
                        <tr key={role.id}>
                          <td className="roles-index-cell">
                            <span className="roles-index">{pad(index + 1)}</span>
                          </td>
                          <td>
                            <div className="roles-name-cell">
                              <span className="roles-avatar"><ShieldCheck size={16} /></span>
                              <span className="roles-name">{role.name}</span>
                            </div>
                          </td>
                          <td>
                            <div className="roles-module-list">
                              {displayedModules.map((module, moduleIndex) => (
                                <span
                                  className="roles-module-chip"
                                  key={`${module}-${moduleIndex}`}
                                  title={module}
                                >
                                  <Layers size={11} aria-hidden="true" />
                                  {module}
                                </span>
                              ))}
                              {hasMoreModules && (
                                <button
                                  type="button"
                                  className="roles-module-toggle"
                                  onClick={() => toggleExpanded(role.id)}
                                  aria-expanded={expanded}
                                  aria-label={`${expanded ? 'Show fewer' : 'Show all'} modules for ${role.name}`}
                                >
                                  {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                  {expanded ? 'Show Less' : `+ ${role.modules.length - 10} More`}
                                </button>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="roles-permission-count">
                              <LockKeyhole size={13} />
                              {role.permissionsCount || 0} perms
                            </span>
                          </td>
                          <td>
                            <div className="roles-actions">
                              <button
                                type="button"
                                className="roles-action-btn roles-action-view"
                                title={`View ${role.name}`}
                                aria-label={`View ${role.name}`}
                                onClick={() => setRoleToView(role)}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                className="roles-action-btn roles-action-edit"
                                title={`Edit ${role.name}`}
                                aria-label={`Edit ${role.name}`}
                                onClick={() => {
                                  setFormRole(role);
                                  setIsCreating(false);
                                }}
                              >
                                <SquarePen size={16} />
                              </button>
                              <button
                                type="button"
                                className="roles-action-btn roles-action-delete"
                                title={`Delete ${role.name}`}
                                aria-label={`Delete ${role.name}`}
                                onClick={() => setRoleToDelete(role)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="roles-footer">
              <span>
                Showing <strong>{visibleFrom}–{visibleTo}</strong> of{' '}
                <strong>{filteredRoles.length}</strong> roles
              </span>
            </div>
          </div>
        </div>
      </div>

      {(formRole || isCreating) && (
        <RoleFormModal
          role={formRole}
          existingRoles={items}
          modules={roleModules}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}
      {roleToView && <RoleDetails role={roleToView} onClose={() => setRoleToView(null)} />}
      {roleToDelete && (
        <ConfirmDialog
          title="Delete role?"
          message={`Are you sure you want to delete "${roleToDelete.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}
