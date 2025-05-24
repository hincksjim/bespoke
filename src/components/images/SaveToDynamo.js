import { generateClient } from 'aws-amplify/api';
import { createCreations } from './graphql/mutations';

const client = generateClient();

const SaveToDynamo = async (clientID, selectedOptions) => {
  const creationInput = {
    clientID: clientID,
    gender: selectedOptions.Gender,
    jewellrytype: selectedOptions.Male_Jewellery || selectedOptions.Female_Jewellery || selectedOptions.unisex_Jewellery,
    Style: selectedOptions.Style,
    material: selectedOptions.Base_Metal,
    kwt: selectedOptions.kwt,
    shape: selectedOptions.Gem_Shapes,
    colour: selectedOptions.Gemstone_colour,
    stone: selectedOptions.Gemstone,
    grade: selectedOptions.Clarity,
    gemsize: selectedOptions.Carat_Weight,
    ringsize: selectedOptions.Ring_Sizes_UK,
    ringstyle: selectedOptions.Ring_Style,
    status: 'Created',
    submittedforquote: false,
    Gemsource: selectedOptions.Gemstone_Source,
    Estimatecostfrom: 0.0,
    Estimatecostto: 0.0
  };

  try {
    const result = await client.graphql({
      query: createCreations,
      variables: { input: creationInput }
    });

    // Log the full response to check structure
    console.log('Full result:', JSON.stringify(result, null, 2));

    // Safely extract the creation ID (navigate the full response structure)
    const creationId = result?.data?.createCreations?.id; // Use optional chaining to avoid errors if the structure isn't as expected

    if (creationId) {
      console.log('Creation saved successfully with ID:', creationId);
    } else {
      console.log('ID not found in the result');
    }

    return creationId; // Return the creation ID

  } catch (error) {
    console.error('Error saving creation to DynamoDB:', error);
    throw error;
  }
};

export default SaveToDynamo;
