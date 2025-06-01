"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { useNavigate } from "react-router-dom"
import { generateClient } from 'aws-amplify/api'
import { listCreations } from '../graphql/queries'

// Import Lucide React Icons
import { LayoutDashboard, Inbox, Reply, CheckCircle, XCircle, Settings, LogOut, CreditCard } from "lucide-react"

// Import Components
import QuoteRequestsList from "./quote-requests-list"
import ProfileSettings from "./profile-settings"  
import SubscriptionContent from "./subscription-content"
import DashboardContent from "./dashboard-content"
import "./artisan-console.css" // Import the CSS file

const client = generateClient()

// Helper function to calculate growth rate based on historical data
const calculateGrowthRate = (quotes) => {
  if (!Array.isArray(quotes) || quotes.length === 0) return 0

  const currentMonth = new Date().getMonth()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1

  const currentMonthQuotes = quotes.filter(
    (q) => q.status === "Completed" && new Date(q.completionDate || getQuoteDate(q)).getMonth() === currentMonth,
  ).length

  const lastMonthQuotes = quotes.filter(
    (q) => q.status === "Completed" && new Date(q.completionDate || getQuoteDate(q)).getMonth() === lastMonth,
  ).length

  if (lastMonthQuotes === 0) return currentMonthQuotes > 0 ? 100 : 0

  return Math.round(((currentMonthQuotes - lastMonthQuotes) / lastMonthQuotes) * 100)
}

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    return date.toLocaleDateString()
  } catch (e) {
    return "Invalid Date"
  }
}

// Helper function to get the creation date from quote
// Fixed to use createdAt as the primary date field
const getQuoteDate = (quote) => {
  return quote.createdAt || quote.updatedAt || null
}

// --- Sub-Components ---

