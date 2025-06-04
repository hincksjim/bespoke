import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import './ArtisanProfileSettings.css'; // You'll need to create this CSS file

const initialFormState = {
  id: '',
  Companyname: '',
  Companyaddress: '',
  Companypostcode: '',
  isactive: true,
  phone: '',
  email: '',
  interestedinMale: false,
  interestedinfemale: false,
  interestedinallgender: false,
  interestedinrings: false,
  interestedinnecklaces: false,
  interestedinbraclets: false,
  interestedinearrings: false,
  interestedinchains: false,
  interestedincufflinks: false,
  interstedinaljewellrytypes: false,
  agreedtoterms: false,
  ipaddress: '',
  Country: '',
  Currency: 'GBP',
  agreedtimestamp: '',
  createdAt: '',
  updatedAt: ''
};

const ArtisanProfileContent = ({ user, signOut }) => {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    token: null,
    error: null
  });

  const verifyAuthentication = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const accessToken = tokens?.accessToken?.toString();
      
      if (!accessToken) {
        throw new Error('No valid authentication token found');
      }

      setAuthState({
        isAuthenticated: true,
        token: accessToken,
        error: null
      });

      return true;
    } catch (error) {
      console.error('Authentication verification failed:', {
        error: error.message,
        name: error.name,
        code: error.code
      });

      setAuthState({
        isAuthenticated: false,
        token: null,
        error: error.message
      });

      return false;
    }
  };

  const fetchArtisanData = async (artisanId) => {
    try {
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }

      // TODO: Replace with your actual API endpoint for fetching artisan data
      const response = await fetch(`/api/artisan/${artisanId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const artisanData = await response.json();
      return artisanData;
    } catch (error) {
      console.error('Failed to fetch artisan data:', error);
      throw error;
    }
  };

  const updateArtisanData = async (updatedData) => {
    try {
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication required');
      }

      // TODO: Replace with your actual API endpoint for updating artisan data
      const response = await fetch(`/api/artisan/${updatedData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...updatedData,
          updatedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Failed to update artisan data:', error);
      throw error;
    }
  };

  const loadArtisanProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.username) {
        throw new Error('Username not available');
      }

      const artisanData = await fetchArtisanData(user.username);
      
      setForm({
        id: artisanData.id || user.username,
        Companyname: artisanData.Companyname || '',
        Companyaddress: artisanData.Companyaddress || '',
        Companypostcode: artisanData.Companypostcode || '',
        isactive: artisanData.isactive !== undefined ? artisanData.isactive : true,
        phone: artisanData.phone || '',
        email: artisanData.email || user.attributes?.email || '',
        interestedinMale: artisanData.interestedinMale || false,
        interestedinfemale: artisanData.interestedinfemale || false,
        interestedinallgender: artisanData.interestedinallgender || false,
        interestedinrings: artisanData.interestedinrings || false,
        interestedinnecklaces: artisanData.interestedinnecklaces || false,
        interestedinbraclets: artisanData.interestedinbraclets || false,
        interestedinearrings: artisanData.interestedinearrings || false,
        interestedinchains: artisanData.interestedinchains || false,
        interestedincufflinks: artisanData.interestedincufflinks || false,
        interstedinaljewellrytypes: artisanData.interstedinaljewellrytypes || false,
        agreedtoterms: artisanData.agreedtoterms || false,
        ipaddress: artisanData.ipaddress || '',
        Country: artisanData.Country || '',
        Currency: artisanData.Currency || 'GBP',
        agreedtimestamp: artisanData.agreedtimestamp || '',
        createdAt: artisanData.createdAt || '',
        updatedAt: artisanData.updatedAt || ''
      });

    } catch (error) {
      console.error('Profile loading failed:', error);
      setError(error.message);
      
      if (error.status === 401 || error.code === 'NotAuthorizedException') {
        alert('Your session has expired. Please sign in again.');
        signOut();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadArtisanProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      // Validation
      if (!form.Companyname.trim()) {
        throw new Error('Company name is required');
      }
      if (!form.phone.trim()) {
        throw new Error('Phone number is required');
      }
      if (!form.email.trim()) {
        throw new Error('Email is required');
      }

      await updateArtisanData(form);
      alert('Artisan profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', error);
      
      if (error.status === 401) {
        alert('Session expired. Please sign in again.');
        signOut();
      } else {
        alert(`Update failed: ${error.message}`);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  if (authState.error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{authState.error}</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  if (loading) {
    return <div className="loading-container">Loading artisan profile...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Profile</h2>
        <p className="error-message">{error}</p>
        <button onClick={loadArtisanProfile}>Retry</button>
      </div>
    );
  }

  return (
    <div className="artisan-profile-page">
      <div className="artisan-profile-container">
        <div className="max-w-4xl mx-auto">
          <div className="profile-header">
            <h1>Artisan Profile Settings</h1>
            <p>Manage your business profile and preferences</p>
          </div>
          
          <form onSubmit={handleSubmit} className="artisan-profile-form">
            {/* Company Information Section */}
            <div className="form-section">
              <h2>Company Information</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="Companyname">Company Name *</label>
                  <input
                    type="text"
                    id="Companyname"
                    name="Companyname"
                    value={form.Companyname}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Country">Country</label>
                  <select
                    id="Country"
                    name="Country"
                    value={form.Country}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Country</option>
                    <option value="UK">United Kingdom</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="Currency">Currency</label>
                  <select
                    id="Currency"
                    name="Currency"
                    value={form.Currency}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="Companyaddress">Company Address</label>
                <textarea
                  id="Companyaddress"
                  name="Companyaddress"
                  value={form.Companyaddress}
                  onChange={handleChange}
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="Companypostcode">Postcode</label>
                <input
                  type="text"
                  id="Companypostcode"
                  name="Companypostcode"
                  value={form.Companypostcode}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Gender Interests */}
            <div className="form-section">
              <h2>Target Audience</h2>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinMale"
                    name="interestedinMale"
                    checked={form.interestedinMale}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinMale">Male Customers</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinfemale"
                    name="interestedinfemale"
                    checked={form.interestedinfemale}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinfemale">Female Customers</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinallgender"
                    name="interestedinallgender"
                    checked={form.interestedinallgender}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinallgender">All Genders</label>
                </div>
              </div>
            </div>

            {/* Jewelry Specialties */}
            <div className="form-section">
              <h2>Jewelry Specialties</h2>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinrings"
                    name="interestedinrings"
                    checked={form.interestedinrings}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinrings">Rings</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinnecklaces"
                    name="interestedinnecklaces"
                    checked={form.interestedinnecklaces}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinnecklaces">Necklaces</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinbraclets"
                    name="interestedinbraclets"
                    checked={form.interestedinbraclets}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinbraclets">Bracelets</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinearrings"
                    name="interestedinearrings"
                    checked={form.interestedinearrings}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinearrings">Earrings</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedinchains"
                    name="interestedinchains"
                    checked={form.interestedinchains}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedinchains">Chains</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interestedincufflinks"
                    name="interestedincufflinks"
                    checked={form.interestedincufflinks}
                    onChange={handleChange}
                  />
                  <label htmlFor="interestedincufflinks">Cufflinks</label>
                </div>

                <div className="checkbox-item">
                  <input
                    type="checkbox"
                    id="interstedinaljewellrytypes"
                    name="interstedinaljewellrytypes"
                    checked={form.interstedinaljewellrytypes}
                    onChange={handleChange}
                  />
                  <label htmlFor="interstedinaljewellrytypes">All Jewelry Types</label>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="form-section">
              <h2>Account Status</h2>
              <div className="checkbox-item">
                <input
                  type="checkbox"
                  id="isactive"
                  name="isactive"
                  checked={form.isactive}
                  onChange={handleChange}
                />
                <label htmlFor="isactive">Account Active</label>
              </div>
            </div>

            {/* Read-only Information */}
            <div className="form-section">
              <h2>Account Information</h2>
              <div className="readonly-info">
                <p><strong>Account ID:</strong> {form.id}</p>
                <p><strong>IP Address:</strong> {form.ipaddress || 'Not recorded'}</p>
                <p><strong>Terms Agreed:</strong> {form.agreedtoterms ? 'Yes' : 'No'}</p>
                {form.agreedtimestamp && (
                  <p><strong>Terms Agreed Date:</strong> {new Date(form.agreedtimestamp).toLocaleString()}</p>
                )}
                {form.createdAt && (
                  <p><strong>Account Created:</strong> {new Date(form.createdAt).toLocaleString()}</p>
                )}
                {form.updatedAt && (
                  <p><strong>Last Updated:</strong> {new Date(form.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                disabled={updateLoading}
                className="save-button"
              >
                {updateLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ArtisanProfileSettings = () => (
  <Authenticator>
    {({ signOut, user }) => <ArtisanProfileContent user={user} signOut={signOut} />}
  </Authenticator>
);

export default ArtisanProfileSettings;