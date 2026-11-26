/**
 * ErrorState.jsx
 * Displays an error with optional retry action.
 */

export default function ErrorState({ error, onRetry, compact = false }) {
  const message = error?.message ?? 'An unexpected error occurred.';

  // Format 422 validation errors from FastAPI
  let details = null;
  if (error?.status === 422 && Array.isArray(error?.detail)) {
    details = error.detail.map((e, i) => (
      <li key={i}>
        <strong>{e.loc?.slice(1).join(' → ') ?? 'field'}:</strong> {e.msg}
      </li>
    ));
  }

  if (compact) {
    return (
      <div className="alert-banner error" role="alert">
        <span aria-hidden="true">⚠</span>
        <div>
          <span>{message}</span>
          {onRetry && (
            <button className="btn btn-sm btn-secondary" onClick={onRetry} style={{ marginLeft: 8 }}>
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div role="alert" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 48,
      gap: 12,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', opacity: 0.6 }} aria-hidden="true">⚠</div>
      <div style={{ fontWeight: 600, color: 'var(--color-error)' }}>Unable to load data</div>
      <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: 380 }}>
        {message}
      </div>
      {details && (
        <ul style={{ textAlign: 'left', fontSize: '0.8125rem', color: 'var(--color-error)', listStyle: 'disc', paddingLeft: 20 }}>
          {details}
        </ul>
      )}
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
