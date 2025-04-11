
/**
 * Utility functions for generating prompts for different types of plant analysis
 */

/**
 * Creates a prompt for plant identification
 * @returns A structured prompt for plant identification
 */
export const createIdentificationPrompt = (): string => {
  return "Analyze this plant image and provide details in the following format:\n\n" +
    "1. Detected Plant: [name of the plant species]\n" +
    "2. Scientific Name: [latin name]\n" +
    "3. Quick Summary:\n" +
    "   - Brief description of the plant\n" +
    "   - Native origin\n" +
    "   - Common uses\n\n" +
    "4. Care Information:\n" +
    "   - Light: [light requirements]\n" +
    "   - Water: [watering needs]\n" +
    "   - Humidity: [humidity requirements]\n" +
    "   - Temperature: [ideal temperature range]\n" +
    "   - Soil: [soil preferences]\n\n" +
    "5. Growth Information:\n" +
    "   - Expected size/height\n" +
    "   - Growth rate\n" +
    "   - Special considerations\n\n" +
    "6. Additional Tips:\n" +
    "   - Common issues to watch for\n" +
    "   - Seasonal care adjustments\n" +
    "   - Propagation methods\n\n" +
    "Begin your report with 'Detected Plant:' followed by the species name.";
};

/**
 * Creates a prompt for plant disease analysis
 * @returns A structured prompt for plant disease analysis
 */
export const createDiseasePrompt = (): string => {
  return "Analyze this plant/leaf image and provide a detailed report on any diseases or issues:\n\n" +
    "0. Detected Plant: [identify the plant species]\n" +
    "1. Disease: [name of disease or problem]\n" +
    "2. Quick Summary:\n" +
    "   - Severity level\n" +
    "   - Urgency of treatment\n\n" +
    "3. Symptoms:\n" +
    "   - Visible symptoms in the image\n" +
    "   - Progression of symptoms\n\n" +
    "4. Cause:\n" +
    "   - What causes this disease/condition\n" +
    "   - Contributing factors\n\n" +
    "5. Treatment:\n" +
    "   - Immediate steps\n" +
    "   - Ongoing treatment\n" +
    "   - Products or methods to use\n\n" +
    "6. Prevention:\n" +
    "   - How to prevent this in the future\n" +
    "   - Early warning signs\n\n" +
    "7. Additional Information:\n" +
    "   - Impact on plant health\n" +
    "   - Potential spread to other plants\n\n" +
    "Begin your report with 'Detected Plant:' followed by the species name.";
};
