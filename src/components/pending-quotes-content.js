"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Edit, X, Check } from "lucide-react"
import "./pending-quotes-content.css"

// This component displays a list of pending quotes for an artisan.
// It supports expanding and collapsing individual quotes for more details.
export default function PendingQuotesContent({ artisanData }) {
  const [expandedQuoteId, setExpandedQuoteId] = useState(null)

  // In a real app, you would fetch this data from your backend
  const pendingQuotes = artisanData?.pendingQuotesList || []

  const toggleExpand = (quoteId) => {
    if (expandedQuoteId === quoteId) {
      setExpandedQuoteId(null)
    } else {
      setExpandedQuoteId(quoteId)
    }
  }

  return (
    <div className="pending-quotes">
      <div className="pending-quotes-header">
        <h2 className="pending-quotes-title">Pending Quotes</h2>

        <div className="pending-quotes-filters">
          <select className="filter-select">
            <option>All Categories</option>
            <option>Rings</option>
            <option>Necklaces</option>
            <option>Bracelets</option>
            <option>Custom</option>
          </select>

          <select className="filter-select">
            <option>Sort by Date</option>
            <option>Sort by Value</option>
            <option>Sort by Client</option>
          </select>
        </div>
      </div>

      {/* Pending Quotes List */}
      <div className="quotes-card">
        {pendingQuotes.length > 0 ? (
          <div className="quotes-list">
            {pendingQuotes.map((quote) => (
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
                        {quote.clientName} • Requested {new Date(quote.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="quote-header-actions">
                    <span className="status-badge status-pending">Pending</span>
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
                        <h4 className="quote-details-title">Details</h4>
                        <div className="quote-details-content">
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Category:</span> {quote.category}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Materials:</span> {quote.materials}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Dimensions:</span> {quote.dimensions}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Description:</span> {quote.description}
                          </p>
                        </div>
                      </div>

                      <div className="quote-details-section">
                        <h4 className="quote-details-title">Client Information</h4>
                        <div className="quote-details-content">
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Name:</span> {quote.clientName}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Email:</span> {quote.clientEmail}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Phone:</span> {quote.clientPhone}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Preferred Contact:</span> {quote.preferredContact}
                          </p>
                        </div>
                      </div>

                      <div className="quote-details-section">
                        <h4 className="quote-details-title">Quote Information</h4>
                        <div className="quote-details-content">
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Estimated Value:</span> ${quote.estimatedValue}
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Timeline:</span> {quote.timeline} days
                          </p>
                          <p className="quote-detail-item">
                            <span className="quote-detail-label">Status:</span> {quote.status}
                          </p>
                        </div>

                        <div className="quote-actions">
                          <button className="action-button create-button">
                            <Edit className="action-icon" />
                            Create Quote
                          </button>
                          <button className="action-button accept-button">
                            <Check className="action-icon" />
                            Accept
                          </button>
                          <button className="action-button decline-button">
                            <X className="action-icon" />
                            Decline
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
          <div className="quotes-empty">No pending quote requests found.</div>
        )}
      </div>
    </div>
  )
}
