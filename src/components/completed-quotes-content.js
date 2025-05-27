"use client"

import { useState } from "react"
import { Search, Download, Eye, ChevronDown, ChevronUp } from "lucide-react"
import "./completed-quotes-content.css"

// This component displays a list of completed quotes for artisans.
// It includes search functionality and allows users to expand quotes for more details.

export default function CompletedQuotesContent({ artisanData }) {
  const [expandedQuoteId, setExpandedQuoteId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // In a real app, you would fetch this data from your backend
  const completedQuotes = artisanData?.completedQuotesList || []

  const toggleExpand = (quoteId) => {
    if (expandedQuoteId === quoteId) {
      setExpandedQuoteId(null)
    } else {
      setExpandedQuoteId(quoteId)
    }
  }

  // Filter quotes based on search term
  const filteredQuotes = completedQuotes.filter(
    (quote) =>
      quote.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="completed-quotes">
      <div className="completed-quotes-header">
        <h2 className="completed-quotes-title">Completed Quotes</h2>

        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search quotes..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Completed Quotes List */}
      <div className="quotes-card">
        {filteredQuotes.length > 0 ? (
          <div className="quotes-list">
            {filteredQuotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                <div className="quote-header" onClick={() => toggleExpand(quote.id)}>
                  <div className="quote-header-content">
                    <img
                      src={quote.thumbnailUrl || "/placeholder.svg?height=48&width=48"}
                      alt={quote.itemName}
                      className="quote-thumbnail"
                    />
                    <div className="quote-header-details">
                      <p className="quote-item-name">{quote.itemName}</p>
                      <p className="quote-client-info">
                        {quote.clientName} • Completed {new Date(quote.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="quote-header-actions">
                    <span className="status-badge status-completed">{quote.status}</span>
                    {expandedQuoteId === quote.id ? (
                      <ChevronUp className="chevron-icon" />
                    ) : (
                      <ChevronDown className="chevron-icon" />
                    )}
                  </div>
                </div>

                {expandedQuoteId === quote.id && (
                  <div className="quote-details">
                    <div className="quote-details-grid">
                      <div className="quote-details-section">
                        <h4 className="quote-details-title">Quote Details</h4>
                        <div className="quote-details-content">
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Quote ID:</span> {quote.id}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Final Price:</span> ${quote.finalPrice}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Materials:</span> {quote.materials}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Labor Hours:</span> {quote.laborHours}
                          </p>
                        </div>
                      </div>

                      <div className="quote-details-section">
                        <h4 className="quote-details-title">Timeline</h4>
                        <div className="quote-details-content">
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Request Date:</span>{" "}
                            {new Date(quote.requestDate).toLocaleDateString()}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Quote Date:</span>{" "}
                            {new Date(quote.quoteDate).toLocaleDateString()}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Acceptance Date:</span>{" "}
                            {new Date(quote.acceptanceDate).toLocaleDateString()}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Completion Date:</span>{" "}
                            {new Date(quote.completionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="quote-details-section">
                        <h4 className="quote-details-title">Actions</h4>
                        <div className="quote-actions">
                          <button className="action-button view-button">
                            <Eye className="action-icon" />
                            View Full Details
                          </button>
                          <button className="action-button download-button">
                            <Download className="action-icon" />
                            Download Quote PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="quotes-empty">
            {searchTerm ? "No quotes match your search." : "No completed quotes found."}
          </div>
        )}
      </div>
    </div>
  )
}
