
import { saveAs } from "file-saver";

/**
 * Save the diagnosis to user history
 */
export const saveDiagnosisHistory = (imageUrl, result, rawResponse, toast) => {
  try {
    // In a real app, this would save to a database or local storage
    console.log("Saving diagnosis:", { imageUrl, result, timestamp: new Date() });
    
    // For demo purposes, just show a toast
    toast({
      title: "Diagnosis Saved",
      description: "This diagnosis has been saved to your history",
      duration: 3000,
    });
    
    return true;
  } catch (error) {
    console.error("Error saving diagnosis:", error);
    toast({
      title: "Error",
      description: "Failed to save diagnosis",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
};

/**
 * Share the diagnosis results
 */
export const shareResults = (result, toast) => {
  try {
    // Check if Web Share API is supported
    if (navigator.share) {
      navigator.share({
        title: `Plant Disease: ${result.disease}`,
        text: `I identified a plant disease using GreenGarden: ${result.disease}. Treatment suggestions: ${result.treatment?.[0] || 'N/A'}`,
      });
    } else {
      // Fallback to clipboard copy
      const shareText = `Plant Disease: ${result.disease}\nTreatment: ${result.treatment?.join(', ') || 'N/A'}`;
      navigator.clipboard.writeText(shareText);
      
      toast({
        title: "Copied to Clipboard",
        description: "Results copied to clipboard. You can now paste and share it.",
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Error sharing diagnosis:", error);
    toast({
      title: "Error",
      description: "Failed to share results",
      variant: "destructive",
      duration: 3000,
    });
  }
};

/**
 * Download the diagnosis results as a text file
 */
export const downloadResults = (result, rawResponse, toast) => {
  try {
    const filename = `plant-disease-${new Date().toISOString().slice(0, 10)}.txt`;
    
    let content = `
PLANT DISEASE DIAGNOSIS
======================
Date: ${new Date().toLocaleString()}

SUMMARY:
- Plant: ${result.plant || "Unknown"}
- Disease: ${result.disease}
- Severity: ${result.severity || "Moderate"}

TREATMENT RECOMMENDATIONS:
${result.treatment?.map(item => `- ${item}`).join('\n') || "No specific treatment recommendations."}

PREVENTION:
${result.prevention?.map(item => `- ${item}`).join('\n') || "No specific prevention recommendations."}

FULL ANALYSIS:
${rawResponse || "Detailed analysis not available."}
    `.trim();
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
    
    toast({
      title: "Download Complete",
      description: `Diagnosis saved as ${filename}`,
      duration: 3000,
    });
  } catch (error) {
    console.error("Error downloading diagnosis:", error);
    toast({
      title: "Error",
      description: "Failed to download results",
      variant: "destructive",
      duration: 3000,
    });
  }
};
