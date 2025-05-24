// UserContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getClient } from './graphql/queries';
import { updateClient } from './graphql/mutations';

const UserContext = createContext();
const client = generateClient();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async (username) => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      const response = await client.graphql({
        query: getClient,
        variables: { id: username }
      });
      if (response.data && response.data.getClient) {
        setUserData(response.data.getClient);
      } else {
        setError('No user data found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.graphql({
        query: updateClient,
        variables: { input: updatedData }
      });
      if (response.data && response.data.updateClient) {
        setUserData(response.data.updateClient);
      } else {
        throw new Error('Failed to update user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Error updating user data');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ userData, loading, error, fetchUserData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);