import { Amplify } from 'aws-amplify';
import { uploadData, getUrl } from 'aws-amplify/storage';


const bucket = 'elegencejewllery-storage-63fc7a6c0e9b8-devjewll';
const region = 'eu-west-2';

export const savePromptToS3 = async (userId, promptName, promptContent) => {
    try {
        // Load existing prompts or initialize an empty array
        const existingPrompts = await loadPromptsFromS3(userId) || [];

        // Add new prompt
        existingPrompts.push({ name: promptName, prompt: promptContent });

        // Convert to JSON string
        const promptsJson = JSON.stringify(existingPrompts);

        // Upload to S3
        const result = await uploadData({
            key: `${userId}/custom_prompts.json`,
            data: promptsJson,
            options: {
                contentType: 'application/json',
            }
        }).result;

        console.log('Prompts saved successfully to S3:', result);
        return result;
    } catch (error) {
        console.error('Error saving prompts to S3:', error);
        throw error;
    }
};

export const loadPromptsFromS3 = async (userId) => {
    try {
        const { url } = await getUrl({
            key: `${userId}/custom_prompts.json`,

        });
        console.log('URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 404) {
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const prompts = await response.json();
        console.log('Prompts loaded successfully from S3:', prompts);
        return prompts;
    } catch (error) {
        if (error.message.includes('404')) {
            return [];
        }
        throw error;
    }
};
export const deletePromptFromS3 = async (userId, promptName, promptContent) => {
    try {
        // Load existing prompts or initialize an empty array
        const existingPrompts = await loadPromptsFromS3(userId) || [];

        // Add new prompt
        existingPrompts.delete({ name: promptName, prompt: promptContent });

        // Convert to JSON string
        const promptsJson = JSON.stringify(existingPrompts);

        // Upload to S3
        const result = await uploadData({
            key: `${userId}/custom_prompts.json`,
            data: promptsJson,
            options: {
                contentType: 'application/json',
            }
        }).result;

        console.log('Prompts deleted successfully from S3:', result);
        return result;
    } catch (error) {
        console.error('Error deleting prompts from S3:', error);
        throw error;
    }
};