import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { getAuthenticatedCredentials } from './AuthService';

const bedrockRegion = 'us-east-1';

const BedrockVariations = {
  async generateImageVariations(prompt,seedImage,Similarity_Strength,Prompt_Strength) {
    try {
      console.log('Attempting to get authenticated credentials...');
      const credentials = await getAuthenticatedCredentials();
      console.log('Credentials obtained successfully.');

      console.log('Initializing BedrockRuntimeClient...');
      const client = new BedrockRuntimeClient({
        region: bedrockRegion,
        credentials,
      });

      console.log('Image variation prompt:', prompt);
      console.log('similarity =',Similarity_Strength);
      console.log('prompt strength =', Prompt_Strength);
      // Ensure seedImage is in correct base64 format
      let base64Image = seedImage;
      if (!seedImage.startsWith('data:image')) {
        // If it's not a data URL, assume it's a file path or URL
        const response = await fetch(seedImage);
        const blob = await response.blob();
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }

      // Extract the base64 part if it's a data URL
      const base64Data = base64Image.split(',')[1] || base64Image;

      const imageCommand = new InvokeModelCommand({
        modelId: "amazon.titan-image-generator-v2:0",
        body: JSON.stringify({
          taskType: "IMAGE_VARIATION",
          imageVariationParams: {
            text: prompt,
            negativeText: "dark",
            images: [base64Data],
            similarityStrength: Similarity_Strength,         
          },
          imageGenerationConfig: {
            numberOfImages: 3,
            quality: "standard",
            cfgScale: Prompt_Strength,
            height: 512,
            width: 512,
            seed: 0,

          }
        }),
      });

      console.log('Sending image variation command...');
      const imageResponse = await client.send(imageCommand);
      console.log('Image variation response received.');

      let images = [];
      if (imageResponse.body) {
        const bodyContent = new TextDecoder().decode(imageResponse.body);
        const parsedBody = JSON.parse(bodyContent);
        if (parsedBody && parsedBody.images) {
          images = parsedBody.images;
          console.log('Image variations extracted successfully.');
        } else {
          console.warn('Image variations not found in response:', parsedBody);
        }
      } else {
        console.warn('No body in image response:', imageResponse);
      }

      return images;
    } catch (error) {
      console.error("Error generating image variations:", error);
      throw new Error("Error generating image variations: " + error.message);
    }
  },

  async estimateVariationCost(prompt, seedImage, promptStrength, numberOfVariations) {
    try {
      console.log('Attempting to get authenticated credentials...');
      const credentials = await getAuthenticatedCredentials();
      console.log('Credentials obtained successfully.');

      console.log('Initializing BedrockRuntimeClient...');
      const client = new BedrockRuntimeClient({
        region: bedrockRegion,
        credentials,
      });

      const costPrompt = `Estimate the cost of generating ${numberOfVariations} image variations using the following parameters:
      - Model: Amazon Titan Image Generator v2
      - Prompt: "${prompt}"
      - Seed Image: Provided (assume 512x512 resolution)
      - Prompt Strength: ${promptStrength}
      - Number of Variations: ${numberOfVariations}
      - Image Quality: Standard
      - CFG Scale: 8.0
      - Output Resolution: 512x512

      Please provide a rough estimate in USD.`;

      console.log('Cost estimation prompt:', costPrompt);
      const costCommand = new InvokeModelCommand({
        modelId: "amazon.titan-text-premier-v1:0",
        body: JSON.stringify({
          inputText: costPrompt,
          textGenerationConfig: {
            maxTokenCount: 300,
            stopSequences: [],
            temperature: 0,
            topP: 1
          }
        }),
      });

      console.log('Sending cost estimation command...');
      const costResponse = await client.send(costCommand);
      console.log('Cost estimation response received.');

      let costEstimate = '';
      if (costResponse.body) {
        const bodyContent = new TextDecoder().decode(costResponse.body);
        const parsedBody = JSON.parse(bodyContent);
        if (parsedBody && parsedBody.results && parsedBody.results[0] && parsedBody.results[0].outputText) {
          costEstimate = parsedBody.results[0].outputText;
          console.log('Cost estimate extracted successfully.');
        } else {
          console.warn('Cost estimate not found in response:', parsedBody);
        }
      } else {
        console.warn('No body in cost response:', costResponse);
      }

      return costEstimate;
    } catch (error) {
      console.error("Error estimating variation cost:", error);
      throw new Error("Error estimating variation cost: " + error.message);
    }
  },
};

export default BedrockVariations;