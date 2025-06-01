import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCreations, listArtisanquotes } from '../graphql/queries';
import { updateCreations, updateArtisanquote } from '../graphql/mutations';
import './QuoteDetailsPage.css';
import { Equal } from 'lucide-react';

// This component displays detailed information about a specific quote.
// It fetches and shows design and quote data for a given ID.

const client = generateClient();

export default function QuoteDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthenticator();
  const [design, setDesign] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [clientNotes, setClientNotes] = useState('');
  const [requiredByDate, setRequiredByDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDesignAndQuotes = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching design and quotes for ID:', id);
      const designResponse = await client.graphql({
        query: getCreations,
        variables: { id }
      });
      console.log('Design Response29:', designResponse);
      if (designResponse.data.getCreations) {
        setDesign(designResponse.data.getCreations);
        console.log('Design Response32:', designResponse);
        setClientNotes(designResponse.data.getCreations.clientNotes || '');
        setRequiredByDate(designResponse.data.getCreations.requiredByDate || '');
      }


      const quotesResponse = await client.graphql({
        query: listArtisanquotes,
        variables: { id }
      });
      console.log('Quotes Response:', quotesResponse);
      console.log('id', id);

      if (quotesResponse.data.listArtisanquotes) {
        console.log('Quotes Response:', quotesResponse);
        setQuotes(quotesResponse.data.listArtisanquotes.items);
      }
    } catch (err) {
      console.log('err', err);
      console.log('id', id);
      console.error('Error fetching design and quotes:', err);
      setError('No quotes received yet. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDesignAndQuotes();
    }
  }, [id, fetchDesignAndQuotes]);

  const handleClientNotesChange = (e) => {
    setClientNotes(e.target.value);
  };

  const handleRequiredByDateChange = (e) => {
    setRequiredByDate(e.target.value);
  };

  const saveClientInfo = async () => {
    try {
      await client.graphql({
        query: updateCreations,
        variables: { 
          input: { 
            id, 
            clientNotes, 
            requiredByDate 
          } 
        }
      });
      alert('Client information saved successfully!');
    } catch (error) {
      console.error('Error saving client information:', error);
      alert('Failed to save client information');
    }
  };

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
      console.error(`Error ${action} quote:`, error);
      alert(`Failed to ${action} quote`);
    }
  };

  const filterInappropriateContent = (note) => {
    if (typeof note !== 'string') {
      return ''; // Return an empty string if note is not a string
    }
    const inappropriatePattern = /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|$$\d{3}$$[-.\s]?\d{3}[-.\s]?\d{4}|(https?:\/\/[^\s]+))/g;
    return note.replace(inappropriatePattern, '[REDACTED]');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!design) {
    return <div>No design found with the given ID.</div>;
  }

  return (
    <div className="quote-details-container">
      <h1>Quote Details for Design {id}</h1>
      <img
        src={design.url || "https://thegoldmarket.co.uk/wp-content/uploads/2018/03/diamond-1839031_1280.jpg"}
        alt={`Design ${id}`}
        className="design-image"
      />
      <div className="client-info">
        <h2>Client Information</h2>
        <textarea
          value={clientNotes}
          onChange={handleClientNotesChange}
          placeholder="Add your notes for the Artisans here"
          rows={4}
        />
        <label htmlFor="requiredByDate">Required By Date:</label>
        <input
          type="date"
          value={requiredByDate}
          onChange={handleRequiredByDateChange}

        />
        <button onClick={saveClientInfo} className="btn">Save Client Info</button>
      </div>
      <div className="artisan-quotes">
        <h2>Artisan Quotes</h2>
        {quotes.length > 0 ? (
          quotes.map((quote) => (
            <div key={quote.id} className="quote-card">
              <p>Artisan Name: {quote.artisanName}</p>
              <p>Quote: {quote.id}</p>
              <p>Quote Status: {quote.status}</p>
              <p>Total Quoted Price: ${quote.Amountquoted}</p>
              <p>Artisan Note: {filterInappropriateContent(quote.artisanNote)}</p>
              <div className="quote-actions">
                <button 
                  onClick={() => handleQuoteAction(quote.id, 'ACCEPTED')} 
                  className="btn accept-btn"
                >
                  Accept Quote
                </button>
                <button 
                  onClick={() => handleQuoteAction(quote.id, 'REJECTED')} 
                  className="btn reject-btn"
                >
                  Reject Quote
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No quotes received yet.</p>
        )}
      </div>
    </div>
  );
}