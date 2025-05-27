// This component provides a design tool for users to create and customize jewelry designs.
// It integrates various services like Bedrock for image generation and AWS for saving designs.

// Import necessary modules, services, and styles
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BedrockService from "./BedrockService";
import BedrockVariations from "./BedrockVariations";
import { JewelrySelections } from "./jewelry-selections";
import CameraCapture from "./CameraCapture";
import { Loader2 } from "lucide-react";
import SaveToDynamo from "./SaveToDynamo";
import SaveToS3 from "./SaveToS3";
import { useUserData } from "./UserContext"; // Using your existing context
import { updateCreationImageUrl } from "./updateCreationImageUrl";
import { updateUserCredits } from "./updateUserCredits";
import { imagePrompts, costPrompt } from "./prompts";
import { savePromptToS3, loadPromptsFromS3, deletePromptFromS3 } from "./SavePromptToS3";
import { useCountry } from "./CountryContext";
import { jewelryOptions } from "./jewelryOptions";
import { getGemShapeImage, getGemstoneImage } from "./gemImages";
import { colorMap } from "./colourMap";
import "./DesignTool.css"; // Create this file for styling if needed

const DesignTool = ({ signOut, user }) => { // Ensure user prop is received here
  const [selectedOptions, setSelectedOptions] = useState({});
  const [generatedImages, setGeneratedImages] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [costEstimate, setCostEstimate] = useState("");
  const [seedImage, setSeedImage] = useState(null);
  const [designMethod, setDesignMethod] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSeedImage, setHasSeedImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [isDeactivated, setIsDeactivated] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [customPromptName, setCustomPromptName] = useState("");
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [selectedSavedPrompt, setSelectedSavedPrompt] = useState("");

  const { userData, loading, error, fetchUserData } = useUserData();

  const navigate = useNavigate();
  const { country } = useCountry();

  // Set currency based on country
  const getCurrency = useCallback(() => {
    if (!country) return "USD";

    const currencyMap = {
      US: "USD",
      UK: "GBP",
      EU: "EUR",
      // Add more mappings as needed
    };

    return currencyMap[country] || "USD";
  }, [country]);

  // Load user data when component mounts or user changes
  useEffect(() => {
    console.log("DesignTool mounted or user prop changed.");
    console.log("User prop:", user); // Log user prop to see if it's being passed
    if (user?.username) {
      console.log("User with username detected, fetching data for:", user.username); // Log username
      fetchUserData(user.username);
    } else {
      console.log("User prop or username is not available, skipping fetchUserData.");
    }
  }, [user, fetchUserData]); // Dependency array includes user and fetchUserData

  // Effect to update local state when userData from context changes
  useEffect(() => {
    console.log("userData from context changed in DesignTool:", userData); // Log userData
    if (userData) {
      setUserCredits(userData.credits || 0);
      setIsDeactivated(userData.isactive === false);
      if (userData.isactive === false) {
        handleDeactivatedAccount();
      } else {
        setErrorMessage("");
      }
    }
  }, [userData]); // Dependency array includes userData

  const handleDeactivatedAccount = () => {
    setErrorMessage("Your account has been deactivated. Please contact support for more information.");
    setIsDeactivated(true);
  };

  const handleSignOut = () => {
    if (typeof signOut === "function") {
      signOut();
      navigate("/");
    } else {
      setErrorMessage("An error occurred while signing out. Please try again.");
    }
  };

  const getStatusColor = () => {
    if (isDeactivated) return "text-red";
    return "text-green";
  };

  // NOTE: ESLint warning 'getCreditsColor' is assigned a value but never used.
  // This function IS used in the JSX: <p className={`credits ${getCreditsColor()}`}>
  const getCreditsColor = () => {
    if (userCredits <= 10) return "text-red";
    if (userCredits <= 20) return "text-amber";
    return "text-green";
  };

  // Set default options based on budget
  const setDefaultsBasedOnBudget = useCallback(
    (budget) => {
      // Define default selections based on budget
      let defaults = {};

      if (budget === "less than 2k") {
        // Default to more affordable options
        defaults = {
          Gemstone_Source: "Labgrown",
          Base_Metal: "Silver",
          kwt: "9K",
          Carat_Weight: "0.30-4.3mm",
          Clarity: "SI2",
          Cut: "Good",
          Currency: getCurrency(),
        };
      } else if (budget === "2-5k") {
        // Default to mid-range options
        defaults = {
          Gemstone_Source: "Labgrown",
          Base_Metal: "Gold",
          kwt: "14K",
          Carat_Weight: "0.80-5.9mm",
          Clarity: "VS2",
          Cut: "Very Good",
          Currency: getCurrency(),
        };
      } else if (budget === "over 5k") {
        // Default to premium options
        defaults = {
          Gemstone_Source: "Natural",
          Base_Metal: "Platinum",
          kwt: "18K",
          Carat_Weight: "1.40-7.1mm",
          Clarity: "VVS2",
          Cut: "Excellent",
          Currency: getCurrency(),
        };
      }

      // Apply defaults to selected options
      setSelectedOptions((prev) => ({
        ...prev,
        ...defaults,
        Budget: budget,
      }));
    },
    [getCurrency],
  );

  const handleOptionSelect = useCallback(
    (category, value) => {
      if (category === "Budget") {
        // When budget changes, set defaults based on the new budget
        setDefaultsBasedOnBudget(value);
      } else {
        setSelectedOptions((prev) => ({
          ...prev,
          [category]: value,
        }));
      }
    },
    [setDefaultsBasedOnBudget],
  );

  const generatePrompt = () => {
    const jewelryType =
      selectedOptions.Male_Jewellery || selectedOptions.Female_Jewellery || selectedOptions.unisex_Jewellery || "";
    let prompt2 = "";

    if (jewelryType && jewelryType.includes("Ring")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style and a  ${selectedOptions.Ring_Style || ""} style ring with a ${selectedOptions.Band_width || ""} ${selectedOptions.Ring_Band_Style || ""} band. This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} set with a ${selectedOptions.Gem_Settings || ""} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} `;
    }
    if (jewelryType && jewelryType.includes("Necklace")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style . This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} set in a ${selectedOptions.Gem_Settings || ""} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} this is important -- show on a ${selectedOptions.Necklace_Chain_Style || ""} fitted on a ${selectedOptions.Necklace_Clasp || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Earring")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style with a ${selectedOptions.Earring_Fastening_Types || ""} fastening. This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} set in a ${selectedOptions.Gem_Settings || ""} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Bracelet")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style with a ${selectedOptions.Bracelet_Chain_Style || ""} chain and a ${selectedOptions.Bracelet_Clasp_Types || ""} clasp. This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Brooch")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style with a ${selectedOptions.Brooch_Fastening_Types || ""} fastening. This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} set in a ${selectedOptions.Gem_Settings || ""} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Pendant")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style with a ${selectedOptions.Necklace_Chain_Style || ""} chain and a ${selectedOptions.Necklace_Clasp || ""} clasp. This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Cufflinks")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style  This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} set in a ${selectedOptions.Gem_Settings || ""} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Bangle")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style and a ${selectedOptions.Bracelet_Clasp_Types || ""} fastening. This is made of ${selectedOptions.Base_Metal || ""} with a  ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Pin")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style . This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }
    if (jewelryType && jewelryType.includes("Clip")) {
      prompt2 = `in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} Style . This is made of ${selectedOptions.Base_Metal || ""} with a ${selectedOptions.Gem_Shapes || ""} cut ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
    }

    const basePrompt =
      (jewelryType && imagePrompts[jewelryType]) ||
      "Generate a high-definition photo-realistic image of a piece of jewelry";
    const prompt = `${basePrompt} ${prompt2}`;

    console.log("Prompt:", prompt);
    return prompt;
  };

  const handleNavigateToGallery = () => {
    navigate("/Portal/recent-designs-gallery");
  };

  const generatecostPrompt = () => {
    const jewelryType =
      selectedOptions.Male_Jewellery || selectedOptions.Female_Jewellery || selectedOptions.unisex_Jewellery || "";
    const currency = selectedOptions.Currency || getCurrency();

    const costPromptWithDetails = `using  ${costPrompt} ${selectedOptions.Gender || ""} ${jewelryType} in a ${selectedOptions.Style === "Custom" ? customPrompt : selectedOptions.Style || ""} style made of ${selectedOptions.Base_Metal || ""}, in a ${selectedOptions.Ring_Style || ""} style with a ${selectedOptions.Gemstone_Source || ""} ${selectedOptions.Gemstone_colour || ""} ${selectedOptions.Gemstone || ""} in a ${selectedOptions.Gem_Shapes || ""} cut gem of ${selectedOptions.Carat_Weight || ""} Carat_Weight with a clarity of ${selectedOptions.Clarity || ""} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ""}. Provide the cost in two distinct answers showing a starting price and an end price in ${currency}. The result should look like: The estimated guide price is likely to be between xxx and xxx as a guide price only, subject to the quality and grade of gems used summarize the output using bullet points on a separate new line for each bullet point, summarize into less than 512 characters.`;

    console.log("Cost Prompt:", costPromptWithDetails);
    return costPromptWithDetails;
  };

  const handleGenerateImages = async () => {
    if (!userData || !userData.id) {
      setErrorMessage("Please log in to generate images");
      return;
    }

    if (isDeactivated) {
      handleDeactivatedAccount();
      return;
    }

    const prompt = generatePrompt();
    const costPromptText = generatecostPrompt();
    // NOTE: ESLint warning 'negativePrompt' is assigned a value but never used.
    // This variable IS used in the BedrockService call below.
    const negativePrompt = "low quality, blurry, distorted, cartoon-style, text in image";


    if (userCredits < 3) {
      navigate("/payment");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);

    try {
      let images, costEstimate;

      if (hasSeedImage && seedImage) {
        console.log("Calling BedrockVariations for image variations...");
        images = await BedrockVariations.generateImageVariations(
          prompt,
          seedImage,
          selectedOptions.Similarity_Strength,
          selectedOptions.Prompt_Strength,
        );
        costEstimate = "N/A";
      } else {
        console.log("Calling BedrockService for image generation...");
        ({ images, costEstimate } = await BedrockService.generateImagesAndCostEstimate(
          prompt,
          costPromptText,
          userData,
          negativePrompt, // Used here
        ));
      }

      if (!images || !Array.isArray(images)) {
        throw new Error("No images were generated");
      }

      const imageUrls = images.map((base64) => `data:image/png;base64,${base64}`);
      setGeneratedImages(imageUrls);
      setCostEstimate(costEstimate);
      setErrorMessage("");

      const newCreditAmount = userCredits - 3;
      await updateUserCredits(userData.id, newCreditAmount);
      setUserCredits(newCreditAmount);
    } catch (error) {
      console.error("Error generating images or cost estimate:", error);
      setErrorMessage("Error: " + (error.message || "Unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVariations = async () => {
    if (!userData || !userData.id) {
      setErrorMessage("Please log in to create variations");
      return;
    }

    if (isDeactivated) {
      handleDeactivatedAccount();
      return;
    }

    if (!mainImage) {
      setErrorMessage("Please select an image before creating variations.");
      return;
    }

    if (userCredits < 3) {
      navigate("/payment");
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);

    try {
      const prompt = generatePrompt();
      const negativePrompt = "low quality, blurry, distorted, cartoon-style, text in image"; // Used here

      console.log("Calling BedrockVariations for image variations...");
      const images = await BedrockVariations.generateImageVariations(
        prompt,
        mainImage,
        selectedOptions.Similarity_Strength,
        selectedOptions.Prompt_Strength,
      );

      if (!images || !Array.isArray(images)) {
        throw new Error("No image variations were generated");
      }

      const imageUrls = images.map((base64) => `data:image/png;base64,${base64}`);
      setGeneratedImages(imageUrls);
      setErrorMessage("");

      const newCreditAmount = userCredits - 3;
      await updateUserCredits(userData.id, newCreditAmount);
      setUserCredits(newCreditAmount);
    } catch (error) {
      console.error("Error generating image variations:", error);
      setErrorMessage("Error: " + (error.message || "Unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (img) => {
    if (!img) return;

    setMainImage(img);
    setSeedImage(img);
    setHasSeedImage(true);
  };

  const handleSaveToGallery = async () => {
    if (!userData || !userData.id) {
      setErrorMessage("Please log in to save to gallery");
      setSuccessMessage("");
      return;
    }

    if (isDeactivated) {
      handleDeactivatedAccount();
      return;
    }

    if (!mainImage) {
      setErrorMessage("No image selected");
      setSuccessMessage("");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      console.log("useuserid =", userData.id);
      const clientID = userData.id;
      const prompt3 = generatePrompt();
      console.log("prompt3  =", prompt3);
      const creationId = await SaveToDynamo(clientID, selectedOptions, prompt3, costPrompt);

      if (!creationId) {
        throw new Error("Failed to save to database");
      }

      const finalImageUrl = await SaveToS3(clientID, creationId, mainImage);
      console.log("final Image Url", finalImageUrl);

      await updateCreationImageUrl(creationId, finalImageUrl);

      console.log("Creation saved successfully:", creationId);
      console.log("Image saved successfully:", finalImageUrl);

      // Set success message
      setSuccessMessage("Your design has been successfully saved to your gallery!");
    } catch (error) {
      console.error("Error saving to gallery:", error);
      setErrorMessage("Error saving to gallery: " + (error.message || "Unknown error occurred"));
      setSuccessMessage("");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const preloadImages = async () => {
      if (!jewelryOptions || !jewelryOptions.Gem_Shapes || !jewelryOptions.Gemstone) {
        console.error("Jewelry options not available for preloading images");
        return;
      }

      const shapes = Object.keys(jewelryOptions.Gem_Shapes);
      const gemstones = jewelryOptions.Gemstone;
      const allItems = [...shapes, ...gemstones];
      const imagePromises = allItems.map((item) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Add cross-origin attribute to prevent CORS issues
          img.src = shapes.includes(item) ? getGemShapeImage(item) : getGemstoneImage(item);
          img.onload = () => resolve(item);
          img.onerror = () => resolve(item);
        });
      });
      await Promise.all(imagePromises);
    };
    preloadImages();
  }, []);

  const handleSeedImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeedImage(reader.result);
        setHasSeedImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (imageDataUrl) => {
    if (!imageDataUrl) return;

    setSeedImage(imageDataUrl);
    setCapturedImage(imageDataUrl);
    setHasSeedImage(true);
  };

  const getColorForGemstone = useCallback((color) => {
    if (!color) return "";
    return colorMap[color] || color.toLowerCase();
  }, []);

  const renderOptions = useMemo(
    () => (category, optionsList) => {
      if (!category) return null;

      // Ensure options is an array before mapping
      const optionsArray = Array.isArray(optionsList) ? optionsList : [];

      return (
        <div className="option-group">
          <h3>{category}</h3>
          {optionsArray.map((option) => (
            <button
              key={option}
              className={`option-button ${selectedOptions[category] === option ? "selected" : ""}`}
              onClick={() => handleOptionSelect(category, option)}
            >
              {category === "Gem_Shapes" && (
                <div className="gem-shape-image-container">
                  <img
                    src={getGemShapeImage(option) || "/placeholder.svg"}
                    alt={`${option} shape`}
                    width={50}
                    height={50}
                    className="gem-shape-image"
                  />
                </div>
              )}
              {(category === "Gemstone" || category === "Secondary_Gemstone") && (
                <div className="gemstone-image-container">
                  <img
                    src={getGemstoneImage(option) || "/placeholder.svg"}
                    alt={`${option} gemstone`}
                    width={50}
                    height={50}
                    className="gemstone-image"
                  />
                </div>
              )}
              {category === "Gemstone_colour" && (
                <div className="gemstone-color-container">
                  <div
                    className="gemstone-color-disc"
                    style={{
                      background: getColorForGemstone(option),
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "10px",
                      opacity: "0.7",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )}
              <span className="option-text">{option}</span>
            </button>
          ))}
          {category === "Budget" && (
            <div className="budget-info mt-2 text-sm text-gray-600">
              <p>Selecting a budget will automatically set appropriate defaults for your jewelry design.</p>
            </div>
          )}
        </div>
      );
    },
    [selectedOptions, handleOptionSelect, getColorForGemstone],
  );

  // Define loadSavedPrompts before the useEffect that calls it
  const loadSavedPrompts = useCallback(async () => {
    if (!userData || !userData.id) {
      console.log("User data not available for loading prompts yet.");
      return;
    }
    console.log("Attempting to load saved prompts for user ID:", userData.id);
    try {
      const prompts = await loadPromptsFromS3(userData.id);
      if (Array.isArray(prompts)) {
        setSavedPrompts(prompts);
        console.log("Saved prompts loaded:", prompts);
      } else {
        console.error("Loaded prompts is not an array:", prompts);
        setSavedPrompts([]);
      }
    } catch (error) {
      console.error("Error loading saved prompts:", error);
      setSavedPrompts([]);
    }
  }, [userData]);


  // Add useEffect to load saved prompts when userData is available
  useEffect(() => {
    if (userData?.id) {
      loadSavedPrompts();
    }
  }, [userData, loadSavedPrompts]); // Dependency on userData and loadSavedPrompts


  const saveCustomPrompt = async () => {
    if (!userData || !userData.id) {
      setErrorMessage("Please log in to save custom prompts");
      return;
    }

    if (!customPrompt || !customPromptName) {
      setErrorMessage("Please enter both a prompt name and content");
      return;
    }

    // Check for duplicate prompt names
    if (savedPrompts.some((prompt) => prompt.name === customPromptName)) {
      setErrorMessage("A prompt with this name already exists. Please choose a different name.");
      return;
    }

    try {
      await savePromptToS3(userData.id, customPromptName, customPrompt);
      console.log("Custom prompt saved successfully", customPromptName, customPrompt);
      await loadSavedPrompts(); // Reload prompts after saving
      setCustomPrompt("");
      setCustomPromptName("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error saving custom prompt:", error);
      setErrorMessage("Error saving custom prompt: " + (error.message || "Unknown error occurred"));
    }
  };

  const deleteCustomPrompt = async () => {
    if (!userData || !userData.id) {
      setErrorMessage("Please log in to delete custom prompts");
      return;
    }

    if (!selectedSavedPrompt) {
      setErrorMessage("Please select a prompt to delete");
      return;
    }

    try {
      await deletePromptFromS3(userData.id, selectedSavedPrompt);
      console.log("Custom prompt deleted successfully", selectedSavedPrompt);
      await loadSavedPrompts(); // Reload prompts after deleting
      setSelectedSavedPrompt("");
      setCustomPrompt("");
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting custom prompt:", error);
      setErrorMessage("Error deleting custom prompt: " + (error.message || "Unknown error occurred"));
    }
  };

  const handleCustomPromptSelect = (event) => {
    const value = event.target.value;
    setSelectedSavedPrompt(value);
    const selectedPrompt = savedPrompts.find((prompt) => prompt.name === value);
    if (selectedPrompt) {
      setCustomPrompt(selectedPrompt.prompt);
    }
  };

  const renderCustomPromptSection = () => (
    <div className="custom-prompt-section option-group">
      <h3>Custom Prompt</h3>
      <label htmlFor="saved-prompts">Saved Prompts</label>
      <select
        id="saved-prompts"
        onChange={handleCustomPromptSelect}
        value={selectedSavedPrompt}
        className="select-input option-button w-full"
      >
        <option value="">Select a saved prompt</option>
        {savedPrompts.map((prompt) => (
          <option
            key={prompt.name}
            value={prompt.name}
            className={selectedSavedPrompt === prompt.name ? "bg-blue-500 text-white" : ""}
          >
            {prompt.name}
          </option>
        ))}
      </select>
      <label htmlFor="custom-prompt-name">Custom Prompt Name</label>
      <input
        id="custom-prompt-name"
        value={customPromptName}
        onChange={(e) => setCustomPromptName(e.target.value)}
        placeholder="Enter a name for your custom prompt"
        className="text-input option-button w-full"
      />
      <label htmlFor="custom-prompt">Custom Prompt</label>
      <textarea
        id="custom-prompt"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter your custom prompt"
        className="textarea-input option-button w-full"
      />
      <div className="flex justify-between mt-2">
        <button
          onClick={saveCustomPrompt}
          className="save-prompt-button option-button w-[48%] bg-blue-500 text-white border-2 border-yellow-500 rounded-md py-2 px-4 hover:bg-blue-600 transition-colors duration-200"
        >
          Save Custom Prompt
        </button>
        <button
          onClick={deleteCustomPrompt}
          disabled={!selectedSavedPrompt}
          className={`delete-prompt-button option-button w-[48%] ${
            selectedSavedPrompt
              ? "bg-blue-500 text-white border-2 border-yellow-500 hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } rounded-md py-2 px-4 transition-colors duration-200`}
        >
          Delete Selected Prompt
        </button>
      </div>
    </div>
  );

  const handleRestart = () => {
    setSelectedOptions({});
    setGeneratedImages([]);
    setMainImage(null);
    setErrorMessage("");
    setSuccessMessage("");
    setCostEstimate("");
    setSeedImage(null);
    setDesignMethod(null);
    setCapturedImage(null);
    setHasSeedImage(false);
    setCustomPrompt("");
    setCustomPromptName("");
    setSelectedSavedPrompt("");
  };

  if (isDeactivated) {
    return (
      <div className="deactivated-account">
        <h1>Account Deactivated</h1>
        <p className="error-message">Your account has been deactivated. Please contact support for more information.</p>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>
    );
  }

  // Display loading or error messages from the context
  if (loading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (error) {
    return (
      <div className="error">
        Error loading user data: {error}
        {/* Consider adding a retry button or instructions */}
      </div>
    );
  }

  // Only render the main content if userData is available and not loading/error
   if (!userData) {
       return <div className="loading">Waiting for user data...</div>;
   }


  return (
    <div className="design-tool-container">
      {/* User info bar showing name and credits */}
      <div className="user-info-bar">
        <div className="user-greeting">Hello, {userData?.firstName || userData?.name || "User"}</div>
        <div className="user-credits">
          <span className="credits-label">Credits:</span>
          <span className="credits-value">{userData?.credits || 0}</span>
        </div>
        {/* Display account status and sign out only if userData is available */}
        {userData && (
          <>
            <p className={`status ${getStatusColor()}`}>
              Account Status: {isDeactivated ? "Deactivated" : "Active"}
            </p>
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </button>
          </>
        )}
      </div>
      {/* Your design tool UI components go here */}
      <div className="design-tool-workspace">
        <h1>Design Tool</h1>
        <div className="design-tool">
          <div className="options-container">
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Jewellery Customisation</h2>
                <p className="card-description">Design your perfect piece of jewellery</p>
              </div>
              <div className="card-content">
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}
                <div className="seed-image-upload">
                  <p>
                    Have you seen something that you'd like to base your design on? If so, let's upload an image below
                    or alternatively use your camera to take a photo of a design you love:
                  </p>
                  <input type="file" accept="image/*" onChange={handleSeedImageUpload} className="file-input" />
                  <CameraCapture onCapture={handleCameraCapture} />
                  {(seedImage || capturedImage) && (
                    <div className="seed-image-preview">
                      <img src={seedImage || capturedImage} alt="Seed" className="preview-image" />
                    </div>
                  )}
                  {hasSeedImage && (
                    <div className="prompt-strength-section">
                      <h4>Prompt Strength</h4>
                      <p>
                        Select the prompt strength to control how much the generated images rely on the user selections
                        below:
                      </p>
                      {renderOptions("Prompt_Strength", jewelryOptions.Prompt_Strength)}
                      <p>
                        A low number will result in the selections not being included whilst a high number will enforce
                        those selections.
                      </p>
                      <h4>Similarity Strength</h4>
                      <p>
                        Select the Similarity strength to control how close the generated images will reflect the Seed
                        image:
                      </p>
                      {renderOptions("Similarity_Strength", jewelryOptions.Similarity_Strength)}
                      <p>
                        A low number will result in designs that will vary from the original design whilst a high number
                        will result in images that are close or exact to the original design.
                      </p>
                    </div>
                  )}
                  <p>If you uploaded an image, we can customise it further below:</p>
                </div>
                <div className="design-method-selection">
                  <button onClick={() => setDesignMethod("manual")} className="method-button">
                    Manually Select Options
                  </button>
                  <button onClick={() => setDesignMethod("chat")} className="method-button">
                    Coming Soon: Use Chat to Create Your Design
                  </button>
                </div>
                {designMethod === "manual" && (
                  <>
                    <JewelrySelections
                      selectedOptions={selectedOptions}
                      handleOptionSelect={handleOptionSelect}
                      renderOptions={renderOptions}
                    />
                    {selectedOptions.Style === "Custom" && renderCustomPromptSection()}
                  </>
                )}
              </div>
              <div className="card-footer">
                <button
                  onClick={handleGenerateImages}
                  disabled={isLoading || isDeactivated}
                  className={`generate-button ${isLoading || isDeactivated ? "disabled" : ""}`}
                >
                  {isLoading
                    ? "Generating..."
                    : isDeactivated
                      ? "Account Deactivated"
                      : `Generate Images (3 Credits) - ${userCredits} Credits Available`}
                </button>
              </div>
            </div>
          </div>
          <div className="image-generation-section">
            <div className="generated-images">
              {isLoading
                ? Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="image-placeholder">
                        <Loader2 className="loader" size={48} />
                      </div>
                    ))
                : generatedImages.map((img, index) => (
                    <img
                      key={index}
                      src={img || "/placeholder.svg"}
                      alt={`Generated ${index + 1}`}
                      className="generated-image"
                      onClick={() => handleImageSelect(img)}
                    />
                  ))}
            </div>
            {mainImage && (
              <div className="main-image-section">
                <img src={mainImage || "/placeholder.svg"} alt="Main" className="main-image" />
                <h3>Selected Image</h3>
                <div className="button-container">
                  <button
                    onClick={handleCreateVariations}
                    disabled={isLoading || isDeactivated}
                    className={`create-variations-button option-button ${isLoading || isDeactivated ? "disabled" : ""}`}
                  >
                    {isLoading
                      ? "Creating Variations..."
                      : isDeactivated
                        ? "Account Deactivated"
                        : "Create Variations (3 Credits)"}
                  </button>
                  <button
                    onClick={handleSaveToGallery}
                    disabled={isSaving || isDeactivated}
                    className={`save-button option-button ${isSaving || isDeactivated ? "disabled" : ""}`}
                  >
                    {isSaving ? "Saving..." : isDeactivated ? "Account Deactivated" : "Save to Gallery"}
                  </button>
                  <button onClick={handleRestart} className="restart-button option-button">
                    Restart Design
                  </button>
                  <button onClick={handleNavigateToGallery} className="gallery-button option-button">
                    Gallery
                  </button>
                </div>
              </div>
            )}
            {costEstimate && (
              <div className="cost-estimate-section">
                <h4>Cost Estimate:</h4>
                <p>{costEstimate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTool;