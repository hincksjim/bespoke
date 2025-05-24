import { Clock, CheckCircle, DollarSign, TrendingUp } from "lucide-react"
import "./dashboard-content.css"

export default function DashboardContent({ artisanData }) {
  // In a real app, you would fetch this data from your backend
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
      value: `${artisanData?.monthlyRevenue?.toLocaleString() || 0}`,
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

  // Recent quotes would come from your backend
  const recentQuotes = artisanData?.recentQuotes || []

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

      {/* Recent Quotes */}
      <div className="recent-quotes-card">
        <div className="recent-quotes-header">
          <h3 className="recent-quotes-title">Recent Quote Requests</h3>
        </div>

        <div className="recent-quotes-list">
          {recentQuotes.length > 0 ? (
            recentQuotes.map((quote) => (
              <div key={quote.id} className="recent-quote-item">
                <div className="recent-quote-details">
                  <p className="recent-quote-client">{quote.clientName}</p>
                  <p className="recent-quote-description">{quote.description}</p>
                </div>
                <div className="recent-quote-meta">
                  <p className="recent-quote-value">${quote.estimatedValue}</p>
                  <p className="recent-quote-date">{new Date(quote.requestDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="recent-quotes-empty">No recent quote requests found.</div>
          )}
        </div>

        <div className="recent-quotes-footer">
          <button className="view-all-button">View all quote requests →</button>
        </div>
      </div>
    </div>
  )
}
