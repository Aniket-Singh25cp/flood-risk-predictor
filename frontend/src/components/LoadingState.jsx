/**
 * LoadingState.jsx
 * Generic loading placeholder with optional message.
 */

export default function LoadingState({ message = 'Loading…', inline = false }) {
  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        {message}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </span>
    );
  }

  return (
    <div role="status" aria-label={message} style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      gap: 12,
      color: 'var(--color-text-secondary)',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="2" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span style={{ fontSize: '0.875rem' }}>{message}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
