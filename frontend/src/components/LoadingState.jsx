export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  )
}
