
/**
 * Service for handling image processing for plant identification and disease detection
 */
export const prepareImageForProcessing = async (
  selectedImage: string,
  rawImageFile: File | null
): Promise<{ base64Image: string, file: File }> => {
  try {
    // Prepare image data for API
    let imageBlob: Blob;
    let file: File;
    
    if (rawImageFile) {
      imageBlob = await rawImageFile.slice(0, rawImageFile.size, rawImageFile.type);
      file = new File([imageBlob], rawImageFile.name, { type: rawImageFile.type });
    } else {
      // If we have a data URL but no file, convert to blob
      const response = await fetch(selectedImage);
      imageBlob = await response.blob();
      file = new File([imageBlob], "plant_image.jpg", { type: 'image/jpeg' });
    }

    // Read the file as base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject("Failed to process image");
          return;
        }
        
        const base64Image = e.target.result.toString().split(',')[1];
        resolve({ base64Image, file });
      };
      
      reader.onerror = () => {
        reject("Failed to read image file");
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image for analysis");
  }
};
