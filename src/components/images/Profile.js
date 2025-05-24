import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useUserData } from './UserContext';
import { Amplify } from 'aws-amplify';
import { getUrl } from 'aws-amplify/storage';
import './Profile.css';
import UploadSelfieToS3 from './UploadSelfieToS3';
import CameraCapture from './CameraCapture';

const ProfileContent = ({ user, signOut }) => {
  const { userData, loading, error, fetchUserData, updateUserData } = useUserData();
  const [form, setForm] = useState({
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
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState('/cluedo-placeholder.png');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user && user.username) {
      console.log('Fetching user data for:', user.username);
      fetchUserData(user.username);
      fetchSelfieImage(user.username);
    } else {
      console.error('User or username is undefined');
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    if (userData) {
      console.log('Updating form with user data');
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
    try {
      console.log('Fetching selfie image for user:', userId);
      const imageKey = `${userId}/Selfie.jpg`;
      const { url } = await getUrl({ key: imageKey });
      console.log('Fetched selfie URL:', url);
      setSelfieUrl(url);
    } catch (error) {
      console.error('Error fetching selfie image:', error);
      setSelfieUrl('/cluedo-placeholder.png');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      if (!form.firstName || !form.lastName) {
        throw new Error('First name and last name are required.');
      }

      console.log('Updating user data:', form);
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

      alert('Profile updated successfully!');
      fetchSelfieImage(form.id);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile: ' + (error.message || 'Unknown error'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSelfieCapture = async (dataUrl) => {
    setUploadingImage(true);
    try {
      console.log('Starting selfie capture process');
      const response = await fetch(dataUrl);
      console.log('Fetch response status:', response.status);
      const imageBlob = await response.blob();
      console.log('Image blob size:', imageBlob.size);
      
      if (!user || !user.username) {
        throw new Error('User or username is undefined');
      }
      
      const imageUrl = await UploadSelfieToS3(user.username, imageBlob);
      console.log('Image uploaded successfully, URL:', imageUrl);
      await fetchSelfieImage(user.username);
      alert('Selfie uploaded successfully!');
    } catch (error) {
      console.error('Error in handleSelfieCapture:', error);
      alert('Error uploading selfie: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="max-w-md mx-auto">
          <div className="profile-header">
            <h1>Profile Page</h1>
            <div className="profile-image-container">
              <img
                src={selfieUrl}
                alt="Profile"
                className="profile-image"
              />
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








