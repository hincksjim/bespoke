// This function deletes a custom prompt from S3 and updates the UI accordingly.

// Check if a prompt is selected before proceeding
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