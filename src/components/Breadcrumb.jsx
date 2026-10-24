import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Home } from 'lucide-react';
import '../styles/breadcrumb.css';


export default function Breadcrumb({ label, icon: Icon, parents = [] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="breadcrumb-wrap">
      <div className="breadcrumb-bar">
        <button
          type="button"
          className="breadcrumb-back"
          onClick={() => navigate(-1)}
          aria-label={t('breadcrumb.back')}
        >
          <ArrowLeft size={16} />
        </button>

        <nav aria-label={t('breadcrumb.ariaLabel')} className="breadcrumb-nav">
          <ol className="breadcrumb-list">
            <li className="breadcrumb-item">
              <ChevronRight size={16} className="breadcrumb-sep" />
              <Link to="/" className="breadcrumb-link">
                <Home size={14} />
                <span className="breadcrumb-home-text">{t('breadcrumb.home')}</span>
              </Link>
            </li>

            {parents.map((parent) => {
              const ParentIcon = parent.icon;
              return (
                <li className="breadcrumb-item" key={parent.to}>
                  <ChevronRight size={16} className="breadcrumb-sep" />
                  <Link to={parent.to} className="breadcrumb-link">
                    {ParentIcon && <ParentIcon size={14} />}
                    <span className="breadcrumb-home-text">{parent.label}</span>
                  </Link>
                </li>
              );
            })}

            <li className="breadcrumb-item">
              <ChevronRight size={16} className="breadcrumb-sep" />
              <span className="breadcrumb-current" aria-current="page">
                {Icon && <Icon size={14} />}
                <span>{label}</span>
              </span>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}