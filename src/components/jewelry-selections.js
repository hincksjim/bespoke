import React from 'react';
import { jewelryOptions } from './jewelryOptions';
import { getGemShapeImage, getGemstoneImage } from './gemImages';
import { colorMap } from './colourMap';

// This component renders the jewelry selection options for customization.
// It dynamically displays options based on the selected jewelry type and attributes.
export function JewelrySelections({ selectedOptions, handleOptionSelect, renderOptions }) {
  const applicableForCutAndClarity = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Topaz', 'Aquamarine', 'Tanzanite', 'Morganite', 'Alexandrite', 'Tourmaline', 'Spinel', 'Zircon'];

  return (
    <>
      {renderOptions('Budget', jewelryOptions.Budget)}
      {renderOptions('Gender', jewelryOptions.Gender)}
      {renderOptions('Style', jewelryOptions.Style)}
      {selectedOptions.Gender === 'Male' && renderOptions('Male_Jewellery', jewelryOptions.Male_Jewellery)}
      {selectedOptions.Gender === 'Female' && renderOptions('Female_Jewellery', jewelryOptions.Female_Jewellery)}
      {selectedOptions.Gender === 'unisex' && renderOptions('unisex_Jewellery', jewelryOptions.unisex_Jewellery)}
      {renderOptions('Base_Metal', jewelryOptions.Base_Metal)}
      {renderOptions('kwt', jewelryOptions.Kwt)}
      {(selectedOptions.Male_Jewellery?.includes('Ring') || selectedOptions.Female_Jewellery?.includes('Ring') || selectedOptions.unisex_Jewellery?.includes('Ring')) && (
        <>
          {renderOptions('Ring_Style', jewelryOptions.Ring_Style)}
          {renderOptions('Ring_Sizes_UK', jewelryOptions.Ring_Sizes_UK)}
          {renderOptions('Band_width', jewelryOptions.Band_width)}
          {renderOptions('Ring_Band_Style', jewelryOptions.Ring_Band_Style)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Earring') || selectedOptions.Female_Jewellery?.includes('Earring') || selectedOptions.unisex_Jewellery?.includes('Earring')) && (
        <>
          {renderOptions('Earring_Fastening_Types', jewelryOptions.Earring_Fastening_Types)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Bracelet') || selectedOptions.Female_Jewellery?.includes('Bracelet') || selectedOptions.unisex_Jewellery?.includes('Bracelet')) && (
        <>
          {renderOptions('Bracelet_Chain_Style', jewelryOptions.Bracelet_Chain_Style)}      
          {renderOptions('Bracelet_length', jewelryOptions.Bracelet_Length)}
          {renderOptions('Bracelet_Clasp_Types', jewelryOptions.Bracelet_Clasp_Types)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Brooch') || selectedOptions.Female_Jewellery?.includes('Brooch') || selectedOptions.unisex_Jewellery?.includes('Brooch')) && (
        <>
          {renderOptions('Brooch_Fastening_Types', jewelryOptions.Brooch_Fastening_Types)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Bangle') || selectedOptions.Female_Jewellery?.includes('Bangle') || selectedOptions.unisex_Jewellery?.includes('Bangle')) && (
        <>
          {renderOptions('Bracelet_length', jewelryOptions.Bracelet_Length)}
          {renderOptions('Bracelet_Clasp_Types', jewelryOptions.Bracelet_Clasp_Types)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Necklace') || selectedOptions.Female_Jewellery?.includes('Necklace') || selectedOptions.unisex_Jewellery?.includes('Necklace')) && (
        <>
          {renderOptions('Necklace_length', jewelryOptions.Necklace_Length)}
          {renderOptions('Necklace_Chain_Style', jewelryOptions.Necklace_Chain_Style)}
        </>
      )}
      {(selectedOptions.Male_Jewellery?.includes('Necklace') || selectedOptions.Female_Jewellery?.includes('Necklace') || selectedOptions.unisex_Jewellery?.includes('Necklace')) && (
        <>
          {selectedOptions.Necklace_Chain_Style && jewelryOptions.Necklace_Clasp[selectedOptions.Necklace_Chain_Style] && renderOptions('Necklace_Clasp', jewelryOptions.Necklace_Clasp[selectedOptions.Necklace_Chain_Style])}
        </>
      )}
      {renderOptions('Gemstone', jewelryOptions.Gemstone)}
      {renderOptions('Gemstone_Source', jewelryOptions.Gemstone_Source)}
      {selectedOptions.Gemstone && jewelryOptions.Gemstone_colour[selectedOptions.Gemstone] && renderOptions('Gemstone_colour', jewelryOptions.Gemstone_colour[selectedOptions.Gemstone])}
      {selectedOptions.Gemstone && jewelryOptions.Gem_Shapes[selectedOptions.Gemstone] && renderOptions('Gem_Shapes', jewelryOptions.Gem_Shapes[selectedOptions.Gemstone])}
      {renderOptions('Carat_Weight', jewelryOptions.Carat_Weight)}
      {selectedOptions.Gemstone && applicableForCutAndClarity.includes(selectedOptions.Gemstone) && (
        <>
          {renderOptions('Clarity', jewelryOptions.Clarity)}
          {renderOptions('Cut', jewelryOptions.Cut)}
        </>
      )}
      {selectedOptions.Gemstone && jewelryOptions.Gem_Settings[selectedOptions.Gemstone] && renderOptions('Gem_Settings', jewelryOptions.Gem_Settings[selectedOptions.Gemstone])}
      {renderOptions('Secondary_Gemstone', jewelryOptions.Secondary_Gemstone)}
    </>
  );
}