// Sidebar Component
// This component renders the sidebar navigation menu for the artisan dashboard. It includes links to different sections such as Dashboard Overview, New Quotes, Responded Quotes, etc.
// It also provides options for profile settings and logout.
const Sidebar = ({ artisanName, activeSection, setActiveSection, onSignOut }) => {
  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "quote-requests", label: "Quote Requests", icon: Inbox },
    { id: "responded", label: "Responded Quotes", icon: Reply },
    { id: "accepted", label: "Accepted/Won Quotes", icon: CheckCircle },
    { id: "rejected", label: "Rejected/Lost Quotes", icon: XCircle },
    { id: "subscription", label: "Manage Subscription", icon: CreditCard },
  ]

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile">
        {/* Placeholder for profile picture */}
        <div className="profile-picture-placeholder" aria-hidden="true"></div>
        <span className="artisan-name">{artisanName || "Artisan Name"}</span>
      </div>
      <nav className="sidebar-nav" aria-label="Dashboard Navigation">
        <ul>
          {navItems.map((item) => {
            const IconComponent = item.icon // Get the icon component
            return (
              <li key={item.id}>
                <button
                  className={`nav-button ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  title={item.label} // Add title for tooltip on collapsed view
                >
                  {/* Render Lucide icon component */}
                  <IconComponent className="nav-icon" aria-hidden="true" size={20} />
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="sidebar-footer-nav">
        <button
          className="nav-button settings-button"
          onClick={() => setActiveSection("settings")}
          title="Profile Settings"
        >
          <Settings className="nav-icon" aria-hidden="true" size={20} />
          <span className="nav-label">Profile Settings</span>
        </button>
        <button className="nav-button logout-button" onClick={onSignOut} title="Logout">
          <LogOut className="nav-icon" aria-hidden="true" size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  )
}

// Header Component
// This component renders the header of the artisan dashboard. It includes a theme toggle button and optional sign-out functionality.
const Header = ({ theme, toggleTheme, onSignOut }) => {
  // Mock data for selectors

  return (
    <header className="dashboard-header">
      <div className="header-controls">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "Dark Theme🌙" : "Light Theme☀️"}
        </button>

        {/* Sign Out Button (Optional placement, also in sidebar) */}
        {/* <button onClick={onSignOut} className="header-signout-button">Sign Out</button> */}
      </div>
    </header>
  )
}

// Footer Component
// This component renders the footer of the artisan dashboard. It includes links to the Terms & Conditions and Privacy Policy pages, as well as copyright information.
const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="dashboard-footer">
      <a href="/terms" target="_blank" rel="noopener noreferrer">
        Terms & Conditions
      </a>
      <span> | </span>
      <a href="/privacy" target="_blank" rel="noopener noreferrer">
        Privacy Policy
      </a>
      <p>&copy; {currentYear} Elegance Jewellery. All rights reserved.</p>
    </footer>
  )
}

// Metric Card Component
// This reusable component displays a single metric with a title, value, and optional description. It is used in the Dashboard Overview to show key statistics.
const MetricCard = ({ title, value, description }) => (
  <div className="metric-card">
    <h3>{title}</h3>
    <p className="metric-value">{value}</p>
    {description && <p className="metric-description">{description}</p>}
  </div>
)

// Dashboard Overview Component
// This component provides an overview of the artisan's dashboard, including metrics like total quotes received, response rate, and success rate.
// It also displays the latest new quote requests and a placeholder for a quote status distribution chart.
const DashboardOverview = ({ quotes, setActiveSection }) => {
  const totalQuotes = quotes.length
  const respondedQuotes = quotes.filter(
    (q) => q.status === "Responded" || q.status === "Accepted" || q.status === "Rejected",
  ).length
  const acceptedQuotes = quotes.filter((q) => q.status === "Accepted").length

  const responseRate = totalQuotes > 0 ? ((respondedQuotes / totalQuotes) * 100).toFixed(1) : 0
  const successRate = respondedQuotes > 0 ? ((acceptedQuotes / respondedQuotes) * 100).toFixed(1) : 0

  // Get latest 5 new quote requests, sorted by creation date (most recent first)
  const latestRequests = quotes
    .filter((q) => q.status === "New" || q.submittedforquote === true)
    .sort((a, b) => {
      const dateA = new Date(getQuoteDate(a))
      const dateB = new Date(getQuoteDate(b))
      return dateB - dateA // Most recent first
    })
    .slice(0, 5) // Show latest 5

  // Placeholder for chart data calculation
  const statusCounts = quotes.reduce((acc, quote) => {
    const status = quote.status || (quote.submittedforquote ? "New" : "Unknown")
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  return (
    <div className="dashboard-overview">
      <h2>Dashboard Overview</h2>
      <div className="metrics-grid">
        <MetricCard title="Total Quotes Received" value={totalQuotes} />
        <MetricCard
          title="Response Rate"
          value={`${responseRate}%`}
          description="Based on responded, accepted, rejected"
        />
        <MetricCard title="Success Rate" value={`${successRate}%`} description="Based on accepted vs responded" />
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
                      {formatDate(getQuoteDate(quote))}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      /* Implement view details logic */ alert(`Viewing details for ${quote.id}`)
                    }}
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
          {/* Placeholder for actual chart implementation (e.g., using Chart.js, Recharts) */}
          <div className="chart-placeholder" aria-label="Quote status distribution chart placeholder">
            Chart Placeholder
            <pre>{JSON.stringify(statusCounts, null, 2)}</pre> {/* Display data for now */}
          </div>
        </div>
      </div>
    </div>
  )
}

// Quote List Component (Reusable)
// This reusable component renders a list of quotes with filtering, sorting, and search functionalities.
// It also includes action buttons for managing individual quotes, such as responding or viewing details.
const QuoteList = ({ quotes, sectionTitle, isLoading, error }) => {
  const [filteredQuotes, setFilteredQuotes] = useState(quotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ type: "All", dateRange: "", status: "All", location: "" })
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" })

  // Memoize quote types for filter dropdown - use actual quotes data instead of MOCK_QUOTES
  const quoteTypes = useMemo(() => ["All", ...new Set(quotes.map((q) => q.type || q.jewellrytype).filter(Boolean))], [quotes])
  const quoteStatuses = useMemo(() => ["All", ...new Set(quotes.map((q) => q.status || (q.submittedforquote ? "New" : "Unknown")).filter(Boolean))], [quotes])

  // Filtering Logic
  useEffect(() => {
    let result = quotes

    // Search
    if (searchTerm) {
      result = result.filter(
        (quote) =>
          (quote.clientName && quote.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.clientID && quote.clientID.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.prompt && quote.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.jewellrytype && quote.jewellrytype.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.clientLocation && quote.clientLocation.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filters
    if (filters.type !== "All") {
      result = result.filter((quote) => (quote.type || quote.jewellrytype) === filters.type)
    }
    if (filters.status !== "All") {
      result = result.filter((quote) => (quote.status || (quote.submittedforquote ? "New" : "Unknown")) === filters.status)
    }
    if (filters.location) {
      result = result.filter((quote) => quote.clientLocation && quote.clientLocation.toLowerCase().includes(filters.location.toLowerCase()))
    }
    // Add date range filter logic here if needed

    setFilteredQuotes(result)
  }, [quotes, searchTerm, filters])

  // Sorting Logic
  const sortedQuotes = useMemo(() => {
    const sortableItems = [...filteredQuotes]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Handle date sorting - use createdAt as primary date field
        if (sortConfig.key === "createdAt" || sortConfig.key === "updatedAt") {
          aValue = new Date(getQuoteDate(a))
          bValue = new Date(getQuoteDate(b))
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredQuotes, sortConfig])

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortDirectionClass = (key) => {
    if (sortConfig.key !== key) return ""
    return sortConfig.direction === "ascending" ? "sort-asc" : "sort-desc"
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Action Button Handler (Example)
  const handleAction = (action, quoteId) => {
    alert(`${action} action triggered for quote ${quoteId}`)
    // Add actual logic here (e.g., navigate to detail page, open modal)
  }

  if (isLoading) return <div className="loading-state">Loading quotes...</div>
  if (error) return <div className="error-state">Error loading quotes: {error.message || "Please try again."}</div>

  return (
    <div className="quote-list-section">
      <h2>{sectionTitle}</h2>

      {/* Search and Filters */}
      <div className="filters-container">
        <input
          type="search"
          placeholder="Search quotes (client, requirements, location)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search quotes"
          className="search-input"
        />
        <div className="filter-controls">
          <select name="type" value={filters.type} onChange={handleFilterChange} aria-label="Filter by quote type">
            {quoteTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            aria-label="Filter by quote status"
          >
            {quoteStatuses.map((status) => (
              <option key={status} value={status}>
                {status === "All" ? "All Statuses" : status}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="location"
            placeholder="Filter by Location"
            value={filters.location}
            onChange={handleFilterChange}
            aria-label="Filter by client location"
          />
          {/* Add Date Range Picker Here */}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="table-responsive">
        <table className="quotes-table" aria-live="polite">
          <thead>
            <tr>
              <th
                scope="col"
                onClick={() => requestSort("clientName")}
                className={`sortable ${getSortDirectionClass("clientName")}`}
                aria-sort={sortConfig.key === "clientName" ? sortConfig.direction : "none"}
              >
                Client Details <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("prompt")}
                className={`sortable ${getSortDirectionClass("prompt")}`}
                aria-sort={sortConfig.key === "prompt" ? sortConfig.direction : "none"}
              >
                Requirements <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("createdAt")}
                className={`sortable ${getSortDirectionClass("createdAt")}`}
                aria-sort={sortConfig.key === "createdAt" ? sortConfig.direction : "none"}
              >
                Created Date <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("status")}
                className={`sortable ${getSortDirectionClass("status")}`}
                aria-sort={sortConfig.key === "status" ? sortConfig.direction : "none"}
              >
                Status <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuotes.length > 0 ? (
              sortedQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td data-label="Client Details">
                    {quote.clientName || quote.clientID} ({quote.clientLocation || "Location not specified"})
                  </td>
                  <td data-label="Requirements">{quote.prompt || quote.jewellrytype || "Not specified"}</td>
                  <td data-label="Created Date">{formatDate(quote.createdAt)}</td>
                  <td data-label="Status">
                    <span className={`status-badge status-${(quote.status || (quote.submittedforquote ? "new" : "unknown")).toLowerCase()}`}>
                      {quote.status || (quote.submittedforquote ? "New" : "Unknown")}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons-group">
                      {(!quote.status || quote.status === "New" || quote.submittedforquote) && (
                        <button onClick={() => handleAction("Respond", quote.id)} className="action-button respond">
                          Respond
                        </button>
                      )}
                      <button onClick={() => handleAction("View Details", quote.id)} className="action-button view">
                        Details
                      </button>
                      {/* Add other relevant actions based on status */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No quotes found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Enhanced Quote Requests List Component specifically for new quote requests
const EnhancedQuoteRequestsList = ({ quotes, isLoading, error }) => {
  const [filteredQuotes, setFilteredQuotes] = useState(quotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ type: "All", material: "All", location: "" })
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" })

  // Filter to only show submitted quotes (submittedforquote: true)
  const submittedQuotes = useMemo(() => {
    return quotes.filter(quote => quote.submittedforquote === true)
  }, [quotes])

  // Memoize filter options based on submitted quotes
  const quoteTypes = useMemo(() => {
    const types = submittedQuotes.map(q => q.jewellrytype || q.type).filter(Boolean)
    return ["All", ...new Set(types)]
  }, [submittedQuotes])

  const materials = useMemo(() => {
    const mats = submittedQuotes.map(q => q.material).filter(Boolean)
    return ["All", ...new Set(mats)]
  }, [submittedQuotes])

  // Filtering Logic
  useEffect(() => {
    let result = submittedQuotes

    // Search
    if (searchTerm) {
      result = result.filter(
        (quote) =>
          (quote.clientName && quote.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.clientID && quote.clientID.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.prompt && quote.prompt.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.jewellrytype && quote.jewellrytype.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.material && quote.material.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (quote.clientLocation && quote.clientLocation.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filters
    if (filters.type !== "All") {
      result = result.filter((quote) => (quote.jewellrytype || quote.type) === filters.type)
    }
    if (filters.material !== "All") {
      result = result.filter((quote) => quote.material === filters.material)
    }
    if (filters.location) {
      result = result.filter((quote) => quote.clientLocation && quote.clientLocation.toLowerCase().includes(filters.location.toLowerCase()))
    }

    setFilteredQuotes(result)
  }, [submittedQuotes, searchTerm, filters])

  // Sorting Logic
  const sortedQuotes = useMemo(() => {
    const sortableItems = [...filteredQuotes]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

        // Handle date sorting
        if (sortConfig.key === "createdAt") {
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredQuotes, sortConfig])

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortDirectionClass = (key) => {
    if (sortConfig.key !== key) return ""
    return sortConfig.direction === "ascending" ? "sort-asc" : "sort-desc"
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleViewDetails = (quoteId) => {
    alert(`Viewing details for quote ${quoteId}`)
    // Implement navigation to detailed view
  }

  if (isLoading) return <div className="loading-state">Loading quote requests...</div>
  if (error) return <div className="error-state">Error loading quotes: {error.message || "Please try again."}</div>

  return (
    <div className="quote-requests-section">
      <h2>Quote Requests ({submittedQuotes.length} total)</h2>

      {/* Search and Filters */}
      <div className="filters-container">
        <input
          type="search"
          placeholder="Search by type, material, stone, or style..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search quote requests"
          className="search-input"
        />
        <div className="filter-controls">
          <select name="type" value={filters.type} onChange={handleFilterChange} aria-label="Filter by jewelry type">
            {quoteTypes.map((type) => (
              <option key={type} value={type}>
                {type === "All" ? "All Types" : type}
              </option>
            ))}
          </select>
          <select name="material" value={filters.material} onChange={handleFilterChange} aria-label="Filter by material">
            {materials.map((material) => (
              <option key={material} value={material}>
                {material === "All" ? "All Materials" : material}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="location"
            placeholder="Filter by Location"
            value={filters.location}
            onChange={handleFilterChange}
            aria-label="Filter by client location"
          />
        </div>
      </div>

      {/* Quote Requests Table */}
      <div className="table-responsive">
        <table className="quotes-table" aria-live="polite">
          <thead>
            <tr>
              <th scope="col">Image</th>
              <th
                scope="col"
                onClick={() => requestSort("jewellrytype")}
                className={`sortable ${getSortDirectionClass("jewellrytype")}`}
                aria-sort={sortConfig.key === "jewellrytype" ? sortConfig.direction : "none"}
              >
                Type <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("createdAt")}
                className={`sortable ${getSortDirectionClass("createdAt")}`}
                aria-sort={sortConfig.key === "createdAt" ? sortConfig.direction : "none"}
              >
                Created Date <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("material")}
                className={`sortable ${getSortDirectionClass("material")}`}
                aria-sort={sortConfig.key === "material" ? sortConfig.direction : "none"}
              >
                Material <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th scope="col">Details</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQuotes.length > 0 ? (
              sortedQuotes.map((quote) => (
                <tr key={quote.id}>
                  <td data-label="Image">
                    {quote.imageUrl ? (
                      <img 
                        src={quote.imageUrl} 
                        alt={`${quote.jewellrytype || 'Jewelry'} design`}
                        className="quote-image-thumbnail"
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      <div className="no-image-placeholder" style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                        No Image
                      </div>
                    )}
                  </td>
                  <td data-label="Type">{quote.jewellrytype || quote.type || "Not specified"}</td>
                  <td data-label="Created Date">{formatDate(quote.createdAt)}</td>
                  <td data-label="Material">{quote.material || "Not specified"}</td>
                  <td data-label="Details">
                    <div className="quote-details">
                      {quote.stone && <div><strong>Stone:</strong> {quote.stone}</div>}
                      {quote.style && <div><strong>Style:</strong> {quote.style}</div>}
                      {quote.prompt && <div><strong>Description:</strong> {quote.prompt.substring(0, 50)}...</div>}
                    </div>
                  </td>
                  <td data-label="Actions">
                    <button 
                      onClick={() => handleViewDetails(quote.id)} 
                      className="action-button view"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No quote requests found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


// --- Main Artisan Console Component ---
//
// This component serves as the main console for artisans.
// It displays quotes, subscription options, and navigation links for managing artisan-related tasks.
const ArtisanConsole = ({ signOut }) => {
  const [artisanLoading, setArtisanLoading] = useState(true)
  const [userAttributes, setUserAttributes] = useState({})
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState("overview") // Default section
  const [theme, setTheme] = useState("light") // 'light' or 'dark'

  // GraphQL data fetching state for quotes
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quotesError, setQuotesError] = useState(null)
  const [allQuotes, setAllQuotes] = useState([]) // Holds all quotes fetched

  const { authStatus, user } = useAuthenticator((context) => [context.authStatus, context.user])

  // Fetch quotes from GraphQL
  const fetchQuotes = useCallback(async () => {
    if (!user) {
      console.error('No user is authenticated')
      return
    }

    setQuotesLoading(true)
    setQuotesError(null)

    try {
      const response = await client.graphql({
        query: listCreations,
        variables: { 
          filter: { 
            submittedforquote: { eq: true }
          } 
        }
      })

      console.log('GraphQL Response:', response) // Debug log

      if (response.data && response.data.listCreations && response.data.listCreations.items) {
        console.log('Fetched quotes:', response.data.listCreations.items) // Debug log
        setAllQuotes(response.data.listCreations.items)
      } else {
        console.error('Unexpected response format:', JSON.stringify(response, null, 2))
        setAllQuotes([])
      }
    } catch (err) {
      console.error('Error fetching quotes:', err)
      setQuotesError(err)
      setAllQuotes([])
    } finally {
      setQuotesLoading(false)
    }
  }, [user])

  // Fetch User Attributes
  useEffect(() => {
    const getUserAttributes = async () => {
      setArtisanLoading(true)
      setError(null)
      console.log("Fetching user attributes...", userAttributes)
      if (!authStatus || authStatus !== "authenticated") {
        console.warn("User is not authenticated, skipping user attributes fetch")
        setArtisanLoading(false)
        return
      }

      try {
        // TODO: Replace with real user attributes fetching
        setUserAttributes({
          given_name: "Artisan",
          family_name: "User",
          email: user?.signInDetails?.loginId || "artisan@example.com",
        })
      } catch (err) {
        console.error("Error fetching user attributes:", err)
        setError(err)
      } finally {
        setArtisanLoading(false)
      }
    }
    getUserAttributes()
  }, [authStatus, user])

  // Fetch quotes when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchQuotes()
    }
  }, [user, fetchQuotes])

  // Filter quotes based on active section
  const quotesForSection = useMemo(() => {
    switch (activeSection) {
      case "responded":
        return allQuotes.filter((q) => q.status === "Responded")
      case "accepted":
        return allQuotes.filter((q) => q.status === "Accepted")
      case "rejected":
        return allQuotes.filter((q) => q.status === "Rejected")
      case "quote-requests":
        return allQuotes.filter((q) => q.submittedforquote === true)
      default:
        return allQuotes // For overview or other sections
    }
  }, [activeSection, allQuotes])

  // Theme Toggling
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }, [])

  useEffect(() => {
    document.body.className = theme + "-theme" // Apply theme class to body
    return () => {
      document.body.className = "" // Clean up on unmount
    }
  }, [theme])

  // Render Logic
  if (artisanLoading) {
    return <div className="loading">Loading Artisan Console...</div>
  }

  if (error) {
    return (
      <div className="error-state">
        Error loading dashboard: {error.message}. Please try signing out and back in.{" "}
        <button onClick={signOut}>Sign Out</button>
      </div>
    )
  }

  // Determine artisan name for sidebar
  const artisanName = userAttributes.given_name || userAttributes.email || "Artisan"

  return (
    <div className={`artisan-dashboard-container ${theme}-theme`}>
      <Sidebar
        artisanName={artisanName}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onSignOut={signOut}
      />
      <div className="main-content-area">
        <Header theme={theme} toggleTheme={toggleTheme} onSignOut={signOut} />
        <main className="dashboard-content">
          {activeSection === "overview" && (
            <DashboardOverview
              quotes={allQuotes}
              setActiveSection={setActiveSection}
            />
          )}
          {activeSection === "quote-requests" && (
            <EnhancedQuoteRequestsList
              quotes={quotesForSection}
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "responded" && (
            <QuoteList
              quotes={quotesForSection}
              sectionTitle="Responded Quotes"
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "accepted" && (
            <QuoteList
              quotes={quotesForSection}
              sectionTitle="Accepted/Won Quotes"
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "rejected" && (
            <QuoteList
              quotes={quotesForSection}
              sectionTitle="Rejected/Lost Quotes"
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "subscription" && <SubscriptionContent />}
          {activeSection === "settings" && <ProfileSettings userAttributes={userAttributes} />}
        </main>
      </div>
    </div>
  )
}

export default ArtisanConsole
