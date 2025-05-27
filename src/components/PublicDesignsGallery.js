import React, { useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import { useAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from '../aws-exports';
import './RecentDesignsGallery.css';
import { updateCreations } from '../graphql/mutations';
import { listCreations } from '../graphql/queries';

Amplify.configure(awsconfig);
const client = generateClient();

// This component displays a gallery of public designs.
// It supports liking designs, pagination, and sorting by various criteria.
export default function PublicDesignsGallery() {
  const { user } = useAuthenticator();
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [likedDesigns, setLikedDesigns] = useState([]);
  const [sortOption, setSortOption] = useState('recent'); // Default sort by most recent

  const designsPerPage = 9;



  // Function to load liked designs from local storage
  const loadLikedDesigns = () => {
    if (!user) return;
    
    const userId = user.username;
    const storedLikes = localStorage.getItem(`likedDesigns_${userId}`);
    
    if (storedLikes) {
      setLikedDesigns(JSON.parse(storedLikes));
    }
  };

  // Function to save liked designs to local storage
  const saveLikedDesigns = (designId) => {
    if (!user) return;
    
    const userId = user.username;
    const updatedLikes = [...likedDesigns, designId];
    
    localStorage.setItem(`likedDesigns_${userId}`, JSON.stringify(updatedLikes));
    setLikedDesigns(updatedLikes);
  };

  // Function to check if a design is already liked
  const isDesignLiked = (designId) => {
    return likedDesigns.includes(designId);
  };

  const fetchDesigns = async () => {
    try {
      if (!user) {
        console.error('No user is authenticated');
        setErrorMessage('Please log in to view designs.');
        setTimeout(() => setErrorMessage(''), 5000);
        return;
      }

      const response = await client.graphql({
        query: listCreations,
        variables: { filter: { shared: { eq: true } } }
      });

      if (response.data && response.data.listCreations && response.data.listCreations.items) {
        setDesigns(response.data.listCreations.items);
      } else {
        console.error('Unexpected response format:', JSON.stringify(response, null, 2));
        setErrorMessage('Error loading designs. Please try again later.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
      setErrorMessage('Failed to load designs. Please try again later.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

 useEffect(() => {
    fetchDesigns();
//   // Load liked designs from local storage when component mounts
    loadLikedDesigns();
  }, [user]);
 
  
  const handleLike = async (designId) => {
    // Prevent multiple rapid clicks or if already liked
    if (likeInProgress || isDesignLiked(designId)) return;
    
    try {
      setLikeInProgress(true);
      
      const designToUpdate = designs.find(design => design.id === designId);
      
      if (!designToUpdate) {
        throw new Error(`Design with ID ${designId} not found.`);
      }
      
      // Calculate current likes (default to 0 if undefined)
      const currentLikes = designToUpdate.likes || 0;
      
      const updateInput = {
        id: designId,
        likes: currentLikes + 1
      };
      
      const result = await client.graphql({
        query: updateCreations,
        variables: { input: updateInput }
      });
      
      if (result.data && result.data.updateCreations) {
        // Update the design in the local state
        setDesigns(prevDesigns =>
          prevDesigns.map(design =>
            design.id === designId 
              ? {...design, likes: (design.likes || 0) + 1}
              : design
          )
        );
        
        // If this is the selected design, update it as well
        if (selectedDesign && selectedDesign.id === designId) {
          setSelectedDesign({
            ...selectedDesign,
            likes: (selectedDesign.likes || 0) + 1
          });
        }
        
        // Save to liked designs
        saveLikedDesigns(designId);
        
        // Show success message briefly
        setSuccessMessage('Liked!');
        setTimeout(() => setSuccessMessage(''), 2000);
      } else {
        throw new Error('Unexpected result format');
      }
    } catch (error) {
      console.error('Error liking design:', error);
      const errorMsg = error.errors ? error.errors[0].message : 'Failed to like design';
      setErrorMessage(`Error: ${errorMsg}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLikeInProgress(false);
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
        url: designToUpdate.url,
        Likes: designToUpdate.likes
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

  const handleViewDetails = (design) => {
    setSelectedDesign(design);
  };

  const closeModal = () => {
    setSelectedDesign(null);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Apply filtering
  const filteredDesigns = designs.filter(design => 
    (design.jewellrytype && design.jewellrytype.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!searchDate || new Date(design.createdAt).toLocaleDateString() === new Date(searchDate).toLocaleDateString())
  );

  // Apply sorting
  const sortDesigns = (designs) => {
    const sortedDesigns = [...designs];
    
    switch (sortOption) {
      case 'recent':
        return sortedDesigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'likes':
        return sortedDesigns.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      default:
        return sortedDesigns;
    }
  };

  const sortedAndFilteredDesigns = sortDesigns(filteredDesigns);

  // Handle pagination
  const indexOfLastDesign = currentPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = sortedAndFilteredDesigns.slice(indexOfFirstDesign, indexOfLastDesign);

  const totalPages = Math.max(1, Math.ceil(sortedAndFilteredDesigns.length / designsPerPage));

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <main role="main">
      <h1>Public Gallery</h1>
      <button
        className="btn new-design-btn yellow-btn"
        onClick={() => window.location.href = '/Portal/design-tool'}
      >
        Create New Design
      </button>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by jewellery type"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="search-input"
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => {
              setSearchDate(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="date-input"
          />
        </div>
        
        <div className="sort-container">
          <label htmlFor="sort-select">Sort by: </label>
          <select 
            id="sort-select"
            value={sortOption}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="recent">Most Recent</option>
            <option value="likes">Most Liked</option>
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
                <div className="likes-container">
                  <button 
                    onClick={() => handleLike(design.id)} 
                    className={`btn like-btn ${isDesignLiked(design.id) ? 'liked' : ''}`}
                    disabled={likeInProgress || isDesignLiked(design.id)}
                  >
                    {isDesignLiked(design.id) ? '❤️ Liked' : '❤️ Like'}
                  </button>
                  <span className="likes-count">{design.likes || 0} likes</span>
                </div>
                <p>Jewellery Type: {design.jewellrytype || "Not specified"}</p>
                <p>Gender Type: {design.gender || "Not specified"}</p>
                <p className="design-date">Created: {new Date(design.createdAt).toLocaleDateString()}</p>
                <div className="design-actions">
                  <button onClick={() => handleViewDetails(design)} className="btn view-btn">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-designs">
          <p>No designs found. Try adjusting your search or creating a new design.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn pagination-btn"
          >
            Next
          </button>
        </div>
      )}

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
                <div className="likes-container modal-likes">
                  <button 
                    onClick={() => handleLike(selectedDesign.id)} 
                    className={`btn like-btn ${isDesignLiked(selectedDesign.id) ? 'liked' : ''}`}
                    disabled={likeInProgress || isDesignLiked(selectedDesign.id)}
                  >
                    {isDesignLiked(selectedDesign.id) ? '❤️ Liked' : '❤️ Like'}
                  </button>
                  <span className="likes-count">{selectedDesign.likes || 0} likes</span>
                </div>
              </div>
            </div>
            <button onClick={closeModal} className="btn close-btn">Close</button>
          </div>
        </div>
      )}
    </main>
  );
}

