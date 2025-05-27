import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { listCreations } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';
import './OrdersTable.css';

// This component renders a table of orders for the authenticated user.
// It fetches designs from the backend and supports pagination and search functionality.

const client = generateClient();

export default function OrdersTable() {
  const { user } = useAuthenticator();
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const navigate = useNavigate();

  const designsPerPage = 9;

  const fetchDesigns = useCallback(async () => {
    try {
      if (!user) {
        console.error('No user is authenticated');
        return;
      }

      const response = await client.graphql({
        query: listCreations,
        variables: { 
          filter: { 
            clientID: { eq: user.username },
            submittedfororder: { eq: true }
          } 
        }
      });

      if (response.data && response.data.listCreations && response.data.listCreations.items) {
        setDesigns(response.data.listCreations.items);
      } else {
        console.error('Unexpected response format:', JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const handleViewDetails = (design) => {
    setSelectedDesign(design);
  };

  const closeModal = () => {
    setSelectedDesign(null);
  };

  const filteredDesigns = designs.filter(design => 
    (design.jewellrytype && design.jewellrytype.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!searchDate || new Date(design.createdAt).toLocaleDateString() === new Date(searchDate).toLocaleDateString())
  );

  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = filteredDesigns.slice(indexOfFirstDesign, indexOfLastDesign);

  const totalPages = Math.ceil(filteredDesigns.length / designsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const navigateToOrderDetails = (designId) => {
    navigate(`/Portal/order-details/${designId}`);
  };

  return (
    <main role="main">
      <h1>Your Orders</h1>
      <div>
        <input
          type="text"
          placeholder="Search by jewelry type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>

      {currentDesigns.length > 0 ? (
        <div className="designs-grid">
          {currentDesigns.map((design) => (
            <div key={design.id} className="design-card">
              <img
                src={design.url || "https://thegoldmarket.co.uk/wp-content/uploads/2018/03/diamond-1839031_1280.jpg"}
                alt={`Design ${design.id}`}
                className="design-image"
              />
              <div className="design-info">
                <h2>{design.id}</h2>
                <p>Status: {design.status || "Unknown"}</p>
                <p>Jewelry Type: {design.jewellrytype || "Not specified"}</p>
                <button onClick={() => handleViewDetails(design)} className="btn">
                  View Details
                </button>
                <button onClick={() => navigateToOrderDetails(design.id)} className="btn">
                  Go to Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}

      <div>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn"
        >
          Next
        </button>
      </div>

      {selectedDesign && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  src={selectedDesign.url || "https://thegoldmarket.co.uk/wp-content/uploads/2018/03/diamond-1839031_1280.jpg"}
                  alt={`Design ${selectedDesign.id}`}
                  className="modal-image"
                />
              </div>
              <div className="modal-details">
                {Object.entries(selectedDesign).map(([key, value]) => (
                  value !== null && (
                    <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
                  )
                ))}
              </div>
            </div>
            <button onClick={closeModal} className="btn close-btn">Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
