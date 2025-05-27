import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useUserData } from './UserContext';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { getUrl } from 'aws-amplify/storage';
import './Profile.css';
import UploadSelfieToS3 from './UploadSelfieToS3';
import CameraCapture from './CameraCapturefull';

// This component manages the user profile, including authentication and profile updates.
// It integrates with AWS Amplify for authentication and storage.

const initialFormState = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  mobile: '+44',
  birthdate: '',
  Housenumber: '',
  Address1: '',
  Address2: '',
  City: '',
  Postcode: ''
};

const ProfileContent = ({ user, signOut }) => {
  const { userData, loading, error, fetchUserData, updateUserData } = useUserData();
  const [form, setForm] = useState(initialFormState);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState('/cluedo-placeholder.png');
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const loadUserProfile = async () => {
    try {
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication check failed');
      }

      console.log('Authentication state:', {
        username: user?.username,
        authenticated: isAuthenticated,
        tokenPresent: !!authState.token
      });

      if (!user?.username) {
        throw new Error('Username not available');
      }

      await fetchUserData(user.username);
    } catch (error) {
      console.error('Profile loading failed:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name
      });

      if (error.status === 401 || error.code === 'NotAuthorizedException') {
        alert('Your session has expired. Please sign in again.');
        signOut();
      }
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  useEffect(() => {
    if (userData) {
      setForm({
        id: userData.id || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        mobile: userData.mobile || '+44',
        birthdate: userData.birthdate || '',
        Housenumber: userData.Housenumber || '',
        Address1: userData.Address1 || '',
        Address2: userData.Address2 || '',
        City: userData.City || '',
        Postcode: userData.Postcode || ''
      });
      fetchSelfieImage(userData.id);
    }
  }, [userData]);

  const fetchSelfieImage = async (userId) => {
    if (!userId) return;
    
    try {
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication required to fetch image');
      }

      const imageKey = `${userId}/Selfie.jpg`;
      const { url } = await getUrl({ key: imageKey });
      setSelfieUrl(url);
    } catch (error) {
      console.error('Selfie fetch failed:', {
        error: error.message,
        userId,
        timestamp: new Date().toISOString()
      });
      setSelfieUrl('/cluedo-placeholder.png');
    }
  };

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
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication required to update profile');
      }

      if (!form.firstName || !form.lastName) {
        throw new Error('First name and last name are required');
      }

      await updateUserData({
        id: form.id,
        firstName: form.firstName,
        lastName: form.lastName,
        mobile: form.mobile,
        birthdate: form.birthdate,
        Housenumber: form.Housenumber,
        Address1: form.Address1,
        Address2: form.Address2,
        City: form.City,
        Postcode: form.Postcode
      });

      alert('Profile updated successfully');
    } catch (error) {
      console.error('Profile update failed:', {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });

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

  const handleSelfieCapture = async (dataUrl) => {
    setUploadingImage(true);

    try {
      const isAuthenticated = await verifyAuthentication();
      if (!isAuthenticated) {
        throw new Error('Authentication required to upload selfie');
      }

      const response = await fetch(dataUrl);
      const imageBlob = await response.blob();
      
      if (!user?.username) {
        throw new Error('Username not available');
      }

      await UploadSelfieToS3(user.username, imageBlob);
      await fetchSelfieImage(user.username);
      alert('Selfie uploaded successfully');
    } catch (error) {
      console.error('Selfie upload failed:', {
        error: error.message,
        username: user?.username,
        timestamp: new Date().toISOString()
      });
      alert(`Selfie upload failed: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  if (authState.error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{authState.error}</p>
        <button onClick={signOut}>Sign Out</button>
        <div className="debug-info">
          <h3>Debug Information</h3>
          <pre>
            {JSON.stringify({
              authState,
              username: user?.username,
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <div className="debug-info">
          <pre>
            {JSON.stringify({
              error,
              authState,
              timestamp: new Date().toISOString()
            }, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="max-w-md mx-auto">
          <div className="profile-header">
            <h1>Profile Page</h1>
            <div className="profile-image-container">
              <img src={selfieUrl} alt="Profile" className="profile-image" />
            </div>
            <CameraCapture onCapture={handleSelfieCapture} />
            {uploadingImage && <span>Uploading...</span>}
          </div>
          
          {userData ? (
            <div className="space-y-4">
              <p><strong>ID:</strong> {userData.id}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              
              <form onSubmit={handleSubmit} className="profile-form">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="mobile">Mobile (include +44)</label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="birthdate">Birthdate</label>
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="Housenumber">House Number</label>
                  <input
                    type="text"
                    id="Housenumber"
                    name="Housenumber"
                    value={form.Housenumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="Address1">Address 1</label>
                  <input
                    type="text"
                    id="Address1"
                    name="Address1"
                    value={form.Address1}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="Address2">Address 2</label>
                  <input
                    type="text"
                    id="Address2"
                    name="Address2"
                    value={form.Address2}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="City">City</label>
                  <input
                    type="text"
                    id="City"
                    name="City"
                    value={form.City}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="Postcode">Postcode</label>
                  <input
                    type="text"
                    id="Postcode"
                    name="Postcode"
                    value={form.Postcode}
                    onChange={handleChange}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={updateLoading}
                  className="profile-submit"
                >
                  {updateLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          ) : (
            <p>No user data available</p>
          )}
        </div>
      </div>
      

    </div>
  );
};

const Profile = () => (
  <Authenticator>
    {({ signOut, user }) => <ProfileContent user={user} signOut={signOut} />}
  </Authenticator>
);

export default Profile;








