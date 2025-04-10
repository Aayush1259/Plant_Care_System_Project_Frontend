
import { useState, useRef } from "react";
import { Camera, Image, RefreshCw, Download, Share2, BookMarked } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import BottomNavbar from "@/components/BottomNavbar";
import { storage, db, auth, GEMINI_API_KEY, GEMINI_API_URL, GEMINI_MODEL, createGeminiPrompt, extractFromGeminiResponse, extractPlantName } from "../firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PlantDisease = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rawImageFile, setRawImageFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [rawResponse, setRawResponse] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "hobbyist" | "expert">("hobbyist");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const galleryImages = [
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png",
    "/lovable-uploads/a9c7c949-919e-41e9-8bf3-1aed6d32adca.png"
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setRawImageFile(file);
      setResult(null);
      setRawResponse("");
      
      toast({
        title: "Image Selected",
        description: "Your plant image has been successfully selected.",
        duration: 3000,
      });
    }
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };
  
  const shareResults = async () => {
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
  
  const downloadResults = () => {
    if (!result || !rawResponse) return;
    
    try {
      // Create text content
      const content = `
PLANT DISEASE DIAGNOSIS REPORT
==============================
Generated on: ${new Date().toLocaleString()}

DETECTED PLANT: ${result.plant || "Unknown"}
DISEASE: ${result.disease}

${rawResponse}
`;
      
      // Create download link
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

  const saveDiagnosisHistory = async () => {
    if (!selectedImage || !result) return;
    
    try {
      // Check if user is logged in
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save diagnosis history.",
          duration: 5000,
        });
        return;
      }
      
      // Convert data URL to blob for Firebase Storage
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      
      // Create a reference to Firebase Storage
      const storageRef = ref(storage, `diseases/${currentUser.uid}/${Date.now()}`);
      
      // Upload the image
      await uploadBytes(storageRef, blob);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save enhanced diagnosis data to Firestore
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
        experienceLevel: experienceLevel,
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

  // Function to convert base64 to file
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      // Prepare image data for Gemini API
      let imageBlob: Blob;
      let file: File;
      
      if (rawImageFile) {
        imageBlob = await rawImageFile.slice(0, rawImageFile.size, rawImageFile.type);
        file = new File([imageBlob], rawImageFile.name, { type: rawImageFile.type });
      } else {
        imageBlob = dataURItoBlob(selectedImage);
        file = new File([imageBlob], "plant_disease.jpg", { type: 'image/jpeg' });
      }

      // Convert image to base64
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (!e.target?.result) {
          setAnalyzing(false);
          toast({
            title: "Error",
            description: "Failed to process image.",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
        
        const base64Image = e.target.result.toString().split(',')[1];
        
        try {
          // Get prompt based on experience level
          const prompt = createGeminiPrompt("disease", experienceLevel);
          
          // Call Gemini API
          const response = await fetch(`${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: file.type,
                      data: base64Image
                    }
                  }
                ]
              }]
            })
          });
          
          const data = await response.json();
          
          if (data.error) {
            console.error("Gemini API error:", data.error);
            setAnalyzing(false);
            toast({
              title: "Error",
              description: "Failed to analyze plant disease. Please try again.",
              variant: "destructive",
              duration: 3000,
            });
            return;
          }
          
          // Parse the response text
          const responseText = data.candidates[0]?.content?.parts[0]?.text || "";
          setRawResponse(responseText);
          
          // Extract information using helper functions
          const plantName = extractPlantName(responseText);
          const disease = extractFromGeminiResponse(responseText, "Disease") || "Unknown disease";
          
          // Extract summary section
          const summarySection = responseText.match(/Quick Summary:([\s\S]*?)(?=\d+\.|$)/i);
          const summary = summarySection ? summarySection[1].trim() : "";
          
          // Extract other sections
          const symptoms = extractFromGeminiResponse(responseText, "Symptoms");
          const cause = extractFromGeminiResponse(responseText, "Cause");
          const treatment = extractFromGeminiResponse(responseText, "Treatment");
          const prevention = extractFromGeminiResponse(responseText, "Prevention");
          
          // Extract additional info section
          const additionalSection = responseText.match(/Additional Information:([\s\S]*?)(?=\d+\.|$)/i);
          const additionalInfo = additionalSection ? additionalSection[1].trim() : "";
          
          // Store the results
          const diseaseResult = {
            plant: plantName,
            disease: disease,
            summary: summary,
            symptoms: symptoms || "No specific symptoms identified",
            cause: cause || "Unknown cause",
            treatment: treatment || "Consult a plant specialist",
            prevention: prevention || "Maintain proper plant care",
            additionalInfo: additionalInfo
          };
          
          setResult(diseaseResult);
          setAnalyzing(false);
          
          toast({
            title: "Disease Detected",
            description: `We've identified: ${diseaseResult.disease}`,
            duration: 3000,
          });
          
        } catch (error) {
          console.error("Error calling Gemini API:", error);
          setAnalyzing(false);
          toast({
            title: "Error",
            description: "Failed to analyze plant disease. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      };
      
      reader.onerror = () => {
        setAnalyzing(false);
        toast({
          title: "Error",
          description: "Failed to process image.",
          variant: "destructive",
          duration: 3000,
        });
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Error processing image:", error);
      setAnalyzing(false);
      toast({
        title: "Error",
        description: "Failed to process image.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="page-container pb-20 animate-fade-in">
      <Header title="Plant Disease Detection" showBack />
      
      {/* Hidden input for file selection */}
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {/* Experience Level Selector */}
      {!analyzing && !result && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Choose your plant knowledge level:</p>
          <Select
            value={experienceLevel}
            onValueChange={(value) => setExperienceLevel(value as "beginner" | "hobbyist" | "expert")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="hobbyist">Hobbyist</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Main Upload Area */}
      <div className="mt-4 bg-grey-100 rounded-lg flex items-center justify-center h-64 overflow-hidden">
        {analyzing ? (
          <div className="flex flex-col items-center">
            <RefreshCw size={48} className="text-grey-400 animate-spin" />
            <p className="mt-2 text-grey-500">Analyzing plant disease...</p>
          </div>
        ) : selectedImage ? (
          <img src={selectedImage} alt="Selected plant" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center">
            <Camera size={48} className="text-grey-400" />
            <p className="mt-2 text-grey-500">Upload a photo of the diseased plant</p>
          </div>
        )}
      </div>
      
      {/* Camera and Gallery Buttons */}
      {!analyzing && !result && (
        <div className="mt-4 flex gap-4">
          <Button 
            className="flex-1 bg-plant-green" 
            onClick={openCamera}
          >
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
          <Button 
            className="flex-1" 
            variant="outline"
            onClick={openGallery}
          >
            <Image className="mr-2 h-4 w-4" />
            Choose from Gallery
          </Button>
        </div>
      )}
      
      {/* Results Section */}
      {result && (
        <div className="mt-6 bg-secondary p-4 rounded-lg">
          <div className="flex flex-col">
            {result.plant && result.plant !== "Unknown" && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Plant:</span>
                <span className="font-medium">{result.plant}</span>
              </div>
            )}
            <h3 className="font-semibold text-lg mt-2">Disease: {result.disease}</h3>
          </div>
          
          {result.summary && (
            <div className="mt-4 bg-gray-50 p-3 rounded-md">
              <p className="text-sm">{result.summary}</p>
            </div>
          )}
          
          <Accordion type="single" collapsible className="mt-4">
            <AccordionItem value="symptoms">
              <AccordionTrigger className="text-md font-medium">Symptoms</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.symptoms}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="cause">
              <AccordionTrigger className="text-md font-medium">Cause</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.cause}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="treatment">
              <AccordionTrigger className="text-md font-medium">Treatment</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.treatment}</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="prevention">
              <AccordionTrigger className="text-md font-medium">Prevention</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm whitespace-pre-line">{result.prevention}</p>
              </AccordionContent>
            </AccordionItem>
            
            {result.additionalInfo && (
              <AccordionItem value="additional">
                <AccordionTrigger className="text-md font-medium">Additional Information</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm whitespace-pre-line">{result.additionalInfo}</p>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
          
          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button 
              className="w-full bg-plant-green" 
              onClick={saveDiagnosisHistory}
            >
              <BookMarked className="mr-2 h-4 w-4" />
              Save Diagnosis
            </Button>
            
            <Button
              className="w-full"
              variant="outline"
              onClick={shareResults}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button
              className="w-full col-span-2"
              variant="secondary"
              onClick={downloadResults}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      )}
      
      {/* Sample Gallery for quick testing */}
      {!result && !analyzing && (
        <div className="mt-6 mb-4">
          <p className="text-sm text-grey-500 mb-2">Or pick a sample image:</p>
          <div className="grid grid-cols-4 gap-2">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                onClick={() => {
                  setSelectedImage(image);
                  setRawImageFile(null);
                  setResult(null);
                  setRawResponse("");
                }}
              >
                <img src={image} alt={`Gallery image ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Analyze Button */}
      {selectedImage && !result && !analyzing && (
        <Button 
          className="w-full bg-plant-green mt-4" 
          onClick={analyzeImage}
          disabled={analyzing}
        >
          Analyze Disease
        </Button>
      )}

      {/* Try Another Button */}
      {result && (
        <Button 
          className="w-full mt-4" 
          variant="outline" 
          onClick={() => {
            setSelectedImage(null);
            setRawImageFile(null);
            setResult(null);
            setRawResponse("");
          }}
        >
          Analyze Another Plant
        </Button>
      )}
      
      <BottomNavbar />
    </div>
  );
};

export default PlantDisease;
