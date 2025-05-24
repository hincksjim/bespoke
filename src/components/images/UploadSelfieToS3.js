
import { uploadData } from 'aws-amplify/storage';

const UploadSelfieToS3 = async (clientid, imageBlob) => {
  console.log('Starting UploadSelfieToS3 function');
  console.log('Client ID:', clientid);
  console.log('Image Blob Size:', imageBlob.size);

  const bucket = 'elegencejewllery-storage-63fc7a6c0e9b8-devjewll';
  const region = 'eu-west-2';

  try {
    console.log('Attempting to upload to S3...');
    const result = await uploadData({
      key: `${clientid}/Selfie.jpg`,
      data: imageBlob,
      options: {
        contentType: 'image/jpeg',
      }
    });

    console.log('S3 upload result:', result);

    const fullUrl = `https://${bucket}.s3.${region}.amazonaws.com/${clientid}/Selfie.jpg`;
    console.log('Full S3 URL:', fullUrl);

    return fullUrl;
  } catch (error) {
    console.error('Error saving image to S3:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    if (error.response) {
      console.error('Error response:', error.response);
    }
    throw error;
  }
};

export default UploadSelfieToS3;





