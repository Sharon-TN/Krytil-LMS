import React from 'react';
import { SunIcon, MoonIcon, XIcon, StarIcon } from '../icons/Icons';
import { ToastMessage } from '../../types';

export const Badge: React.FC<{
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'neutral';
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'primary', children, className = '' }) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
};

export const Button: React.FC<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  children,
  className = '',
  style,
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const widthClass = fullWidth ? 'btn-full' : '';
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={`btn btn-${variant} ${sizeClass} ${widthClass} ${className}`}
    >
      {icon && <span className="btn-icon-slot">{icon}</span>}
      {children}
    </button>
  );
};

export const ThemeToggle: React.FC<{
  theme: 'light' | 'dark';
  onToggle: () => void;
}> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="theme-toggle-btn"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
    </button>
  );
};

export const ProgressBar: React.FC<{
  progress: number;
  showLabel?: boolean;
  className?: string;
}> = ({ progress = 0, showLabel = false, className = '' }) => {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div className={`course-progress-container ${className}`}>
      {showLabel && (
        <div className="progress-label-row">
          <span>Progress</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
};

export const RatingStars: React.FC<{
  rating: number;
  reviewsCount?: number;
}> = ({ rating, reviewsCount }) => {
  return (
    <div className="course-meta-item">
      <StarIcon size={14} color="#f59e0b" filled />
      <strong style={{ color: 'var(--navy)', marginLeft: '2px' }}>{rating.toFixed(1)}</strong>
      {reviewsCount !== undefined && <span>({reviewsCount})</span>}
    </div>
  );
};

export const StatCardUI: React.FC<{
  title: string;
  value: string | number;
  delta?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  colorBg?: string;
  colorText?: string;
}> = ({
  title,
  value,
  delta,
  isPositive = true,
  icon,
  colorBg = 'var(--primary-soft)',
  colorText = 'var(--primary)',
}) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <span className="stat-value">{value}</span>
        {delta && (
          <span className={`stat-delta ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '↑' : '↓'} {delta}
          </span>
        )}
      </div>
      <div className="stat-icon-wrap" style={{ backgroundColor: colorBg, color: colorText }}>
        {icon}
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}> = ({ isOpen, title, onClose, children, footer, wide = false }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-container ${wide ? 'wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <XIcon size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.875rem' }}>{toast.title}</strong>
            {toast.message && <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{toast.message}</span>}
          </div>
          <button className="btn-ghost btn-sm" onClick={() => onRemove(toast.id)}>
            <XIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
