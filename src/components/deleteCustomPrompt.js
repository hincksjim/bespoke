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