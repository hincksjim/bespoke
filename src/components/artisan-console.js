"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useAuthenticator } from "@aws-amplify/ui-react"
import { useNavigate } from "react-router-dom"

// Import Lucide React Icons
import { LayoutDashboard, Inbox, Reply, CheckCircle, XCircle, Settings, LogOut, CreditCard } from "lucide-react"

import SubscriptionContent from "./subscription-content"
import "./artisan-console.css" // Import the CSS file

// --- Mock Data ---
const MOCK_QUOTES = [
  {
    id: "q1",
    clientName: "Alice Smith",
    clientLocation: "London, UK",
    requirements: "Custom gold ring with diamond",
    submissionDate: "2024-04-28",
    status: "New",
    type: "Ring",
  },
  {
    id: "q2",
    clientName: "Bob Johnson",
    clientLocation: "New York, USA",
    requirements: "Silver necklace repair",
    submissionDate: "2024-04-27",
    status: "Responded",
    type: "Repair",
  },
  {
    id: "q3",
    clientName: "Charlie Brown",
    clientLocation: "Paris, FR",
    requirements: "Engraved platinum bracelet",
    submissionDate: "2024-04-26",
    status: "Accepted",
    type: "Bracelet",
  },
  {
    id: "q4",
    clientName: "Diana Prince",
    clientLocation: "Berlin, DE",
    requirements: "Bespoke earrings, emeralds",
    submissionDate: "2024-04-25",
    status: "Rejected",
    type: "Earrings",
  },
  {
    id: "q5",
    clientName: "Ethan Hunt",
    clientLocation: "Rome, IT",
    requirements: "Watch strap replacement",
    submissionDate: "2024-04-29",
    status: "New",
    type: "Watch",
  },
  {
    id: "q6",
    clientName: "Fiona Glenanne",
    clientLocation: "Manchester, UK",
    requirements: "Gold pendant design",
    submissionDate: "2024-04-24",
    status: "Accepted",
    type: "Pendant",
  },
  {
    id: "q7",
    clientName: "George Costanza",
    clientLocation: "Los Angeles, USA",
    requirements: "Resize silver ring",
    submissionDate: "2024-04-23",
    status: "Responded",
    type: "Ring",
  },
  {
    id: "q8",
    clientName: "Hannah Abbott",
    clientLocation: "Sydney, AU",
    requirements: "Pearl necklace restringing",
    submissionDate: "2024-04-30",
    status: "New",
    type: "Necklace",
  },
]

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString()
  } catch (e) {
    return "Invalid Date"
  }
}

// --- Sub-Components ---

// Sidebar Component
// This component renders the sidebar navigation menu for the artisan dashboard. It includes links to different sections such as Dashboard Overview, New Quotes, Responded Quotes, etc.
// It also provides options for profile settings and logout.
const Sidebar = ({ artisanName, activeSection, setActiveSection, onSignOut }) => {  const navItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "new", label: "New Quote Requests", icon: Inbox },
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

  const latestRequests = quotes
    .filter((q) => q.status === "New")
    .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
    .slice(0, 5) // Show latest 5

  // Placeholder for chart data calculation
  const statusCounts = quotes.reduce((acc, quote) => {
    acc[quote.status] = (acc[quote.status] || 0) + 1
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
                  <span>
                    {quote.clientName} - {quote.requirements.substring(0, 30)}...
                  </span>
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
          <button className="view-all-button" onClick={() => setActiveSection("new")}>
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
  const [sortConfig, setSortConfig] = useState({ key: "submissionDate", direction: "descending" })

  // Memoize quote types for filter dropdown
  const quoteTypes = useMemo(() => ["All", ...new Set(MOCK_QUOTES.map((q) => q.type))], [])
  const quoteStatuses = useMemo(() => ["All", ...new Set(MOCK_QUOTES.map((q) => q.status))], [])

  // Filtering Logic
  useEffect(() => {
    let result = quotes

    // Search
    if (searchTerm) {
      result = result.filter(
        (quote) =>
          quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.requirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quote.clientLocation.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filters
    if (filters.type !== "All") {
      result = result.filter((quote) => quote.type === filters.type)
    }
    if (filters.status !== "All") {
      result = result.filter((quote) => quote.status === filters.status)
    }
    if (filters.location) {
      result = result.filter((quote) => quote.clientLocation.toLowerCase().includes(filters.location.toLowerCase()))
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

        // Handle date sorting
        if (sortConfig.key === "submissionDate") {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
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
                onClick={() => requestSort("requirements")}
                className={`sortable ${getSortDirectionClass("requirements")}`}
                aria-sort={sortConfig.key === "requirements" ? sortConfig.direction : "none"}
              >
                Requirements <span className="sort-indicator" aria-hidden="true"></span>
              </th>
              <th
                scope="col"
                onClick={() => requestSort("submissionDate")}
                className={`sortable ${getSortDirectionClass("submissionDate")}`}
                aria-sort={sortConfig.key === "submissionDate" ? sortConfig.direction : "none"}
              >
                Submitted <span className="sort-indicator" aria-hidden="true"></span>
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
                    {quote.clientName} ({quote.clientLocation})
                  </td>
                  <td data-label="Requirements">{quote.requirements}</td>
                  <td data-label="Submitted">{formatDate(quote.submissionDate)}</td>
                  <td data-label="Status">
                    <span className={`status-badge status-${quote.status.toLowerCase()}`}>{quote.status}</span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons-group">
                      {quote.status === "New" && (
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

// Placeholder Settings Component
const ProfileSettings = ({ userAttributes }) => {
  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <p>Manage your profile information here.</p>
      <div className="profile-info">
        <p>
          <strong>Name:</strong> {userAttributes?.given_name} {userAttributes?.family_name}
        </p>
        <p>
          <strong>Email:</strong> {userAttributes?.email}
        </p>
        {/* Add more fields and edit functionality as needed */}
      </div>
      <button className="action-button">Edit Profile</button> {/* Placeholder */}
    </div>
  )
}

// --- Main Artisan Console Component ---
// This component serves as the main console for artisans.
// It displays quotes, subscription options, and navigation links for managing artisan-related tasks.
const ArtisanConsole = ({ signOut }) => {
  const [artisanLoading, setArtisanLoading] = useState(true)
  const [userAttributes, setUserAttributes] = useState({})
  const [error, setError] = useState(null)
  const [activeSection, setActiveSection] = useState("overview") // Default section
  const [theme, setTheme] = useState("light") // 'light' or 'dark'

  // Mock data fetching state for quotes
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quotesError, setQuotesError] = useState(null)
  const [allQuotes, setAllQuotes] = useState([]) // Holds all quotes fetched

  const { authStatus } = useAuthenticator((context) => [context.authStatus])

  // Fetch User Attributes
  useEffect(() => {
    const getUserAttributes = async () => {
      setArtisanLoading(true)
      setError(null)
      try {
        // MOCK USER ATTRIBUTES FOR TESTING UI W/O ACTUAL AUTH
        setUserAttributes({
          given_name: "Artisan",
          family_name: "User",
          email: "artisan@example.com",
        })
      } catch (err) {
        console.error("Error fetching user attributes:", err)
        setError(err)
      } finally {
        setArtisanLoading(false)
      }
    }
    getUserAttributes()
  }, [authStatus])

  // Mock Fetch Quotes Data
  useEffect(() => {
    setQuotesLoading(true)
    setQuotesError(null)
    // Simulate API call
    const timer = setTimeout(() => {
      try {
        // Simulate success
        setAllQuotes(MOCK_QUOTES)
        setQuotesLoading(false)
      } catch (err) {
        setQuotesError(err)
        setQuotesLoading(false)
      }
    }, 1500) // Simulate network delay

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, []) // Fetch once on component mount

  // Filter quotes based on active section
  const quotesForSection = useMemo(() => {
    switch (activeSection) {
      case "new":
        return allQuotes.filter((q) => q.status === "New")
      case "responded":
        return allQuotes.filter((q) => q.status === "Responded")
      case "accepted":
        return allQuotes.filter((q) => q.status === "Accepted")
      case "rejected":
        return allQuotes.filter((q) => q.status === "Rejected")
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
          {activeSection === "overview" && <DashboardOverview quotes={allQuotes} setActiveSection={setActiveSection} />}
          {activeSection === "new" && (
            <QuoteList
              quotes={quotesForSection}
              sectionTitle="New Quote Requests"
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
          )}          {activeSection === "rejected" && (
            <QuoteList
              quotes={quotesForSection}
              sectionTitle="Rejected/Lost Quotes"
              isLoading={quotesLoading}
              error={quotesError}
            />
          )}
          {activeSection === "subscription" && <SubscriptionContent />}
          {activeSection === "settings" && <ProfileSettings userAttributes={userAttributes} />}
          {/* Add other sections as needed */}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default ArtisanConsole
