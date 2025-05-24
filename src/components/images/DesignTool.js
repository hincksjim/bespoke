import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BedrockService from './BedrockService';
import BedrockVariations from './BedrockVariations';
import '@aws-amplify/ui-react/styles.css';
import './DesignTool.css';
import { jewelryOptions } from './jewelryOptions';
import CameraCapture from './CameraCapture';
import { Loader2 } from 'lucide-react';
import SaveToDynamo from './SaveToDynamo';
import SaveToS3 from './SaveToS3';
import { useUserData } from './UserContext';
import { updateCreationImageUrl } from './updateCreationImageUrl';
import { updateUserCredits } from './updateUserCredits';
import { imagePrompts, costPrompt } from './prompts';
import { savePromptToS3, loadPromptsFromS3, deletePromptFromS3 } from './SavePromptToS3';
import { colorMap } from './colourMap';
import { getGemShapeImage, getGemstoneImage } from './gemImages';

export default function DesignTool({ signOut }) {
    const [selectedOptions, setSelectedOptions] = useState({});
    const [generatedImages, setGeneratedImages] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [costEstimate, setCostEstimate] = useState('');
    const [seedImage, setSeedImage] = useState(null);
    const [designMethod, setDesignMethod] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSeedImage, setHasSeedImage] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userCredits, setUserCredits] = useState(0);
    const [isDeactivated, setIsDeactivated] = useState(false);
    const [customPrompt, setCustomPrompt] = useState('');
    const [customPromptName, setCustomPromptName] = useState('');
    const [savedPrompts, setSavedPrompts] = useState([]);
    const [selectedSavedPrompt, setSelectedSavedPrompt] = useState('');

    const applicableForCutAndClarity = ['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Amethyst', 'Topaz', 'Aquamarine', 'Tanzanite', 'Morganite', 'Alexandrite', 'Tourmaline', 'Spinel', 'Zircon'];

    const { userData } = useUserData();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            setUserCredits(userData.credits || 0);
            setIsDeactivated(userData.isactive === false);
            if (userData.isactive === false) {
                handleDeactivatedAccount();
            } else {
                setErrorMessage('');
            }
        }
    }, [userData]);

    useEffect(() => {
        loadSavedPrompts();
    }, [userData.id]);

    const handleDeactivatedAccount = () => {
        setErrorMessage("Your account has been deactivated. Please contact support for more information.");
        setIsDeactivated(true);
    };

    const handleSignOut = () => {
        if (typeof signOut === 'function') {
            signOut();
            navigate('/');
        } else {
            setErrorMessage('An error occurred while signing out. Please try again.');
        }
    };

    const getStatusColor = () => {
        if (isDeactivated) return 'text-red';
        return 'text-green';
    };

    const getCreditsColor = () => {
        if (userCredits <= 10) return 'text-red';
        if (userCredits <= 20) return 'text-amber';
        return 'text-green';
    };

    const handleOptionSelect = useCallback((category, value) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [category]: value
        }));
    }, []);

    const generatePrompt = () => {
        const jewelryType = selectedOptions.Male_Jewellery || selectedOptions.Female_Jewellery || selectedOptions.unisex_Jewellery;
        let prompt2 = "";

        if (jewelryType && jewelryType.includes('Ring')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style and a ${selectedOptions.Ring_Style} style ring with a ${selectedOptions.Band_width} ${selectedOptions.Ring_Band_Style} band. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} set with a ${selectedOptions.Gem_Settings} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} `;
        }
        if (jewelryType && jewelryType.includes('Necklace')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style . This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} set in a ${selectedOptions.Gem_Settings} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} this is important -- show on a ${selectedOptions.Necklace_Chain_Style} fitted on a ${selectedOptions.Necklace_Clasp} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Earring')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style with a ${selectedOptions.Earring_Fastening_Types} fastening. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} set in a ${selectedOptions.Gem_Settings} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Bracelet')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style with a ${selectedOptions.Bracelet_Chain_Style} chain and a ${selectedOptions.Bracelet_Clasp_Types} clasp. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        } 
        if (jewelryType && jewelryType.includes('Brooch')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style with a ${selectedOptions.Brooch_Fastening_Types} fastening. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} set in a ${selectedOptions.Gem_Settings} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Pendant')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style with a ${selectedOptions.Necklace_Chain_Style} chain and a ${selectedOptions.Necklace_Clasp_Types} clasp. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }   
        if (jewelryType && jewelryType.includes('Cufflinks')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style  This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} set in a ${selectedOptions.Gem_Settings} setting with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Bangle')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style and a ${selectedOptions.Bracelet_Fastening_Types} fastening. This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Pin')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style . This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }
        if (jewelryType && jewelryType.includes('Clip')) {
            prompt2 = `in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} Style . This is made of ${selectedOptions.Base_Metal || ''} with a ${selectedOptions.Gem_Shapes || ''} cut ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''} with lighting to showcase the jewelry at its best and showing reflections off the gem`;
        }

        const basePrompt = imagePrompts[jewelryType] || "Generate a high-definition photo-realistic image of a piece of jewelry";
        let prompt = `${basePrompt} ${prompt2}`;
        
        console.log("Prompt:", prompt);
        return prompt;
    };

    const generatecostPrompt = () => {
        const jewelryType = selectedOptions.Male_Jewellery || selectedOptions.Female_Jewellery || selectedOptions.unisex_Jewellery;
        const costPromptWithDetails = `${costPrompt} ${selectedOptions.Gender} ${jewelryType} in a ${selectedOptions.Style === 'Custom' ? customPrompt : selectedOptions.Style} style made of ${selectedOptions.Base_Metal || ''}, in a ${selectedOptions.Ring_Style || ''} style with a ${selectedOptions.Gemstone_Source || ''} ${selectedOptions.Gemstone_colour} ${selectedOptions.Gemstone || ''} in a ${selectedOptions.Gem_Shapes || ''} cut gem of ${selectedOptions.Carat_Weight || ''} Carat_Weight with a clarity of ${selectedOptions.Clarity || ''} with smaller secondary gems of ${selectedOptions.Secondary_Gemstone || ''}. Provide the cost in two distinct answers showing a starting price and an end price. The result should look like: The estimated guide price is likely to be between xxx and xxx as a guide price only, subject to the quality and grade of gems used summarize the output using bullet points on a separate new line for each bullet point, summarize into less than 512 characters.`;
        
        console.log("Cost Prompt:", costPromptWithDetails);
        return costPromptWithDetails;
    };

    const handleGenerateImages = async () => {
        if (isDeactivated) {
            handleDeactivatedAccount();
            return;
        }

        const prompt = generatePrompt();
        const costPrompt = generatecostPrompt();
        const negativePrompt = "low quality, blurry, distorted, cartoon-style, text in image";

        if (userCredits < 3) {
            navigate('/payment');
            return;
        }

        setIsLoading(true);
        setGeneratedImages([]);

        try {
            let images, costEstimate;

            if  (hasSeedImage && seedImage) {
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
                    costPrompt, 
                    userData, 
                    negativePrompt, 
                ));
            }

            const imageUrls = images.map(base64 => `data:image/png;base64,${base64}`);
            setGeneratedImages(imageUrls);
            setCostEstimate(costEstimate);
            setErrorMessage('');

            const newCreditAmount = userCredits - 3;
            await updateUserCredits(userData.id, newCreditAmount);
            setUserCredits(newCreditAmount);

        } catch (error) {
            console.error("Error generating images or cost estimate:", error);
            setErrorMessage("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (img) => {
        setMainImage(img);
        setSeedImage(img);
        setHasSeedImage(true);
    };

    const handleSaveToGallery = async () => {
        if (isDeactivated) {
            handleDeactivatedAccount();
            return;
        }

        if (!mainImage || !userData.id) {
            console.error('No image selected or user not logged in');
            return;
        }

        setIsSaving(true);
        
        try {
            console.log('useuserid =', userData.id);
            const clientID = userData.id;

            const creationId = await SaveToDynamo(clientID, selectedOptions);
            const finalImageUrl = await SaveToS3(clientID, creationId, mainImage);
            console.log('final Image Url', finalImageUrl);

            await updateCreationImageUrl(creationId, finalImageUrl);

            console.log('Creation saved successfully:', creationId);
            console.log('Image saved successfully:', finalImageUrl);

        } catch (error) {
            console.error('Error saving to gallery:', error);
            setErrorMessage("Error saving to gallery: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const preloadImages = async () => {
            const shapes = Object.keys(jewelryOptions.Gem_Shapes);
            const gemstones = jewelryOptions.Gemstone;
            const allItems = [...shapes, ...gemstones];
            const imagePromises = allItems.map(item => {
                return new Promise((resolve) => {
                    const img = new Image();
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
        const file = event.target.files[0];
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
        setSeedImage(imageDataUrl);
        setCapturedImage(imageDataUrl);
        setHasSeedImage(true);
    };

    const getColorForGemstone = useCallback((color) => {
        return colorMap[color] || color.toLowerCase();
    }, []);

    const renderOptions = useMemo(() => (category, optionsList) => (
        <div className="option-group">
            <h3>{category}</h3>
            {optionsList && optionsList.map((option) => (
                <button
                    key={option}
                    className={`option-button ${selectedOptions[category] === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(category, option)}
                >
                    {category === 'Gem_Shapes' && (
                        <div className="gem-shape-image-container">
                            <img
                                src={getGemShapeImage(option)}
                                alt={`${option} shape`}
                                width={50}
                                height={50}
                                className="gem-shape-image"
                            />
                        </div>
                    )}
                    {(category === 'Gemstone' || category === 'Secondary_Gemstone') && (
                        <div className="gemstone-image-container">
                            <img
                                src={getGemstoneImage(option)}
                                alt={`${option} gemstone`}
                                width={50}
                                height={50}
                                className="gemstone-image"
                            />
                        </div>
                    )}
                    {category === 'Gemstone_colour' && (
                        <div className="gemstone-color-container">
                            <div
                                className="gemstone-color-disc"
                                style={{
                                    background: getColorForGemstone(option),
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '10px',
                                    opacity: '0.7',
                                    border: '1px solid #ccc'
                                }}
                            />
                        </div>
                    )}
                    <span className="option-text">{option}</span>
                </button>
            ))}
        </div>
    ), [selectedOptions, handleOptionSelect, getColorForGemstone]);

    const loadSavedPrompts = useCallback(async () => {
        try {
            const prompts = await loadPromptsFromS3(userData.id);
            setSavedPrompts(prompts);
        } catch (error) {
            console.error("Error loading saved prompts:", error);
        }
    }, [userData.id]);

    const saveCustomPrompt = async () => {
        if (!customPrompt || !customPromptName) return;

        // Check for duplicate prompt names
        if (savedPrompts.some(prompt => prompt.name === customPromptName)) {
            setErrorMessage("A prompt with this name already exists. Please choose a different name.");
            return;
        }

        try {
            await savePromptToS3(userData.id, customPromptName, customPrompt);
            console.log("Custom prompt saved successfully", customPromptName, customPrompt);
            await loadSavedPrompts();
            setCustomPrompt('');
            setCustomPromptName('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error saving custom prompt:", error);
            setErrorMessage("Error saving custom prompt: " + error.message);
        }
    };

    const deleteCustomPrompt = async () => {
        if (!selectedSavedPrompt) return;

        try {
            await deletePromptFromS3(userData.id, selectedSavedPrompt);
            console.log("Custom prompt deleted successfully", selectedSavedPrompt);
            await loadSavedPrompts();
            setSelectedSavedPrompt('');
            setCustomPrompt('');
            setErrorMessage('');
        } catch (error) {
            console.error("Error deleting custom prompt:", error);
            setErrorMessage("Error deleting custom prompt: " + error.message);
        }
    };

    const handleCustomPromptSelect = (event) => {
        const value = event.target.value;
        setSelectedSavedPrompt(value);
        const selectedPrompt = savedPrompts.find(prompt => prompt.name === value);
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
                        className={selectedSavedPrompt === prompt.name ? 'bg-blue-500 text-white' : ''}
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
                            ? 'bg-blue-500 text-white border-2 border-yellow-500 hover:bg-blue-600' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } rounded-md py-2 px-4 transition-colors duration-200`}
                >
                    Delete Selected Prompt
                </button>
            </div>
        </div>
    );

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

    return (
        <div className="design-tool">
            <div className="options-container">
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Jewellery Customisation</h2>
                        <p className="card-description">Design your perfect piece of jewelry</p>
                    </div>
                    <div className="card-content">
                        {userData && (
                            <div className="welcome-section">
                                <p className="welcome-text">Welcome, <span className="user-name">{userData.firstName}</span>!</p>
                                <p className={`credits ${getCreditsColor()}`}>Your Credits: {userCredits}</p>
                                <p className={`status ${getStatusColor()}`}>
                                    Account Status: {isDeactivated ? 'Deactivated' : 'Active'}
                                </p>
                                <button onClick={handleSignOut} className="sign-out-button">
                                    Sign Out
                                </button>
                            </div>
                        )}
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        <div className="seed-image-upload">
                            <p>Have you seen something that you'd like to base your design on? If so, let's upload an image below or alternatively use your camera to take a photo of a design you love:</p>
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
                                    <p>Select the prompt strength to control how much the generated images rely on the user selections below:</p>
                                    {renderOptions('Prompt_Strength', jewelryOptions.Prompt_Strength)}
                                    <p>A low number will result in the selections not being included whilst a high number will enforce those selections.</p>
                                   
                                    <h4>Similarity Strength</h4>
                                    <p>Select the Similarity strength to control how close the generated images will reflect the Seed image:</p>
                                    {renderOptions('Similarity_Strength', jewelryOptions.Similarity_Strength)}
                                    <p>A low number will result in designs that will vary from the original design whilst a high number will result in images that are close or exact to the original design.</p>
                                </div>
                            )}
                            <p>If you uploaded an image, we can customise it further below:</p>
                        </div>
                        <div className="design-method-selection">
                            <button onClick={() => setDesignMethod('manual')} className="method-button">Manually Select Options</button>
                            <button onClick={() => setDesignMethod('chat')} className="method-button">Coming Soon: Use Chat to Create Your Design</button>
                        </div>
                        {designMethod === 'manual' && (
                            <>
                                {renderOptions('Gender', jewelryOptions.Gender)}
                                {renderOptions('Style', jewelryOptions.Style)}
                                {selectedOptions.Style === 'Custom' && renderCustomPromptSection()}
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
                        )}
                    </div>
                    <div className="card-footer">
                        <button 
                            onClick={handleGenerateImages} 
                            disabled={isLoading}
                            className={`generate-button ${isLoading ? 'disabled' : ''}`}
                        >
                            {isLoading ? 'Generating...' : `Generate Images (3 Credits) - ${userCredits} Credits Available`}
                        </button>
                    </div>
                </div>
            </div>
            <div className="image-generation-section">
                <div className="generated-images">
                    {isLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <div key={index} className="image-placeholder">
                                <Loader2 className="loader" size={48} />
                            </div>
                        ))
                    ) : (
                        generatedImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Generated ${index + 1}`}
                                className="generated-image"
                                onClick={() => handleImageSelect(img)}
                            />
                        ))
                    )}
                </div>
                {mainImage && (
                    <div className="main-image-section">
                        <img src={mainImage} alt="Main" className="main-image" />
                        <h3>Selected Image</h3>
                        <button 
                            onClick={handleSaveToGallery} 
                            disabled={isSaving}
                            className={`save-button ${isSaving ? 'disabled' : ''}`}
                        >
                            {isSaving ? 'Saving...' : 'Save to Gallery'}
                        </button>
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
    );
}




























































