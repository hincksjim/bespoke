import React, { useState, useEffect, useMemo } from "react"

const ArtisanQuoteList = ({ quotes, sectionTitle, isLoading, error, formatDate, getQuoteDate }) => {
  const [filteredQuotes, setFilteredQuotes] = useState(quotes)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ type: "All", dateRange: "", status: "All", location: "" })
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "descending" })

  const quoteTypes = useMemo(() => ["All", ...new Set(quotes.map((q) => q.type || q.jewellrytype).filter(Boolean))], [quotes])
  const quoteStatuses = useMemo(() => ["All", ...new Set(quotes.map((q) => q.status || (q.submittedforquote ? "New" : "Unknown")).filter(Boolean))], [quotes])

  useEffect(() => {
    let result = quotes

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

    if (filters.type !== "All") {
      result = result.filter((quote) => (quote.type || quote.jewellrytype) === filters.type)
    }
    if (filters.status !== "All") {
      result = result.filter((quote) => (quote.status || (quote.submittedforquote ? "New" : "Unknown")) === filters.status)
    }
    if (filters.location) {
      result = result.filter((quote) => quote.clientLocation && quote.clientLocation.toLowerCase().includes(filters.location.toLowerCase()))
    }

    setFilteredQuotes(result)
  }, [quotes, searchTerm, filters])

  const sortedQuotes = useMemo(() => {
    const sortableItems = [...filteredQuotes]
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key]
        let bValue = b[sortConfig.key]

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
  }, [filteredQuotes, sortConfig, getQuoteDate])

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

  const handleAction = (action, quoteId) => {
    alert(`${action} action triggered for quote ${quoteId}`)
  }

  if (isLoading) return <div className="loading-state">Loading quotes...</div>
  if (error) return <div className="error-state">Error loading quotes: {error.message || "Please try again."}</div>

  return (
    <div className="quote-list-section">
      <h2>{sectionTitle}</h2>

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
        </div>
      </div>

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

export default ArtisanQuoteList