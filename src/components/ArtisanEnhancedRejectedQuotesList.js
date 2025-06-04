// ArtisanEnhancedRejectedQuotesList.js
import React, { useState, useMemo } from 'react';
import './ArtisanRespondedQuotesList.css'; // Ensure you have the appropriate CSS for styling

const ArtisanEnhancedRejectedQuotesList = ({ quotes, formatDate, rawCreationsData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [rejectionReasonFilter, setRejectionReasonFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 12;

  // Filter only rejected/cancelled quotes
  const rejectedQuotes = useMemo(() => {
    return quotes.filter(quote => 
      quote.status === 'Rejected' || 
      quote.status === 'Cancelled' ||
      quote.status === 'Declined' ||
      quote.status === 'Lost'
    );
  }, [quotes]);

  // Enhanced quotes with proper type mapping and images
  const enhancedRejectedQuotes = useMemo(() => {
    return rejectedQuotes.map(quote => {
      // Find the corresponding raw creation data to get the correct type
      const rawCreation = rawCreationsData?.find(creation => creation.id === quote.id);
      
      // Use the correct field names from your schema
      const jewelryType = rawCreation?.jewellrytype || "Unknown";
      const imageUrl = rawCreation?.url || null;
      
      // Mock rejection reasons - you can replace this with actual data from your schema
      const rejectionReasons = [
        'Price too high',
        'Timeline too long',
        'Material unavailable',
        'Design complexity',
        'Client budget constraints',
        'Availability conflict',
        'Specification mismatch',
        'Communication issues'
      ];
      
      const randomReason = rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)];
      
      return {
        ...quote,
        type: jewelryType,
        imageUrl: imageUrl,
        gender: rawCreation?.gender || "Unspecified",
        rejectionReason: quote.rejectionReason || randomReason,
        rejectionDate: quote.rejectionDate || quote.updatedAt || quote.submissionDate,
        originalQuoteAmount: quote.originalQuoteAmount || quote.estimatedValue,
        daysToRejection: quote.daysToRejection || Math.floor(Math.random() * 14) + 1
      };
    });
  }, [rejectedQuotes, rawCreationsData]);

  // Get unique values for filter options from enhanced quotes
  const uniqueTypes = [...new Set(enhancedRejectedQuotes.map(q => q.type).filter(Boolean))];
  const uniqueMaterials = [...new Set(enhancedRejectedQuotes.map(q => q.material).filter(Boolean))];
  const uniqueStatuses = [...new Set(enhancedRejectedQuotes.map(q => q.status).filter(Boolean))];
  const uniqueGenders = [...new Set(enhancedRejectedQuotes.map(q => q.gender).filter(Boolean))];
  const uniqueRejectionReasons = [...new Set(enhancedRejectedQuotes.map(q => q.rejectionReason).filter(Boolean))];

  // Helper function to normalize search terms (remove plurals and make lowercase)
  const normalizeSearchTerm = (term) => {
    if (!term) return '';
    
    const normalized = term.toLowerCase().trim();
    
    // Remove common plural endings
    const singularized = normalized
      .replace(/ies$/, 'y')     // batteries -> battery
      .replace(/ves$/, 'f')     // knives -> knife  
      .replace(/oes$/, 'o')     // heroes -> hero
      .replace(/ses$/, 's')     // glasses -> glass
      .replace(/ches$/, 'ch')   // watches -> watch
      .replace(/shes$/, 'sh')   // brushes -> brush
      .replace(/xes$/, 'x')     // boxes -> box
      .replace(/s$/, '');       // rings -> ring, necklaces -> necklace
    
    return singularized;
  };

  // Helper function to check if search term matches text
  const searchMatches = (text, searchTerm) => {
    if (!text || !searchTerm) return false;
    
    const normalizedText = normalizeSearchTerm(text);
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    
    // Check both original and normalized versions
    return text.toLowerCase().includes(searchTerm.toLowerCase()) ||
           normalizedText.includes(normalizedSearch) ||
           normalizedSearch.includes(normalizedText);
  };

  // Filter and sort quotes
  const filteredQuotes = useMemo(() => {
    let filtered = enhancedRejectedQuotes.filter(quote => {
      const matchesSearch = !searchTerm || 
        searchMatches(quote.clientName, searchTerm) ||
        searchMatches(quote.requirements, searchTerm) ||
        searchMatches(quote.clientLocation, searchTerm) ||
        searchMatches(quote.type, searchTerm) ||
        searchMatches(quote.material, searchTerm) ||
        searchMatches(quote.status, searchTerm) ||
        searchMatches(quote.gender, searchTerm) ||
        searchMatches(quote.rejectionReason, searchTerm);
      
      const matchesType = typeFilter === 'All' || quote.type === typeFilter;
      const matchesMaterial = materialFilter === 'All' || quote.material === materialFilter;
      const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
      const matchesGender = genderFilter === 'All' || quote.gender === genderFilter;
      const matchesRejectionReason = rejectionReasonFilter === 'All' || quote.rejectionReason === rejectionReasonFilter;

      return matchesSearch && matchesType && matchesMaterial && matchesStatus && matchesGender && matchesRejectionReason;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Most Recent':
          return new Date(b.rejectionDate || 0) - new Date(a.rejectionDate || 0);
        case 'Oldest First':
          return new Date(a.rejectionDate || 0) - new Date(b.rejectionDate || 0);
        case 'Client A-Z':
          return (a.clientName || '').localeCompare(b.clientName || '');
        case 'Client Z-A':
          return (b.clientName || '').localeCompare(a.clientName || '');
        case 'Highest Value':
          return (b.originalQuoteAmount || 0) - (a.originalQuoteAmount || 0);
        case 'Lowest Value':
          return (a.originalQuoteAmount || 0) - (b.originalQuoteAmount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedRejectedQuotes, searchTerm, typeFilter, materialFilter, statusFilter, genderFilter, rejectionReasonFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, materialFilter, statusFilter, genderFilter, rejectionReasonFilter, sortBy]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Calculate rejection analytics
  const rejectionAnalytics = useMemo(() => {
    const totalValue = filteredQuotes.reduce((sum, q) => sum + (q.originalQuoteAmount || 0), 0);
    const avgDaysToRejection = filteredQuotes.length > 0 
      ? Math.round(filteredQuotes.reduce((sum, q) => sum + (q.daysToRejection || 0), 0) / filteredQuotes.length)
      : 0;
    
    const reasonCounts = {};
    filteredQuotes.forEach(q => {
      const reason = q.rejectionReason || 'Unknown';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    const topReason = Object.keys(reasonCounts).reduce((a, b) => 
      reasonCounts[a] > reasonCounts[b] ? a : b, 'None'
    );

    return {
      totalValue,
      avgDaysToRejection,
      topReason,
      reasonCounts
    };
  }, [filteredQuotes]);

  return (
    <div className="rejected-quotes-container">
      <div className="rejected-quotes-header">
        <h2>Rejected & Lost Quotes ({rejectedQuotes.length} total)</h2>
        <div className="rejection-analytics">
          <div className="analytic-item">
            <span className="analytic-label">Lost Value:</span>
            <span className="analytic-value">£{rejectionAnalytics.totalValue.toLocaleString()}</span>
          </div>
          <div className="analytic-item">
            <span className="analytic-label">Avg Days to Rejection:</span>
            <span className="analytic-value">{rejectionAnalytics.avgDaysToRejection}</span>
          </div>
          <div className="analytic-item">
            <span className="analytic-label">Top Reason:</span>
            <span className="analytic-value">{rejectionAnalytics.topReason}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Filters Container */}
      <div className="quote-filters-container">
        {/* Search Input */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search rejected quotes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            maxLength={36}
          />
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label>Type</label>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Material Filter */}
        <div className="filter-group">
          <label>Material</label>
          <select 
            value={materialFilter} 
            onChange={(e) => setMaterialFilter(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueMaterials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div className="filter-group">
          <label>Gender</label>
          <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="All">All</option>
            {uniqueGenders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {/* Rejection Reason Filter */}
        <div className="filter-group">
          <label>Reason</label>
          <select 
            value={rejectionReasonFilter} 
            onChange={(e) => setRejectionReasonFilter(e.target.value)}
          >
            <option value="All">All Reasons</option>
            {uniqueRejectionReasons.map(reason => (
              <option key={reason} value={reason}>{reason}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Most Recent">Most Recent</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Client A-Z">Client A-Z</option>
            <option value="Client Z-A">Client Z-A</option>
            <option value="Highest Value">Highest Value</option>
            <option value="Lowest Value">Lowest Value</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredQuotes.length)} of {filteredQuotes.length} rejected quotes
        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
      </div>

      {/* Quotes Table */}
      <div className="quotes-table-container">
        <table className="quotes-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Quote ID</th>
              <th>Type</th>
              <th>Material</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Rejection Reason</th>
              <th>Original Value</th>
              <th>Days to Rejection</th>
              <th>Rejected Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentQuotes.map((quote) => (
              <tr key={quote.id} className="quote-row rejected-quote-row">
                <td className="image-cell">
                  {quote.imageUrl ? (
                    <img 
                      src={quote.imageUrl} 
                      alt="Quote item" 
                      className="quote-thumbnail"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{ display: quote.imageUrl ? 'none' : 'flex' }}>
                    📷
                  </div>
                </td>
                <td>{quote.id}</td>
                <td>
                  <span className={`type-badge ${quote.type?.toLowerCase()}`}>
                    {quote.type || 'N/A'}
                  </span>
                </td>
                <td>{quote.material || 'N/A'}</td>
                <td>
                  <span className={`gender-badge ${quote.gender?.toLowerCase()}`}>
                    {quote.gender || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge rejected ${quote.status?.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </td>
                <td>
                  <span className="rejection-reason">
                    {quote.rejectionReason}
                  </span>
                </td>
                <td className="value-cell">
                  £{(quote.originalQuoteAmount || 0).toLocaleString()}
                </td>
                <td className="days-cell">
                  {quote.daysToRejection} days
                </td>
                <td>{formatDate ? formatDate(quote.rejectionDate) : quote.rejectionDate || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">View</button>
                    <button className="btn-resubmit">Re-submit</button>
                    <button className="btn-archive">Archive</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          <p>No rejected quotes match your current filters.</p>
          {rejectedQuotes.length === 0 && (
            <p className="empty-state">🎉 Great news! You have no rejected quotes.</p>
          )}
        </div>
      )}


    </div>
  );
};

export default ArtisanEnhancedRejectedQuotesList;