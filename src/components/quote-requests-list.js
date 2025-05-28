import React, { useState, useEffect, useMemo } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
import { listCreations } from '../graphql/queries';
import { Search, Eye } from 'lucide-react';
import './quote-requests-list.css';

const client = generateClient();

export default function QuoteRequestsList() {
  const navigate = useNavigate();
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'submitteddate',
    direction: 'descending'
  });
  const [filters, setFilters] = useState({
    type: 'All',
    dateRange: 'All'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchQuoteRequests();
  }, []);

  async function fetchQuoteRequests() {
    try {
      setLoading(true);
      const response = await client.graphql({
        query: listCreations,
        variables: {
          filter: {
            submittedforquote: { eq: true }
          }
        }
      });
      
      if (response.data.listCreations.items) {
        setQuoteRequests(response.data.listCreations.items);
      }
    } catch (err) {
      console.error('Error fetching quote requests:', err);
      setError('Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  // Filter and sort requests
  const filteredAndSortedRequests = useMemo(() => {
    let result = [...quoteRequests];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(request => 
        request.jewellrytype?.toLowerCase().includes(searchLower) ||
        request.material?.toLowerCase().includes(searchLower) ||
        request.stone?.toLowerCase().includes(searchLower) ||
        request.Style?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.type !== 'All') {
      result = result.filter(request => request.jewellrytype === filters.type);
    }

    // Apply date filter
    if (filters.dateRange !== 'All') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      result = result.filter(request => {
        const submitDate = new Date(request.submitteddate);
        switch (filters.dateRange) {
          case '7days':
            return submitDate >= sevenDaysAgo;
          case '30days':
            return submitDate >= thirtyDaysAgo;
          default:
            return true;
        }
      });
    }

    // Sort results
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle dates
        if (sortConfig.key === 'submitteddate' || sortConfig.key === 'requiredby') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [quoteRequests, searchTerm, filters, sortConfig]);

  // Get paginated results
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedRequests.slice(startIndex, endIndex);
  }, [filteredAndSortedRequests, currentPage]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  const getSortDirectionClass = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc';
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  // Navigation for details view
  const handleViewDetails = (requestId) => {
    navigate(`/quote-details/${requestId}`);
  };

  return (
    <div className="quote-requests">
      <h2>Quote Requests</h2>
      
      {/* Search and Filters */}
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by type, material, stone, or style..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select 
            name="type" 
            value={filters.type}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="All">All Types</option>
            <option value="Ring">Rings</option>
            <option value="Necklace">Necklaces</option>
            <option value="Bracelet">Bracelets</option>
            <option value="Earring">Earrings</option>
            <option value="Custom">Custom</option>
          </select>

          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="All">All Time</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading quote requests...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="quotes-table">
            <thead>
              <tr>
                <th>Image</th>
                <th 
                  onClick={() => handleSort('jewellrytype')}
                  className={`sortable ${getSortDirectionClass('jewellrytype')}`}
                >
                  Type
                  <span className="sort-indicator"></span>
                </th>
                <th 
                  onClick={() => handleSort('submitteddate')}
                  className={`sortable ${getSortDirectionClass('submitteddate')}`}
                >
                  Submitted Date
                  <span className="sort-indicator"></span>
                </th>
                <th 
                  onClick={() => handleSort('material')}
                  className={`sortable ${getSortDirectionClass('material')}`}
                >
                  Material
                  <span className="sort-indicator"></span>
                </th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map(request => (
                  <tr key={request.id}>
                    <td className="request-image-cell">
                      <img 
                        src={request.url || "https://thegoldmarket.co.uk/wp-content/uploads/2018/03/diamond-1839031_1280.jpg"}
                        alt={`${request.jewellrytype || 'Jewelry'} design`}
                        className="request-thumbnail"
                      />
                    </td>
                    <td>{request.jewellrytype || 'N/A'}</td>
                    <td>{formatDate(request.submitteddate)}</td>
                    <td>{request.material || 'N/A'}</td>
                    <td>
                      {request.stone && <div>Stone: {request.stone}</div>}
                      {request.Style && <div>Style: {request.Style}</div>}
                    </td>
                    <td>
                      <button
                        onClick={() => handleViewDetails(request.id)}
                        className="action-button view"
                      >
                        <Eye size={16} className="button-icon" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No quote requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredAndSortedRequests.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {Math.ceil(filteredAndSortedRequests.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredAndSortedRequests.length / itemsPerPage), p + 1))}
            disabled={currentPage >= Math.ceil(filteredAndSortedRequests.length / itemsPerPage)}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
