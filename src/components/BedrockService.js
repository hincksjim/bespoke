import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getAuthenticatedCredentials } from './AuthService';

const bedrockRegion = 'us-east-1';

const BedrockService = {
  async generateImagesAndCostEstimate(prompt, costPrompt) {
    try {
      console.log('Attempting to get authenticated credentials...');
      const credentials = await getAuthenticatedCredentials();
      console.log('Credentials obtained successfully.');

      console.log('Initializing BedrockRuntimeClient...');
      const client = new BedrockRuntimeClient({
        region: bedrockRegion,
        credentials,
      });
      console.log('Image generation prompt:', prompt);

      const imageCommand = new InvokeModelCommand({
        modelId: "amazon.titan-image-generator-v2:0",
        body: JSON.stringify({
          taskType: "TEXT_IMAGE",
          textToImageParams: {
            text: prompt,
            negativeText: "dark"
          },
          imageGenerationConfig: {
            numberOfImages: 3,
            quality: "standard",
            cfgScale: 8.0,
            height: 512,
            width: 512,
            seed: 0
          }
        }),
      });
      
      console.log('Sending image generation command...');
      const imageResponse = await client.send(imageCommand);
      console.log('Image generation response received.');

      let images = [];
      if (imageResponse.body) {
        const bodyContent = new TextDecoder().decode(imageResponse.body);
        const parsedBody = JSON.parse(bodyContent);
        if (parsedBody && parsedBody.images) {
          images = parsedBody.images;
          console.log('Images extracted successfully.');
        } else {
          console.warn('Images not found in response:', parsedBody);
        }
      } else {
        console.warn('No body in image response:', imageResponse);
      }

      console.log('Cost estimation prompt:', costPrompt);
      const costCommand = new InvokeModelCommand({
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: costPrompt
            }
          ],
          temperature: 0,
          top_p: 1,
        }),
      });

      console.log('Sending cost estimation command...');
      const costResponse = await client.send(costCommand);
      console.log('Cost estimation response received.');

      let costEstimate = '';
      if (costResponse.body) {
        const bodyContent = new TextDecoder().decode(costResponse.body);
        const parsedBody = JSON.parse(bodyContent);
        if (parsedBody && parsedBody.content && parsedBody.content.length > 0) {
          costEstimate = parsedBody.content[0].text;
          console.log('Cost estimate extracted successfully.');
        } else {
          console.warn('Cost estimate not found in response:', parsedBody);
        }
      } else {
        console.warn('No body in cost response:', costResponse);
      }

      return { images, costEstimate };
    } catch (error) {
      console.error("Error generating images or cost estimate:", error);
      throw new Error("Error generating images or cost estimate: " + error.message);
    }
  },
};

export default BedrockService;









