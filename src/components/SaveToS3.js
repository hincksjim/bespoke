// This module provides a function to save image data to an S3 bucket.
// It converts a data URL to a Blob and uploads it to S3, returning the full URL of the uploaded image.

import { Amplify } from 'aws-amplify';
import { uploadData } from 'aws-amplify/storage';

const SaveToS3 = async (userId, creationId, imageDataUrl) => {
  console.log('Starting SaveToS3 function');
  console.log('User ID:', userId);
  console.log('Creation ID:', creationId);
  console.log('Image Data URL length:', imageDataUrl.length);

  const bucket = 'elegencejewllery-storage-63fc7a6c0e9b8-devjewll';
  const region = 'eu-west-2';

  console.log('S3 Bucket:', bucket);
  console.log('AWS Region:', region);

  try {
    console.log('Converting data URL to Blob...');
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    console.log('Blob created. Size:', blob.size, 'bytes');

    console.log('Attempting to upload to S3...');
    const result = await uploadData({
      key: `${userId}/${creationId}.jpg`, // Add 'public/' prefix here
      data: blob,
      options: {
        contentType: 'image/jpeg',
      }
    }).result;

    console.log('Full S3 upload result:', JSON.stringify(result, null, 2));
    console.log('Image saved successfully to S3:', result);
    
    const fullUrl = `https://${bucket}.s3.${region}.amazonaws.com/public/${userId}/${creationId}.jpg`; // Update URL construction
    console.log('Full S3 URL:', fullUrl);
    
    return fullUrl;
  } catch (error) {
    console.error('Error saving image to S3:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

export default SaveToS3;




