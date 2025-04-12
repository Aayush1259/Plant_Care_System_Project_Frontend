
import { identifyPlant } from '../identify-plant';
import { model } from '../../ai-instance';

// Mock the Gemini API
jest.mock('../../ai-instance', () => ({
  model: {
    generateContent: jest.fn(),
  },
  handleAIError: jest.fn((error) => ({ success: false, error: error.message })),
  BaseResponseSchema: {
    extend: jest.fn().mockReturnValue({
      parse: jest.fn((data) => data),
    }),
  },
  ImageInputSchema: {
    parse: jest.fn((data) => data),
  },
}));

describe('identifyPlant', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly process a valid plant identification response', async () => {
    // Mock the Gemini API response
    const mockResponse = {
      response: {
        text: () => `
          Common Name: Peace Lily
          Scientific Name: Spathiphyllum
          Care Tips:
          - Water when top inch of soil is dry
          - Medium to low light
          - High humidity
          Confidence: 92
        `,
      },
    };
    
    (model.generateContent as jest.Mock).mockResolvedValue(mockResponse);

    // Call the function
    const result = await identifyPlant({ imageUrl: 'https://example.com/plant.jpg' });

    // Assertions
    expect(result.success).toBe(true);
    expect(result.commonName).toBe('Peace Lily');
    expect(result.scientificName).toBe('Spathiphyllum');
    expect(result.careTips).toHaveLength(3);
    expect(result.careTips).toContain('Water when top inch of soil is dry');
    expect(result.confidence).toBe(92);
    
    // Verify the API was called with the correct parameters
    expect(model.generateContent).toHaveBeenCalledTimes(1);
    expect(model.generateContent).toHaveBeenCalledWith({
      contents: [
        {
          role: "user",
          parts: [
            { text: expect.stringContaining("You are an expert botanist") },
            { inlineData: { mimeType: "image/jpeg", data: 'https://example.com/plant.jpg' } }
          ]
        }
      ],
    });
  });

  it('should handle errors properly', async () => {
    // Mock an error
    (model.generateContent as jest.Mock).mockRejectedValue(new Error('API error'));

    // Call the function
    const result = await identifyPlant({ imageUrl: 'https://example.com/plant.jpg' });

    // Assertions
    expect(result.success).toBe(false);
    expect(result.error).toBe('API error');
  });
});
