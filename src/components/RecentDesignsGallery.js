import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';
import './RecentDesignsGallery.css';
import { updateCreations, deleteCreations } from '../graphql/mutations';
import { listCreations } from '../graphql/queries';

Amplify.configure(awsconfig);
const client = generateClient();

export default function RecentDesignsGallery() {
  const { user } = useAuthenticator();
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortOption, setSortOption] = useState('newest'); // Default sort is by newest

  const designsPerPage = 9;

  useEffect(() => {
    fetchDesigns();
  }, [user]);

  const fetchDesigns = async () => {
    try {
      if (!user) {
        console.error('No user is authenticated');
        return;
      }

      const response = await client.graphql({
        query: listCreations,
        variables: { filter: { clientID: { eq: user.username } } }
      });

      if (response.data && response.data.listCreations && response.data.listCreations.items) {
        setDesigns(response.data.listCreations.items);
      } else {
        console.error('Unexpected response format:', JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
    }
  };

  const handleRequestQuote = async (designId) => {
    try {
      const designToUpdate = designs.find(design => design.id === designId);

      if (!designToUpdate) {
        throw new Error(`Design with ID ${designId} not found.`);
      }

      const updateInput = {
        clientID: designToUpdate.clientID,
        id: designId,
        gender: designToUpdate.Gender,
        jewellrytype: designToUpdate.Male_Jewellery || designToUpdate.Female_Jewellery || designToUpdate.unisex_Jewellery,
        Style: designToUpdate.Style,
        material: designToUpdate.Base_Metal,
        kwt: designToUpdate.kwt,
        shape: designToUpdate.Gem_Shapes,
        colour: designToUpdate.Gemstone_colour,
        stone: designToUpdate.Gemstone,
        grade: designToUpdate.Clarity,
        gemsize: designToUpdate.Carat_Weight,
        ringsize: designToUpdate.Ring_Sizes_UK,
        ringstyle: designToUpdate.Ring_Style,
        status: 'Submitted for Quotes',
        submittedforquote: true,
        Gemsource: designToUpdate.Gemstone_Source,
        Estimatecostfrom: 0.0,
        Estimatecostto: 0.0,
        url: designToUpdate.url
      };

      const result = await client.graphql({
        query: updateCreations,
        variables: { input: updateInput }
      });

      if (result.data && result.data.updateCreations) {
        setDesigns(prevDesigns =>
          prevDesigns.map(design =>
            design.id === designId ? result.data.updateCreations : design
          )
        );

        setSuccessMessage('Design successfully submitted for quoting');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Unexpected result format');
      }
    } catch (error) {
      console.error('Error requesting quote:', error);
      const errorMsg = error.errors ? error.errors[0].message : 'Failed to submit for quoting';
      setErrorMessage(`Error: ${errorMsg}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleToggleShare = async (designId, currentSharedStatus) => {
    try {
      const designToUpdate = designs.find(design => design.id === designId);

      if (!designToUpdate) {
        throw new Error(`Design with ID ${designId} not found.`);
      }

      const newSharedStatus = !currentSharedStatus;

      const updateInput = {
        id: designId,
        shared: newSharedStatus
      };

      const result = await client.graphql({
        query: updateCreations,
        variables: { input: updateInput }
      });

      if (result.data && result.data.updateCreations) {
        setDesigns(prevDesigns =>
          prevDesigns.map(design =>
            design.id === designId ? result.data.updateCreations : design
          )
        );

        setSuccessMessage(`Design ${newSharedStatus ? 'shared to' : 'removed from'} public gallery`);
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error('Unexpected result format');
      }
    } catch (error) {
      console.error('Error toggling share status:', error);
      const errorMsg = error.errors ? error.errors[0].message : 'Failed to update sharing status';
      setErrorMessage(`Error: ${errorMsg}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleDeleteDesign = async (designId) => {
    const design = designs.find(d => d.id === designId);

    if (!design) return;

    if (design.submittedforquote) {
      alert('This item has been submitted for quotes so cannot be deleted');
      return;
    }

    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await client.graphql({
          query: deleteCreations,
          variables: {
            input: { id: designId }
          }
        });

        setDesigns(designs.filter(design => design.id !== designId));
        setSuccessMessage('Design successfully deleted');
        setTimeout(() => setSuccessMessage(''), 5000);
      } catch (error) {
        console.error('Error deleting design:', error);
        setErrorMessage('Failed to delete design');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleViewDetails = (design) => {
    setSelectedDesign(design);
  };

  const closeModal = () => {
    setSelectedDesign(null);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const filteredDesigns = designs.filter(design => 
    (design.jewellrytype && design.jewellrytype.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!searchDate || new Date(design.createdAt).toLocaleDateString() === new Date(searchDate).toLocaleDateString())
  );

  // Apply sorting to the filtered designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'mostLiked':
        // Assuming there's a 'likes' field; if not, we'll need to add it
        const aLikes = a.likes || 0;
        const bLikes = b.likes || 0;
        return bLikes - aLikes;
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = sortedDesigns.slice(indexOfFirstDesign, indexOfLastDesign);

  const totalPages = Math.ceil(sortedDesigns.length / designsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <main role="main">
      <h1>My Designs</h1>
      <button
        className="btn new-design-btn yellow-btn"
        onClick={() => window.location.href = '/Portal/design-tool'}
      >
        Create New Design
      </button>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      <div className="filters-container">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by jewellery type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="date-input"
          />
        </div>
        
        <div className="sort-options">
          <label htmlFor="sort-select">Sort by: </label>
          <select 
            id="sort-select" 
            value={sortOption} 
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostLiked">Most Liked</option>
          </select>
        </div>
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
                <p>Jewellery Type: {design.jewellrytype || "Not specified"}</p>
                {design.likes !== undefined && (
                  <p>Likes: {design.likes}</p>
                )}
                <p>Created: {new Date(design.createdAt).toLocaleDateString()}</p>
                <button onClick={() => handleRequestQuote(design.id)} className="btn green-btn">
                  {design.submittedforquote ? 'Submitted for Quotes' : 'Request Quote'}
                </button>
                <button onClick={() => handleDeleteDesign(design.id)} className="btn red-btn">
                  Delete Design
                </button>
                <button onClick={() => handleViewDetails(design)} className="btn">
                  View Details
                </button>
                <button 
                  onClick={() => handleToggleShare(design.id, design.shared)} 
                  className={`btn ${design.shared ? 'yellow-btn' : 'blue-btn'}`}
                >
                  {design.shared ? 'Remove from Public Gallery' : 'Share to Public Gallery'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No designs found. Try creating a new design.</p>
      )}

      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages || 1}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
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