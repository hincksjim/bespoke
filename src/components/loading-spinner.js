import "./loading-spinner.css"

// This component renders a loading spinner with a message to indicate that a process is ongoing.
// It is used to provide visual feedback to users during data loading or processing.
export default function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">Loading...</p>
    </div>
  )
}
