
/**
 * Save disease analysis results to the user's garden
 * @param {string} imageUrl - URL of the analyzed plant image
 * @param {object} result - Disease analysis results
 * @param {string} rawResponse - Raw AI response for the analysis
 */
export const saveToGarden = async (imageUrl, result, rawResponse) => {
  try {
    console.log("Saving to garden:", { imageUrl, result });
    // TODO: Implementation for saving to garden database
    return true;
  } catch (error) {
    console.error("Error saving to garden:", error);
    throw error;
  }
};

/**
 * Share disease analysis results
 * @param {object} result - Disease analysis results
 */
export const shareDiseaseResults = async (result) => {
  try {
    console.log("Sharing results:", result);
    
    if (navigator.share) {
      await navigator.share({
        title: `Plant Disease: ${result.disease}`,
        text: `I identified a plant disease using Plant Care: ${result.disease}. ${result.description}`,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Sharing is not supported on this browser");
    }
    
    return true;
  } catch (error) {
    console.error("Error sharing results:", error);
    if (error.name !== "AbortError") {
      // AbortError occurs when user cancels the share dialog
      throw error;
    }
  }
};

/**
 * Download disease analysis results as a text file
 * @param {object} result - Disease analysis results
 * @param {string} rawResponse - Raw AI response for the analysis
 */
export const downloadDiseaseResults = (result, rawResponse) => {
  try {
    const diseaseReport = `
Plant Disease Analysis
=====================

Disease: ${result.disease}

Description:
${result.description}

${result.treatment ? `Treatment:\n${result.treatment}\n\n` : ''}
${result.prevention ? `Prevention:\n${result.prevention}\n\n` : ''}

Analysis Date: ${new Date().toLocaleString()}
    `.trim();
    
    const blob = new Blob([diseaseReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plant-disease-${result.disease.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error("Error downloading results:", error);
    throw error;
  }
};
