export default function LoadingSpinner({ message = "Loading data..." }) {
  return (
    <div className="spinner-overlay">
      <div className="spinner" aria-label="Loading" role="status" />
      <p className="spinner-text">{message}</p>
    </div>
  );
}