import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCreations, listArtisanquotes } from '../graphql/queries';
import { updateArtisanquote } from '../graphql/mutations';
import './ArtisanQuoteDetailsPage.css';
import { ChevronLeft, Eye, Download } from 'lucide-react';

const client = generateClient();

export default function ArtisanQuoteDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthenticator();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDesignAndQuotes = useCallback(async () => {
    if (!id) {
      setError('No design ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching design and quotes for ID:', id);
      
      const [designResponse, quotesResponse] = await Promise.all([
        client.graphql({
          query: getCreations,
          variables: { id }
        }),
        client.graphql({
          query: listArtisanquotes,
          variables: {
            filter: {
              creationId: { eq: id }
            }
          }
        })
      ]);

      if (!designResponse.data?.getCreations) {
        throw new Error('Design not found');
      }

      setDesign(designResponse.data.getCreations);
      setQuotes(quotesResponse.data?.listArtisanquotes?.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Error loading details. Please try again later.');
      setDesign(null);
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDesignAndQuotes();
  }, [fetchDesignAndQuotes]);

  const handleQuoteAction = async (quoteId, action) => {
    try {
      await client.graphql({
        query: updateArtisanquote,
        variables: { 
          input: { 
            id: quoteId, 
            status: action 
          } 
        }
      });
      fetchDesignAndQuotes(); // Refresh quotes after action
    } catch (error) {
      console.error(`Error ${action.toLowerCase()}ing quote:`, error);
      alert(`Failed to ${action.toLowerCase()} quote. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="artisan-quote-details-page loading-state">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artisan-quote-details-page error-state">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <ChevronLeft size={20} />
          Back
        </button>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="artisan-quote-details-page error-state">
        <h2>Not Found</h2>
        <p>No design found with the given ID.</p>
        <button onClick={() => navigate(-1)} className="back-button">
          <ChevronLeft size={20} />
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="artisan-quote-details-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ChevronLeft size={20} />
          Back to Designs
        </button>
        <h1>Quote Details</h1>
      </div>

      <div className="design-section">
        <div className="design-image-container">
          <img
            src={design.url || "https://thegoldmarket.co.uk/wp-content/uploads/2018/03/diamond-1839031_1280.jpg"}
            alt={`Design ${id}`}
            className="design-image"
          />
        </div>
        <div className="design-info">
          <h2>Design Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Type:</span>
              <span className="value">{design.jewellrytype || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Created:</span>
              <span className="value">{new Date(design.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value status-badge">{design.status || 'Pending'}</span>
            </div>
            {design.description && (
              <div className="info-item full-width">
                <span className="label">Description:</span>
                <span className="value">{design.description}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="quotes-section">
        <h2>Artisan Quotes</h2>
        <div className="table-responsive">
          <table className="quotes-table">
            <thead>
              <tr>
                <th>Artisan</th>
                <th>Price</th>
                <th>Timeline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <tr key={quote.id}>
                    <td data-label="Artisan">{quote.artisanName || 'Unknown Artisan'}</td>
                    <td data-label="Price">£{quote.Amountquoted || 0}</td>
                    <td data-label="Timeline">{quote.timeline || 'Not specified'}</td>
                    <td data-label="Status">
                      <span className={`status-badge status-${quote.status?.toLowerCase()}`}>
                        {quote.status || 'Pending'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div className="action-buttons-group">
                        {quote.status === 'NEW' && (
                          <>
                            <button
                              onClick={() => handleQuoteAction(quote.id, 'ACCEPTED')}
                              className="action-button accept"
                              aria-label="Accept quote"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleQuoteAction(quote.id, 'REJECTED')}
                              className="action-button reject"
                              aria-label="Reject quote"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          className="action-button view"
                          aria-label="View quote details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No quotes received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
