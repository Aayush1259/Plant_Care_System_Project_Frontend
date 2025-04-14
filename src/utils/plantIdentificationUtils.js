
/**
 * Identify plant or disease using Google's Gemini AI
 * @param {string} imageUrl - URL of the image to analyze
 * @param {File|null} imageFile - Raw image file (optional)
 * @param {string} mode - Mode of analysis ("identification" or "disease")
 * @returns {Promise<{result: object, rawResponse: string}>} Analysis result
 */
export const identifyPlantWithGemini = async (imageUrl, imageFile, mode) => {
  // This is a mock implementation - in a real app, this would call the Gemini API
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      if (mode === "identification") {
        resolve({
          result: {
            name: "Monstera Deliciosa",
            scientificName: "Monstera deliciosa",
            confidence: 0.95,
            description: "Monstera deliciosa is a species of flowering plant native to tropical forests of southern Mexico, south to Panama.",
            care: {
              light: "Bright, indirect light",
              water: "Allow soil to dry between waterings",
              soil: "Well-draining potting mix",
              humidity: "Moderate to high",
              temperature: "65-85°F (18-29°C)"
            }
          },
          rawResponse: "JSON response from Gemini API would be here"
        });
      } else if (mode === "disease") {
        resolve({
          result: {
            disease: "Leaf Spot",
            description: "Leaf spot is a common fungal disease that affects many plants. It appears as brown or black spots on leaves.",
            treatment: "Remove affected leaves. Apply fungicide according to package directions. Avoid overhead watering.",
            prevention: "Ensure good air circulation. Avoid wetting the leaves when watering. Apply preventative fungicide during humid periods."
          },
          rawResponse: "JSON response from Gemini API would be here"
        });
      }
    }, 2000);
  });
};
