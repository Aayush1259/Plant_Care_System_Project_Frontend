
import { storage, db, auth } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

export interface PlantResult {
  name: string;
  scientificName: string;
  summary: string;
  confidence: number;
  careInfo: {
    light: string;
    water: string;
    humidity: string;
    temperature: string;
    soil: string;
  };
  growthInfo: {
    content: string;
  };
  additionalInfo: {
    content: string;
  };
}

export const saveToMyGarden = async (
  selectedImage: string,
  result: PlantResult,
  rawResponse: string,
  experienceLevel: "beginner" | "hobbyist" | "expert"
) => {
  try {
    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save plants to your garden.",
        duration: 5000,
      });
      return false;
    }
    
    // Convert data URL to blob for Firebase Storage
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    
    // Create a reference to Firebase Storage
    const storageRef = ref(storage, `plants/${currentUser.uid}/${Date.now()}`);
    
    // Upload the image
    await uploadBytes(storageRef, blob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Enhanced plant data for Firestore
    const plantData = {
      userId: currentUser.uid,
      name: result.name,
      scientificName: result.scientificName,
      image: downloadURL,
      careInfo: result.careInfo,
      growthInfo: result.growthInfo || {},
      additionalInfo: result.additionalInfo || {},
      rawAnalysis: rawResponse,
      dateAdded: serverTimestamp(),
      experienceLevel: experienceLevel,
    };
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, "garden"), plantData);
    
    toast({
      title: "Plant Saved!",
      description: "Plant has been added to your garden.",
      duration: 3000,
    });
    
    // Also save to history collection for archive purposes
    await addDoc(collection(db, "identificationHistory"), {
      ...plantData,
      type: "identification",
      createdAt: serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error("Error saving plant:", error);
    toast({
      title: "Error",
      description: "Failed to save plant to your garden.",
      variant: "destructive",
      duration: 5000,
    });
    return false;
  }
};

export const shareResults = async (result: PlantResult) => {
  try {
    const shareData = {
      title: `Identified Plant: ${result.name}`,
      text: `I identified ${result.name} (${result.scientificName}) using Plant Care System!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
      toast({
        title: "Shared!",
        description: "Plant identification results shared successfully.",
        duration: 3000,
      });
      return true;
    } else {
      toast({
        title: "Sharing Not Available",
        description: "Your browser doesn't support native sharing.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
  } catch (error) {
    console.error("Error sharing:", error);
    toast({
      title: "Sharing Failed",
      description: "Unable to share results at this time.",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
};

export const downloadResults = (result: PlantResult, rawResponse: string) => {
  try {
    // Create text content
    const content = `
PLANT IDENTIFICATION REPORT
===========================
Generated on: ${new Date().toLocaleString()}

DETECTED PLANT: ${result.name}
SCIENTIFIC NAME: ${result.scientificName}

${rawResponse}
`;
    
    // Create download link
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `PlantID_${result.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Complete",
      description: "Plant identification report downloaded successfully.",
      duration: 3000,
    });
    return true;
  } catch (error) {
    console.error("Error downloading results:", error);
    toast({
      title: "Download Failed",
      description: "Unable to download results at this time.",
      variant: "destructive",
      duration: 3000,
    });
    return false;
  }
};
