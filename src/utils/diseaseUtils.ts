
import { storage, db, auth } from "@/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

/**
 * Saves the disease diagnosis to the user's history
 */
export const saveDiagnosisHistory = async (
  selectedImage: string,
  result: any, 
  rawResponse: string,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!selectedImage || !result) return;
  
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save diagnosis history.",
        duration: 5000,
      });
      return;
    }
    
    const response = await fetch(selectedImage);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `diseases/${currentUser.uid}/${Date.now()}`);
    
    await uploadBytes(storageRef, blob);
    
    const downloadURL = await getDownloadURL(storageRef);
    
    const diagnosisData = {
      userId: currentUser.uid,
      plant: result.plant || "Unknown plant",
      disease: result.disease,
      summary: result.summary || "",
      symptoms: result.symptoms,
      cause: result.cause,
      treatment: result.treatment,
      prevention: result.prevention,
      additionalInfo: result.additionalInfo || "",
      rawAnalysis: rawResponse,
      image: downloadURL,
      dateAdded: serverTimestamp(),
    };
    
    await addDoc(collection(db, "diseaseHistory"), diagnosisData);
    
    toast({
      title: "Diagnosis Saved!",
      description: "Plant disease diagnosis has been saved to your history.",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error saving diagnosis:", error);
    toast({
      title: "Error",
      description: "Failed to save diagnosis to your history.",
      variant: "destructive",
      duration: 5000,
    });
  }
};

/**
 * Shares the disease diagnosis results
 */
export const shareResults = async (
  result: any,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!result) return;
  
  try {
    const shareData = {
      title: `Plant Disease: ${result.disease}`,
      text: `I identified a plant disease (${result.disease}) using Plant Care System! ${result.treatment}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
      toast({
        title: "Shared!",
        description: "Disease diagnosis results shared successfully.",
        duration: 3000,
      });
    } else {
      toast({
        title: "Sharing Not Available",
        description: "Your browser doesn't support native sharing.",
        variant: "destructive",
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Error sharing:", error);
    toast({
      title: "Sharing Failed",
      description: "Unable to share results at this time.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

/**
 * Downloads the disease diagnosis results as a text file
 */
export const downloadResults = (
  result: any, 
  rawResponse: string,
  toast: ReturnType<typeof useToast>["toast"]
) => {
  if (!result || !rawResponse) return;
  
  try {
    const content = `
PLANT DISEASE DIAGNOSIS REPORT
==============================
Generated on: ${new Date().toLocaleString()}

DETECTED PLANT: ${result.plant || "Unknown"}
DISEASE: ${result.disease}

${rawResponse}
`;
    
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `PlantDisease_${result.disease.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download Complete",
      description: "Plant disease report downloaded successfully.",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error downloading results:", error);
    toast({
      title: "Download Failed",
      description: "Unable to download results at this time.",
      variant: "destructive",
      duration: 3000,
    });
  }
};
