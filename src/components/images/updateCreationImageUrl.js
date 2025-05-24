// UpdateCreation.js
import { generateClient } from 'aws-amplify/api';
import { updateCreations } from './graphql/mutations';

const client = generateClient();

export const updateCreationImageUrl = async (creationId, imageUrl) => {
    try {
        console.log('imageUrl',imageUrl);
        const result = await client.graphql({
            query: updateCreations,
            variables: { input: { id: creationId, url: imageUrl } }
        });
        
        console.log('Creation updated successfully:', result);
        return result;
    } catch (error) {
        console.error('Error updating creation image URL:', error);
        throw new Error("Error updating creation image URL: " + error.message);
    }
};
