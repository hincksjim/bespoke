import { generateClient } from 'aws-amplify/api';
import { createCreations } from '../graphql/mutations';

const client = generateClient();
const SaveToDynamo = async (clientID, selectedOptions,prompt3,costprompt) => {
  console.log('Client ID:', clientID);
  console.log('Prompt3 passed is :', prompt3);
  console.log('Cost Prompt:', costprompt);
  console.log('Selected Options:', selectedOptions);
  const creationInput = {
    clientID: clientID,
    gender: selectedOptions.Gender,
    prompt: prompt3,
    costprompt: costprompt,
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
    Estimatecostto: 0.0,
    cut: selectedOptions.Cut,
    submittedfororder: false,
    clarity: selectedOptions.Clarity,
    bandwidth: selectedOptions.Band_Width,
    Prompt_Strength: selectedOptions.Prompt_Strength,
    Similarity_Strength: selectedOptions.Similarity_Strength,
    seedurl: selectedOptions.Seed_URL,
    Necklace_Length: selectedOptions.Necklace_Length,
    Bracelet_Length: selectedOptions.Bracelet_Length,
    Secondary_Gemstone: selectedOptions.Secondary_Gemstone,
    Earring_Style: selectedOptions.Earring_Style,
    Earring_Fastening_Types: selectedOptions.Earring_Fastening_Type,
    Bracelet_Clasp_Types: selectedOptions.Bracelet_Clasp_Type,
    Ring_Band_Style: selectedOptions.Ring_Band_Style,
    Ring_Setting: selectedOptions.Ring_Setting,
    Necklace_Chain_Style: selectedOptions.Necklace_Chain_Style,
    Bracelet_Chain_Style: selectedOptions.Bracelet_Chain_Style,
    Brooch_Fastening_Types: selectedOptions.Brooch_Fastening_Type,
    Necklace_Clasp: selectedOptions.Necklace_Clasp,
    Bracelet_Clasp: selectedOptions.Bracelet_Clasp,
    Gem_Settings: selectedOptions.Gem_Setting
  };
  console.log('Client ID:', clientID);
  console.log('Creation Input:', creationInput);
  try {
    const result = await client.graphql({
      query: createCreations,
      variables: { input: creationInput }
    });

    // Log the full response to check structure
    console.log('Full result:', result);

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
