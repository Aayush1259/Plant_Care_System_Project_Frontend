
/**
 * Service for handling image processing for plant identification and disease detection
 */
export const prepareImageForProcessing = async (
  selectedImage,
  rawImageFile
) => {
  try {
    console.log("Preparing image for processing...");
    
    // Prepare image data for API
    let imageBlob;
    let file;
    
    if (rawImageFile) {
      console.log("Using raw image file:", rawImageFile.name, rawImageFile.type);
      imageBlob = await rawImageFile.slice(0, rawImageFile.size, rawImageFile.type);
      file = new File([imageBlob], rawImageFile.name, { type: rawImageFile.type });
    } else {
      // If we have a data URL but no file, convert to blob
      console.log("Converting URL to blob...");
      const response = await fetch(selectedImage);
      imageBlob = await response.blob();
      const imageType = imageBlob.type || 'image/jpeg';
      file = new File([imageBlob], "plant_image.jpg", { type: imageType });
    }

    // Read the file as base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (!e.target?.result) {
          reject("Failed to process image: FileReader returned no result");
          return;
        }
        
        const base64String = e.target.result.toString();
        const base64Image = base64String.split(',')[1];
        console.log("Image processed successfully, size:", Math.round(base64Image.length / 1024), "KB");
        resolve({ base64Image, file });
      };
      
      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject("Failed to read image file: " + (reader.error?.message || "Unknown error"));
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image for analysis: " + (error instanceof Error ? error.message : String(error)));
  }
};
