export function ErrorMessage({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-banner" role="alert">
      <div className="error-icon">⚠️</div>
      <div className="error-body">
        <p className="error-message">{message}</p>
        {onRetry && (
          <button className="error-retry-btn" onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
