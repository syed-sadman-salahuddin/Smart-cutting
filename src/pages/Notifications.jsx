import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ListOrdered,
  Search,
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';
import { useStorage } from '../hooks/useStorage';
import { KEYS } from '../services/storage';
import '../styles/notifications.css';

const PAGE_SIZES = [10, 25, 50, 100];

function isRead(notification) {
  return notification.read ?? notification.isRead ?? false;
}

function formatReceivedAt(value, locale) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Notifications() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useStorage(KEYS.notifications, []);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const notificationList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationList.filter((notification) => !isRead(notification)).length;

  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return notificationList.filter((notification) => {
      if (filter === 'unread' && isRead(notification)) return false;
      const searchable = [
        notification.title,
        notification.message,
        notification.body,
        notification.type,
      ].filter(Boolean).join(' ').toLowerCase();
      return !text || searchable.includes(text);
    });
  }, [notificationList, filter, query]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const from = total === 0 ? 0 : start + 1;
  const to = start + visibleRows.length;

  const updateFilter = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const updateSearch = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  const markAsRead = (id) => {
    setNotifications((previous) =>
      (Array.isArray(previous) ? previous : []).map((notification) =>
        notification.id === id ? { ...notification, read: true, isRead: true } : notification
      )
    );
  };

  return (
    <>
      <Breadcrumb label={t('notifications.pageTitle')} icon={Bell} />

      <section className="notifications-card" aria-labelledby="notificationsHeading">
        <header className="notifications-banner">
          <div className="notifications-title-wrap">
            <span className="notifications-title-icon"><Bell size={19} /></span>
            <h1 id="notificationsHeading">{t('notifications.all')}</h1>
          </div>
          <div className="notifications-filters" role="group" aria-label={t('notifications.filterLabel')}>
            <button
              type="button"
              className={`notifications-filter${filter === 'all' ? ' is-active' : ''}`}
              aria-pressed={filter === 'all'}
              onClick={() => updateFilter('all')}
            >
              {t('notifications.allTab')}
            </button>
            <button
              type="button"
              className={`notifications-filter${filter === 'unread' ? ' is-active' : ''}`}
              aria-pressed={filter === 'unread'}
              onClick={() => updateFilter('unread')}
            >
              {t('notifications.unreadTab')}{unreadCount > 0 ? ` (${unreadCount})` : ''}
            </button>
          </div>
        </header>

        <div className="notifications-body">
          <div className="notifications-panel">
            <div className="notifications-toolbar">
              <label className="notifications-search">
                <Search size={15} aria-hidden="true" />
                <input
                  type="search"
                  placeholder={t('notifications.search')}
                  aria-label={t('notifications.search')}
                  value={query}
                  onChange={updateSearch}
                />
              </label>
              <label className="notifications-show">
                <span>{t('notifications.show')}</span>
                <select
                  value={pageSize}
                  aria-label={t('notifications.rowsPerPage')}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                >
                  {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            </div>

            <div className="notifications-table-scroll">
              <table className="notifications-table">
                <thead>
                  <tr>
                    <th className="notifications-index">
                      <span><ListOrdered size={12} /> #</span>
                    </th>
                    <th className="notifications-message-heading">{t('notifications.columns.notification')}</th>
                    <th>{t('notifications.columns.type')}</th>
                    <th>{t('notifications.columns.status')}</th>
                    <th>{t('notifications.columns.receivedAt')}</th>
                    <th className="notifications-actions-heading">{t('notifications.columns.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 ? (
                    <tr>
                      <td className="notifications-empty" colSpan={6}>
                        <div className="notifications-empty-content">
                          <span className="notifications-empty-icon"><Bell size={19} /></span>
                          <p>{filter === 'unread' ? t('notifications.noUnread') : t('notifications.noResults')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : visibleRows.map((notification, index) => {
                    const read = isRead(notification);
                    const title = notification.title || notification.message || notification.body || t('notifications.fallbackTitle');
                    return (
                      <tr key={notification.id ?? `${title}-${index}`}>
                        <td className="notifications-index">{start + index + 1}</td>
                        <td className="notifications-message">{title}</td>
                        <td>{notification.type || 'General'}</td>
                        <td>
                          <span className={`notifications-status${read ? ' is-read' : ' is-unread'}`}>
                            {read ? t('notifications.read') : t('notifications.unreadStatus')}
                          </span>
                        </td>
                        <td className="notifications-date">
                          {formatReceivedAt(
                            notification.receivedAt || notification.createdAt || notification.timestamp,
                            i18n.language?.startsWith('bn') ? 'bn-BD' : 'en-GB'
                          )}
                        </td>
                        <td className="notifications-actions">
                          {!read && notification.id != null && (
                            <button
                              type="button"
                              className="notifications-mark-read"
                              aria-label={t('notifications.markRead', { title })}
                              title={t('notifications.markReadTitle')}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check size={15} />
                            </button>
                          )}
                          {read && <Eye size={15} aria-label="Read" />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <footer className="notifications-footer">
              <p>
                {t('notifications.showing', { from, to, total })}
              </p>
              {totalPages > 1 && (
                <div className="notifications-pagination" aria-label="Notification pages">
                  <button
                    type="button"
                    aria-label={t('notifications.previousPage')}
                    disabled={currentPage === 1}
                    onClick={() => setPage(currentPage - 1)}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span>{t('notifications.pageOf', { page: currentPage, total: totalPages })}</span>
                  <button
                    type="button"
                    aria-label={t('notifications.nextPage')}
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(currentPage + 1)}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </footer>
          </div>
        </div>
      </section>
    </>
  );
}
