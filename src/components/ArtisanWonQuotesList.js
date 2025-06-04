// ArtisanWonQuotesList.js
import React, { useState, useMemo } from 'react';
import './ArtisanWonQuotesList.css';

const ArtisanWonQuotesList = ({ quotes, formatDate, rawCreationsData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Completion Date');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const quotesPerPage = 9; // 3x3 grid

  // Filter to only show won quotes (Accepted or Completed)
  const wonQuotes = useMemo(() => {
    return quotes.filter(quote => 
      quote.status === 'Accepted' || 
      quote.status === 'Completed'
    );
  }, [quotes]);

  // Enhanced quotes with proper type mapping and calculated fields
  const enhancedWonQuotes = useMemo(() => {
    return wonQuotes.map(quote => {
      // Find the corresponding raw creation data
      const rawCreation = rawCreationsData?.find(creation => creation.id === quote.id);
      
      const jewelryType = rawCreation?.jewellrytype || "Unknown";
      const imageUrl = rawCreation?.url || null;
      
      // Calculate additional fields
      const estimatedValue = parseFloat(quote.estimatedValue) || 0;
      const finalPrice = parseFloat(quote.finalPrice) || estimatedValue;
      const profitMargin = estimatedValue > 0 ? ((finalPrice - estimatedValue) / estimatedValue * 100) : 0;
      const isCompleted = quote.status === 'Completed';
      
      // Calculate days to complete (if completed)
      let daysToComplete = null;
      if (isCompleted && quote.submissionDate && quote.completionDate) {
        const startDate = new Date(quote.submissionDate);
        const endDate = new Date(quote.completionDate);
        daysToComplete = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      }
      
      return {
        ...quote,
        type: jewelryType,
        imageUrl: imageUrl,
        gender: rawCreation?.gender || "Unspecified",
        finalPrice: finalPrice,
        profitMargin: profitMargin,
        daysToComplete: daysToComplete,
        isCompleted: isCompleted
      };
    });
  }, [wonQuotes, rawCreationsData]);

  // Get unique values for filter options
  const uniqueTypes = [...new Set(enhancedWonQuotes.map(q => q.type).filter(Boolean))];
  const uniqueMaterials = [...new Set(enhancedWonQuotes.map(q => q.material).filter(Boolean))];
  const uniqueStatuses = [...new Set(enhancedWonQuotes.map(q => q.status).filter(Boolean))];
  const uniqueGenders = [...new Set(enhancedWonQuotes.map(q => q.gender).filter(Boolean))];

  // Helper function for search matching
  const searchMatches = (text, searchTerm) => {
    if (!text || !searchTerm) return false;
    return text.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Filter and sort quotes
  const filteredQuotes = useMemo(() => {
    let filtered = enhancedWonQuotes.filter(quote => {
      const matchesSearch = !searchTerm || 
        searchMatches(quote.clientName, searchTerm) ||
        searchMatches(quote.requirements, searchTerm) ||
        searchMatches(quote.clientLocation, searchTerm) ||
        searchMatches(quote.type, searchTerm) ||
        searchMatches(quote.material, searchTerm);
      
      const matchesType = typeFilter === 'All' || quote.type === typeFilter;
      const matchesMaterial = materialFilter === 'All' || quote.material === materialFilter;
      const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
      const matchesGender = genderFilter === 'All' || quote.gender === genderFilter;

      return matchesSearch && matchesType && matchesMaterial && matchesStatus && matchesGender;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Completion Date':
          return new Date(b.completionDate || b.submissionDate || 0) - new Date(a.completionDate || a.submissionDate || 0);
        case 'Final Price High':
          return (b.finalPrice || 0) - (a.finalPrice || 0);
        case 'Final Price Low':
          return (a.finalPrice || 0) - (b.finalPrice || 0);
        case 'Profit Margin High':
          return (b.profitMargin || 0) - (a.profitMargin || 0);
        case 'Client A-Z':
          return (a.clientName || '').localeCompare(b.clientName || '');
        case 'Days to Complete':
          return (a.daysToComplete || 999) - (b.daysToComplete || 999);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedWonQuotes, searchTerm, typeFilter, materialFilter, statusFilter, genderFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

  // Calculate summary statistics
  const totalRevenue = filteredQuotes.reduce((sum, quote) => sum + (quote.finalPrice || 0), 0);
  const averageOrderValue = filteredQuotes.length > 0 ? totalRevenue / filteredQuotes.length : 0;
  const completedQuotes = filteredQuotes.filter(q => q.isCompleted).length;
  const averageCompletionTime = filteredQuotes
    .filter(q => q.daysToComplete !== null)
    .reduce((sum, q, _, arr) => sum + q.daysToComplete / arr.length, 0);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, materialFilter, statusFilter, genderFilter, sortBy]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleCardClick = (quote) => {
    setSelectedQuote(quote);
  };

  const closeModal = () => {
    setSelectedQuote(null);
  };

  const handleAction = (action, quote) => {
    console.log(`${action} action for quote ${quote.id}`);
    // Implement actual actions here
  };

  return (
    <div className="won-quotes-container">
      <div className="won-quotes-header">
        <h2>Won Quotes ({enhancedWonQuotes.length} total)</h2>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">£{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Order Value</span>
            <span className="stat-value">£{averageOrderValue.toFixed(0)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedQuotes}/{filteredQuotes.length}</span>
          </div>
          {averageCompletionTime > 0 && (
            <div className="stat-item">
              <span className="stat-label">Avg Completion</span>
              <span className="stat-value">{averageCompletionTime.toFixed(0)} days</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters Container */}
      <div className="won-quotes-filters-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search won quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Material</label>
          <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)}>
            <option value="All">All</option>
            {uniqueMaterials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Gender</label>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="All">All</option>
            {uniqueGenders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="Completion Date">Completion Date</option>
            <option value="Final Price High">Final Price (High)</option>
            <option value="Final Price Low">Final Price (Low)</option>
            <option value="Profit Margin High">Profit Margin (High)</option>
            <option value="Client A-Z">Client A-Z</option>
            <option value="Days to Complete">Days to Complete</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredQuotes.length)} of {filteredQuotes.length} won quotes
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      {/* Cards Grid */}
      <div className="won-quotes-grid">
        {currentQuotes.map((quote) => (
          <div key={quote.id} className="won-quote-card" onClick={() => handleCardClick(quote)}>
            <div className="card-image-section">
              {quote.imageUrl ? (
                <img 
                  src={quote.imageUrl} 
                  alt="Quote item" 
                  className="card-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="card-image-placeholder" style={{ display: quote.imageUrl ? 'none' : 'flex' }}>
                💎
              </div>
              <div className="card-status-overlay">
                <span className={`status-badge ${quote.status.toLowerCase()}`}>
                  {quote.status}
                </span>
              </div>
            </div>
            
            <div className="card-content">
              <div className="card-header">
                <h3 className="client-name">{quote.clientName}</h3>
                <div className="quote-id">#{quote.id.slice(-6)}</div>
              </div>
              
              <div className="card-details">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className={`type-badge ${quote.type?.toLowerCase()}`}>
                    {quote.type}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Material:</span>
                  <span className="detail-value">{quote.material || 'N/A'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Gender:</span>
                  <span className={`gender-badge ${quote.gender?.toLowerCase()}`}>
                    {quote.gender}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{quote.clientLocation}</span>
                </div>
              </div>
              
              <div className="card-financial">
                <div className="price-info">
                  <div className="final-price">
                    <span className="price-label">Final Price</span>
                    <span className="price-value">£{quote.finalPrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                  {quote.estimatedValue !== quote.finalPrice && (
                    <div className="estimated-price">
                      <span className="price-label">Estimated</span>
                      <span className="price-value">£{quote.estimatedValue?.toLocaleString() || 'N/A'}</span>
                    </div>
                  )}
                </div>
                
                {quote.profitMargin !== 0 && (
                  <div className={`profit-margin ${quote.profitMargin >= 0 ? 'positive' : 'negative'}`}>
                    {quote.profitMargin >= 0 ? '+' : ''}{quote.profitMargin.toFixed(1)}% margin
                  </div>
                )}
              </div>
              
              <div className="card-timeline">
                <div className="timeline-item">
                  <span className="timeline-label">Submitted:</span>
                  <span className="timeline-value">{formatDate(quote.submissionDate)}</span>
                </div>
                {quote.completionDate && (
                  <div className="timeline-item">
                    <span className="timeline-label">Completed:</span>
                    <span className="timeline-value">{formatDate(quote.completionDate)}</span>
                  </div>
                )}
                {quote.daysToComplete && (
                  <div className="timeline-item">
                    <span className="timeline-label">Duration:</span>
                    <span className="timeline-value">{quote.daysToComplete} days</span>
                  </div>
                )}
              </div>
              
              <div className="card-actions">
                <button 
                  className="btn-action btn-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('view', quote);
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn-action btn-invoice"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction('invoice', quote);
                  }}
                >
                  Generate Invoice
                </button>
                {quote.status === 'Accepted' && (
                  <button 
                    className="btn-action btn-complete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('complete', quote);
                    }}
                  >
                    Mark Complete
                  </button>
                )}
                {quote.isCompleted && (
                  <button 
                    className="btn-action btn-feedback"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('feedback', quote);
                    }}
                  >
                    Request Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            className="pagination-btn" 
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className="pagination-btn" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {filteredQuotes.length === 0 && (
        <div className="no-results">
          <p>No won quotes match your current filters.</p>
        </div>
      )}

      {/* Modal for detailed view */}
      {selectedQuote && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Quote Details - {selectedQuote.clientName}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-image-section">
                {selectedQuote.imageUrl ? (
                  <img src={selectedQuote.imageUrl} alt="Quote item" className="modal-image" />
                ) : (
                  <div className="modal-image-placeholder">💎</div>
                )}
              </div>
              <div className="modal-details-section">
                <div className="modal-detail-group">
                  <h3>Basic Information</h3>
                  <p><strong>Quote ID:</strong> {selectedQuote.id}</p>
                  <p><strong>Client:</strong> {selectedQuote.clientName}</p>
                  <p><strong>Location:</strong> {selectedQuote.clientLocation}</p>
                  <p><strong>Type:</strong> {selectedQuote.type}</p>
                  <p><strong>Material:</strong> {selectedQuote.material}</p>
                  <p><strong>Gender:</strong> {selectedQuote.gender}</p>
                  <p><strong>Status:</strong> {selectedQuote.status}</p>
                </div>
                
                <div className="modal-detail-group">
                  <h3>Requirements</h3>
                  <p>{selectedQuote.requirements}</p>
                </div>
                
                <div className="modal-detail-group">
                  <h3>Financial Details</h3>
                  <p><strong>Estimated Value:</strong> £{selectedQuote.estimatedValue?.toLocaleString()}</p>
                  <p><strong>Final Price:</strong> £{selectedQuote.finalPrice?.toLocaleString()}</p>
                  <p><strong>Profit Margin:</strong> {selectedQuote.profitMargin.toFixed(1)}%</p>
                </div>
                
                <div className="modal-detail-group">
                  <h3>Timeline</h3>
                  <p><strong>Submitted:</strong> {formatDate(selectedQuote.submissionDate)}</p>
                  {selectedQuote.completionDate && (
                    <p><strong>Completed:</strong> {formatDate(selectedQuote.completionDate)}</p>
                  )}
                  {selectedQuote.daysToComplete && (
                    <p><strong>Duration:</strong> {selectedQuote.daysToComplete} days</p>
                  )}
                </div>
                
                {selectedQuote.notes && (
                  <div className="modal-detail-group">
                    <h3>Notes</h3>
                    <p>{selectedQuote.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanWonQuotesList;