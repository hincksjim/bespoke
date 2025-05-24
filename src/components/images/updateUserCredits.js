// updateUserCredits.js
import { generateClient } from 'aws-amplify/api';
import { updateClient } from './graphql/mutations'; // Adjust the path to your mutations file

const client = generateClient();

export const updateUserCredits = async (clientId, newCreditAmount) => {
    try {
        const result = await client.graphql({
            query: updateClient,
            variables: { input: { id: clientId, credits: newCreditAmount } }
        });
        
        console.log('Credits updated successfully:', result);
        return result;
    } catch (error) {
        // Enhance error logging for better debugging
        console.error('Error updating user credits:', error);
        if (error.networkError) {
            console.error('Network error details:', error.networkError);
        }
        if (error.graphQLErrors) {
            console.error('GraphQL error details:', error.graphQLErrors);
        }
        throw new Error(`Error updating user credits: ${error.message || 'Unknown error'}`);
    }
};

export default updateUserCredits;


