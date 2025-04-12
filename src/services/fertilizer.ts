
/**
 * Service to retrieve fertilizer information and recommendations
 */

// Simple cache for fertilizer recommendations
const fertilizerCache = new Map<string, string[]>();

/**
 * Get fertilizer recommendations for a specific plant or disease
 * @param context Plant type or disease name
 * @returns Array of fertilizer recommendations
 */
export async function getFertilizerInfo(context: string): Promise<string[]> {
  // Check cache first
  if (fertilizerCache.has(context)) {
    return fertilizerCache.get(context) || [];
  }
  
  // In a real application, this would call an external API or database
  // For now, we'll use mock data
  let recommendations: string[];
  
  const lowercaseContext = context.toLowerCase();
  
  if (lowercaseContext.includes('fungal') || lowercaseContext.includes('mildew') || lowercaseContext.includes('rot')) {
    recommendations = [
      'Use fungicide-containing fertilizers with a balanced NPK ratio',
      'Add sulfur-based amendments to increase soil acidity',
      'Apply copper-based fertilizers for fungal disease resistance',
      'Use compost tea as a natural fungicide and fertilizer'
    ];
  } else if (lowercaseContext.includes('nutrient deficiency') || lowercaseContext.includes('yellowing')) {
    recommendations = [
      'Apply complete NPK fertilizer with micronutrients',
      'Use iron supplements for yellowing leaves',
      'Add magnesium sulfate (Epsom salt) for magnesium deficiency',
      'Apply calcium nitrate for calcium deficiency symptoms'
    ];
  } else if (lowercaseContext.includes('succulent') || lowercaseContext.includes('cactus')) {
    recommendations = [
      'Use low-nitrogen, high-phosphorus fertilizer (like 5-10-5)',
      'Apply diluted fertilizer at 1/4 strength during growing season',
      'Add crushed eggshells for calcium supplementation',
      'Use cactus-specific fertilizer formulations'
    ];
  } else if (lowercaseContext.includes('tropical') || lowercaseContext.includes('monstera') || lowercaseContext.includes('philodendron')) {
    recommendations = [
      'Use balanced liquid fertilizer (like 10-10-10) diluted to half strength',
      'Apply slow-release fertilizer pellets at the beginning of growing season',
      'Add fish emulsion for nitrogen and micronutrients',
      'Supplement with magnesium for vibrant foliage'
    ];
  } else {
    // Default general recommendations
    recommendations = [
      'Use balanced all-purpose fertilizer (like 10-10-10)',
      'Apply slow-release fertilizer at the beginning of growing season',
      'Use organic compost to improve soil fertility',
      'Add worm castings for micronutrient enrichment'
    ];
  }
  
  // Cache the results
  fertilizerCache.set(context, recommendations);
  
  return recommendations;
}
