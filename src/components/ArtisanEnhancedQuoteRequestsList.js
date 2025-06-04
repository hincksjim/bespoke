// ArtisanEnhancedQuoteRequestsList.js
import React, { useState, useMemo } from 'react';
import './ArtisanEnhancedQuoteRequestsList.css'; // Assuming you have a CSS file for styles

const ArtisanEnhancedQuoteRequestsList = ({ quotes, formatDate, rawCreationsData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [materialFilter, setMaterialFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest First');
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 12;

  // Enhanced quotes with proper type mapping and images
  const enhancedQuotes = useMemo(() => {
    return quotes.map(quote => {
      // Find the corresponding raw creation data to get the correct type
      const rawCreation = rawCreationsData?.find(creation => creation.id === quote.id);
      
      // Use the correct field names from your schema
      const jewelryType = rawCreation?.jewellrytype || "Unknown";
      const imageUrl = rawCreation?.url || null;
      
      console.log('Quote:', quote.id, 'Type:', jewelryType, 'Image:', imageUrl);
      
      return {
        ...quote,
        type: jewelryType,
        imageUrl: imageUrl,
        gender: rawCreation?.gender || "Unspecified"
      };
    });
  }, [quotes, rawCreationsData]);

  // Get unique values for filter options from enhanced quotes
  const uniqueTypes = [...new Set(enhancedQuotes.map(q => q.type).filter(Boolean))];
  const uniqueMaterials = [...new Set(enhancedQuotes.map(q => q.material).filter(Boolean))];
  const uniqueStatuses = [...new Set(enhancedQuotes.map(q => q.status).filter(Boolean))];
  const uniqueGenders = [...new Set(enhancedQuotes.map(q => q.gender).filter(Boolean))];

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
    let filtered = enhancedQuotes.filter(quote => {
      const matchesSearch = !searchTerm || 
        searchMatches(quote.clientName, searchTerm) ||
        searchMatches(quote.requirements, searchTerm) ||
        searchMatches(quote.clientLocation, searchTerm) ||
        searchMatches(quote.type, searchTerm) ||
        searchMatches(quote.material, searchTerm) ||
        searchMatches(quote.status, searchTerm) ||
        searchMatches(quote.gender, searchTerm);
      
      const matchesType = typeFilter === 'All' || quote.type === typeFilter;
      const matchesMaterial = materialFilter === 'All' || quote.material === materialFilter;
      const matchesStatus = statusFilter === 'All' || quote.status === statusFilter;
      const matchesGender = genderFilter === 'All' || quote.gender === genderFilter;

      return matchesSearch && matchesType && matchesMaterial && matchesStatus && matchesGender;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Newest First':
          return new Date(b.submissionDate || 0) - new Date(a.submissionDate || 0);
        case 'Oldest First':
          return new Date(a.submissionDate || 0) - new Date(b.submissionDate || 0);
        case 'Client A-Z':
          return (a.clientName || '').localeCompare(b.clientName || '');
        case 'Client Z-A':
          return (b.clientName || '').localeCompare(a.clientName || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [enhancedQuotes, searchTerm, typeFilter, materialFilter, statusFilter, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = startIndex + quotesPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

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

  return (
    <div className="quote-requests-container">
      <div className="quote-requests-header">
        <h2>Quote Requests ({quotes.length} total)</h2>
        <button className="debug-btn">🔍 Show Debug</button>
      </div>

      {/* Horizontal Filters Container */}
      <div className="quote-filters-container">
        {/* Search Input */}
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search quotes..."
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

        {/* Sort Dropdown */}
        <div className="filter-group">
          <label>Sort By</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Newest First">Newest First</option>
            <option value="Oldest First">Oldest First</option>
            <option value="Client A-Z">Client A-Z</option>
            <option value="Client Z-A">Client Z-A</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredQuotes.length)} of {filteredQuotes.length} quote requests
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
              <th>Location</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentQuotes.map((quote) => (
              <tr key={quote.id} className="quote-row">
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
                  <span className={`status-badge ${quote.status?.toLowerCase()}`}>
                    {quote.status}
                  </span>
                </td>
                <td>{quote.clientLocation}</td>
                <td>{formatDate ? formatDate(quote.submissionDate) : quote.submissionDate || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-view">View</button>
                    <button className="btn-respond">Respond</button>
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
          <p>No quote requests match your current filters.</p>
        </div>
      )}


    </div>
  );
};

export default ArtisanEnhancedQuoteRequestsList;