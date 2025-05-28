// This component displays the dashboard content, including statistics and analytics for artisans.
// It shows key metrics like pending quotes, completed quotes, revenue, and growth rate.

// Import necessary icons and styles
import { Clock, CheckCircle, DollarSign, TrendingUp, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./dashboard-content.css"

export default function DashboardContent({ artisanData, setActiveSection }) {
  const navigate = useNavigate()

  const stats = [
    {
      id: "pending",
      label: "Pending Quotes",
      value: artisanData?.pendingQuotes || 0,
      icon: Clock,
      colorClass: "stat-card-yellow",
    },
    {
      id: "completed",
      label: "Completed Quotes",
      value: artisanData?.completedQuotes || 0,
      icon: CheckCircle,
      colorClass: "stat-card-green",
    },
    {
      id: "revenue",
      label: "Monthly Revenue",
      value: `£${artisanData?.monthlyRevenue?.toLocaleString() || 0}`,
      icon: DollarSign,
      colorClass: "stat-card-blue",
    },
    {
      id: "growth",
      label: "Growth Rate",
      value: `${artisanData?.growthRate || 0}%`,
      icon: TrendingUp,
      colorClass: "stat-card-purple",
    },
  ]

  // Get latest 6 quote requests sorted by date
  const latestQuotes = Array.isArray(artisanData?.recentQuotes)
    ? [...artisanData.recentQuotes]
        .sort((a, b) => new Date(b.submissionDate || '') - new Date(a.submissionDate || ''))
        .slice(0, 6)
    : []

  const handleViewDetails = (quoteId) => {
    // Navigate to quote details view
    navigate(`/artisan/quotes/${quoteId}`)
  }

  const handleViewAllQuotes = () => {
    // Switch to the quote requests section in the artisan console
    setActiveSection("quote-requests")
  }

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.id} className={`stat-card ${stat.colorClass}`}>
              <div className="stat-card-icon-container">
                <Icon className="stat-card-icon" />
              </div>
              <div className="stat-card-content">
                <p className="stat-card-label">{stat.label}</p>
                <p className="stat-card-value">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Latest Quote Requests */}
      <div className="recent-quotes-card">
        <div className="recent-quotes-header">
          <h3 className="recent-quotes-title">Latest Quote Requests</h3>
        </div>

        <div className="recent-quotes-list">
          {Array.isArray(artisanData?.recentQuotes) && artisanData.recentQuotes.length > 0 ? (
            latestQuotes.map((quote) => (
              <div key={quote.id} className="recent-quote-item">
                <div className="recent-quote-details">
                  <p className="recent-quote-client">{quote.clientName || "Anonymous Client"}</p>
                  <p className="recent-quote-description">
                    {quote.requirements && quote.requirements.length > 100
                      ? `${quote.requirements.substring(0, 100)}...`
                      : quote.requirements || "No requirements specified"}
                  </p>
                </div>
                <div className="recent-quote-meta">
                  <p className="recent-quote-value">
                    {quote.estimatedValue ? `£${quote.estimatedValue.toLocaleString()}` : "TBD"}
                  </p>
                  <p className="recent-quote-date">
                    {quote.submissionDate ? new Date(quote.submissionDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <button 
                    className="view-details-button"
                    onClick={() => handleViewDetails(quote.id)}
                    aria-label={`View details for ${quote.clientName || 'Client'}'s quote request`}
                  >
                    <Eye size={16} />
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="recent-quotes-empty">No recent quote requests found.</div>
          )}
        </div>

        <div className="recent-quotes-footer">
          <button className="view-all-button" onClick={handleViewAllQuotes}>
            View all quote requests →
          </button>
        </div>
      </div>
    </div>
  )
}
