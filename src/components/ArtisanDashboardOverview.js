import React, { useMemo } from "react"
import ArtisanMetricCard from "./ArtisanMetricCard"

const ArtisanDashboardOverview = ({ quotes, setActiveSection, formatDate, getQuoteDate }) => {
  // Provide a fallback getQuoteDate function if not passed as prop
  const safeGetQuoteDate = getQuoteDate || ((quote) => {
    return quote.createdAt || quote.updatedAt || quote.dateCreated || new Date().toISOString()
  })

  const totalQuotes = quotes.length
  const respondedQuotes = quotes.filter(
    (q) => q.status === "Responded" || q.status === "Accepted" || q.status === "Rejected",
  ).length
  const acceptedQuotes = quotes.filter((q) => q.status === "Accepted").length

  const responseRate = totalQuotes > 0 ? ((respondedQuotes / totalQuotes) * 100).toFixed(1) : 0
  const successRate = respondedQuotes > 0 ? ((acceptedQuotes / respondedQuotes) * 100).toFixed(1) : 0

  const latestRequests = quotes
    .filter((q) => q.status === "New" || q.submittedforquote === true)
    .sort((a, b) => {
      const dateA = new Date(safeGetQuoteDate(a))
      const dateB = new Date(safeGetQuoteDate(b))
      return dateB - dateA
    })
    .slice(0, 5)

  const statusCounts = quotes.reduce((acc, quote) => {
    const status = quote.status || (quote.submittedforquote ? "New" : "Unknown")
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="metrics-grid">
        <ArtisanMetricCard title="Total Quotes Received" value={totalQuotes} />
        <ArtisanMetricCard
          title="Response Rate"
          value={`${responseRate}%`}
          description="Based on responded, accepted, rejected"
        />
        <ArtisanMetricCard title="Success Rate" value={`${successRate}%`} description="Based on accepted vs responded" />
      </div>

      <div className="overview-sections">
        <div className="latest-requests">
          <h3>Latest New Quote Requests</h3>
          {latestRequests.length > 0 ? (
            <ul>
              {latestRequests.map((quote) => (
                <li key={quote.id}>
                  <div className="quote-summary">
                    <span className="client-info">
                      {quote.clientName || quote.clientID} - {(quote.prompt || quote.jewellrytype || "").substring(0, 30)}...
                    </span>
                    <span className="quote-date">
                      {formatDate(safeGetQuoteDate(quote))}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Viewing details for ${quote.id}`)}
                    className="view-details-link"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No new quote requests.</p>
          )}
          <button className="view-all-button" onClick={() => setActiveSection("quote-requests")}>
            View All New Requests
          </button>
        </div>

        <div className="quote-status-chart">
          <h3>Quote Status Distribution</h3>
          <div className="chart-placeholder" aria-label="Quote status distribution chart placeholder">
            Chart Placeholder
            <pre>{JSON.stringify(statusCounts, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtisanDashboardOverview