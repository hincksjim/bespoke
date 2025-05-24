// UserContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { getClient } from '../graphql/queries';
import { updateClient } from '../graphql/mutations';

const UserContext = createContext();
const client = generateClient();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  const fetchUserData = useCallback(async (username) => {
    if (!username) {
      console.log('No username provided to fetchUserData');
      setDebugInfo(prev => ({
        ...prev,
        lastError: 'No username provided',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to fetch user data for:', username);
      
      // Log the query details
      console.log('GraphQL Query Details:', {
        query: getClient.toString(),
        variables: { id: username },
        timestamp: new Date().toISOString()
      });

      setDebugInfo(prev => ({
        ...prev,
        lastAttempt: {
          username,
          timestamp: new Date().toISOString()
        }
      }));

      const response = await client.graphql({
        query: getClient,
        variables: { id: username }
      });

      // Log complete response for debugging
      console.log('Complete GraphQL Response:', JSON.stringify(response, null, 2));

      setDebugInfo(prev => ({
        ...prev,
        lastResponse: {
          hasData: !!response.data?.getClient,
          timestamp: new Date().toISOString()
        }
      }));

      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error(response.errors[0].message);
      }

      if (response.data?.getClient) {
        setUserData(response.data.getClient);
        console.log('User data successfully retrieved:', {
          userId: response.data.getClient.id,
          fields: Object.keys(response.data.getClient),
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn('No user data found for ID:', username);
        setError('No user data found');
        setDebugInfo(prev => ({
          ...prev,
          lastError: 'No data found in response',
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        errorType: error?.errors?.[0]?.errorType,
        errorPath: error?.errors?.[0]?.path,
        errorMessage: error?.errors?.[0]?.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };

      console.error('Detailed error information:', errorDetails);
      
      setDebugInfo(prev => ({
        ...prev,
        lastError: errorDetails
      }));

      // Determine specific error message
      let errorMessage = 'Error fetching user data';
      if (error.errors?.[0]?.errorType === 'Unauthorized') {
        errorMessage = 'Not authorized to access this data';
      } else if (error.errors?.[0]?.errorType === 'ValidationError') {
        errorMessage = 'Invalid user ID format';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error - please check your connection';
      } else if (error.message.includes('GraphQL error')) {
        errorMessage = `GraphQL error: ${error.errors?.[0]?.message || 'Unknown GraphQL error'}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = async (updatedData) => {
    if (!updatedData.id) {
      console.error('No ID provided for update');
      throw new Error('User ID is required for update');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Attempting to update user data:', {
        userId: updatedData.id,
        fields: Object.keys(updatedData),
        timestamp: new Date().toISOString()
      });

      setDebugInfo(prev => ({
        ...prev,
        lastUpdateAttempt: {
          userId: updatedData.id,
          timestamp: new Date().toISOString()
        }
      }));

      const response = await client.graphql({
        query: updateClient,
        variables: { input: updatedData }
      });

      console.log('Update response:', JSON.stringify(response, null, 2));

      if (response.errors) {
        console.error('GraphQL Update Errors:', response.errors);
        throw new Error(response.errors[0].message);
      }

      if (response.data?.updateClient) {
        setUserData(response.data.updateClient);
        console.log('User data successfully updated:', {
          userId: response.data.updateClient.id,
          timestamp: new Date().toISOString()
        });

        setDebugInfo(prev => ({
          ...prev,
          lastSuccessfulUpdate: {
            timestamp: new Date().toISOString()
          }
        }));
      } else {
        throw new Error('Update response missing data');
      }
    } catch (error) {
      const errorDetails = {
        message: error.message,
        name: error.name,
        errorType: error?.errors?.[0]?.errorType,
        errorPath: error?.errors?.[0]?.path,
        errorMessage: error?.errors?.[0]?.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };

      console.error('Update error details:', errorDetails);
      
      setDebugInfo(prev => ({
        ...prev,
        lastUpdateError: errorDetails
      }));

      let errorMessage = 'Error updating user data';
      if (error.errors?.[0]?.errorType === 'Unauthorized') {
        errorMessage = 'Not authorized to update this data';
      } else if (error.errors?.[0]?.errorType === 'ValidationError') {
        errorMessage = 'Invalid update data format';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Network error - please check your connection';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDebugInformation = useCallback(() => {
    return {
      currentState: {
        hasUserData: !!userData,
        isLoading: loading,
        currentError: error,
        userData: userData ? {
          id: userData.id,
          fields: Object.keys(userData)
        } : null
      },
    
      timestamp: new Date().toISOString()
    };
  }, [ error]);

  return (
    <UserContext.Provider 
      value={{ 
        userData, 
        loading, 
        error, 
        fetchUserData, 
        updateUserData,

      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserProvider');
  }
  return context;
};

export default UserProvider;
