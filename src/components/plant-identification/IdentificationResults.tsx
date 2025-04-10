
import React from "react";
import { BookMarked, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PlantResult {
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

interface IdentificationResultsProps {
  result: PlantResult;
  onSaveToGarden: () => Promise<void>;
  onShareResults: () => Promise<void>;
  onDownloadResults: () => void;
  onIdentifyAnother: () => void;
}

const IdentificationResults: React.FC<IdentificationResultsProps> = ({
  result,
  onSaveToGarden,
  onShareResults,
  onDownloadResults,
  onIdentifyAnother,
}) => {
  return (
    <div className="mt-6 bg-secondary p-4 rounded-lg">
      <h3 className="font-semibold text-lg">{result.name}</h3>
      <p className="text-sm text-grey-500 italic">{result.scientificName}</p>
      <p className="text-sm mt-1">Match confidence: {result.confidence}%</p>
      
      {result.summary && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <p className="text-sm">{result.summary}</p>
        </div>
      )}
      
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="care">
          <AccordionTrigger className="text-md font-medium">Care Information</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-sm">
              <li><span className="font-medium">Light:</span> {result.careInfo.light}</li>
              <li><span className="font-medium">Water:</span> {result.careInfo.water}</li>
              <li><span className="font-medium">Humidity:</span> {result.careInfo.humidity}</li>
              <li><span className="font-medium">Temperature:</span> {result.careInfo.temperature}</li>
              {result.careInfo.soil && (
                <li><span className="font-medium">Soil:</span> {result.careInfo.soil}</li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
        
        {result.growthInfo?.content && (
          <AccordionItem value="growth">
            <AccordionTrigger className="text-md font-medium">Growth Information</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm whitespace-pre-line">{result.growthInfo.content}</p>
            </AccordionContent>
          </AccordionItem>
        )}
        
        {result.additionalInfo?.content && (
          <AccordionItem value="additional">
            <AccordionTrigger className="text-md font-medium">Additional Tips</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm whitespace-pre-line">{result.additionalInfo.content}</p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          className="w-full bg-plant-green" 
          onClick={onSaveToGarden}
        >
          <BookMarked className="mr-2 h-4 w-4" />
          Save to Garden
        </Button>
        
        <Button
          className="w-full"
          variant="outline"
          onClick={onShareResults}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        
        <Button
          className="w-full col-span-2"
          variant="secondary"
          onClick={onDownloadResults}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Try Another Button */}
      <Button 
        className="w-full mt-4" 
        variant="outline" 
        onClick={onIdentifyAnother}
      >
        Identify Another Plant
      </Button>
    </div>
  );
};

export default IdentificationResults;
